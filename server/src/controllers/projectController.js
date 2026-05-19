import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

/**
 * @desc    Create a new project workspace under the user's current organization
 * @route   POST /api/v1/projects
 * @access  Private
 */
export const createProject = asyncHandler(async (req, res, next) => {
  const { name, description, teamId } = req.body;
  const orgId = req.user.orgId; // Auto-extracted via the protect security layer

  if (!orgId) {
    return next(new AppError('You must belong to an active organization workspace to initialize a project.', 400));
  }

  if (!name) {
    return next(new AppError('Please supply a descriptive name for this project asset.', 400));
  }

  // Build the project resource and map it safely to our multi-tenant boundary parameters
  const project = await prisma.project.create({
    data: {
      name,
      description,
      orgId,
      teamId: teamId || null
    }
  });

  res.status(201).json({
    status: 'success',
    data: { project }
  });
});

/**
 * @desc    Retrieve all projects belonging to the user's organization workspace cluster
 * @route   GET /api/v1/projects
 * @access  Private
 */
export const getAllProjects = asyncHandler(async (req, res, next) => {
  const orgId = req.user.orgId;

  if (!orgId) {
    return next(new AppError('Unauthorized access parameters detected.', 403));
  }

  // Fetch projects and use relational aggregation operators for quick counts
  const projects = await prisma.project.findMany({
    where: { orgId },
    include: {
      team: {
        select: { id: true, name: true }
      },
      _count: {
        select: { tasks: true } // Supplies an instant analytical tally of child tasks
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: { projects }
  });
});