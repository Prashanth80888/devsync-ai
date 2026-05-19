import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

// Helper utility to programmatically generate clean, index-safe slugs
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Strips out irregular punctuation characters
    .replace(/[\s_-]+/g, '-') // Transforms whitespace buffers into a single hyphen
    .replace(/^-+|-+$/g, ''); // Trims trailing or leading hyphens cleanly
};

/**
 * @desc    Create a new sovereign organization corporate cluster
 * @route   POST /api/v1/orgs
 * @access  Private (Authenticated Users)
 */
export const createOrganization = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return next(new AppError('Please supply a valid organization workspace handle name.', 400));
  }

  const generatedSlug = generateSlug(name);

  // 1. Ensure the URL handle slug is globally distinct to avoid routing collisions
  const existingOrg = await prisma.organization.findUnique({
    where: { slug: generatedSlug }
  });
  if (existingOrg) {
    return next(new AppError('An organization cluster using this string handle already exists. Try an alternate name.', 400));
  }

  // 2. Execute atomic multi-model updates using an explicit Prisma Transaction database pipe
  const updatedWorkspaceCluster = await prisma.$transaction(async (tx) => {
    // Generate the organization cluster record
    const newOrg = await tx.organization.create({
      data: {
        name,
        slug: generatedSlug
      }
    });

    // Update the creator's profile data to point to the new organization and promote their role
    await tx.user.update({
      where: { id: userId },
      data: {
        orgId: newOrg.id,
        role: 'ORG_ADMIN'
      }
    });

    return newOrg;
  });

  res.status(201).json({
    status: 'success',
    data: { organization: updatedWorkspaceCluster }
  });
});

/**
 * @desc    Retrieve core metadata statistics for a target organization slug
 * @route   GET /api/v1/orgs/:slug
 * @access  Private (Authenticated Users)
 */
export const getOrganizationBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const targetOrganization = await prisma.organization.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { users: true, teams: true, projects: true }
      }
    }
  });

  if (!targetOrganization) {
    return next(new AppError('Requested organization profile domain was not located.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { organization: targetOrganization }
  });
});