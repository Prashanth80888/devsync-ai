import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

/**
 * @desc    Initialize an engineering unit squad team inside an organization workspace
 * @route   POST /api/v1/teams
 * @access  Private
 */
export const createTeam = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const orgId = req.user.orgId;

  if (!name) {
    return next(new AppError('Please supply a standard nomenclature label for this engineering team.', 400));
  }

  // Isolate team assets completely inside a single organization boundary partition
  const team = await prisma.team.create({
    data: {
      name,
      orgId
    }
  });

  // Automatically add the creator into the TeamMember table as an initial member
  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: req.user.id
    }
  });

  res.status(201).json({
    status: 'success',
    data: { team }
  });
});

/**
 * @desc    Get all teams mapped to the active organization tenant workspace environment
 * @route   GET /api/v1/teams
 * @access  Private
 */
export const getAllTeams = asyncHandler(async (req, res, next) => {
  const orgId = req.user.orgId;

  const teams = await prisma.team.findMany({
    where: { orgId },
    include: {
      _count: {
        select: { members: true, projects: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  res.status(200).json({
    status: 'success',
    results: teams.length,
    data: { teams }
  });
});