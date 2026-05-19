import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

/**
 * @desc    Calculate and compile production workflow metrics and status trends
 * @route   GET /api/v1/analytics/summary
 * @access  Private
 */
export const getWorkspaceSummaryMetrics = asyncHandler(async (req, res, next) => {
  const orgId = req.user.orgId;

  if (!orgId) {
    return next(new AppError('No valid organization workspace context detected.', 400));
  }

  // 1. Run parallel database queries using native multi-tenant filters
  const [statusGroups, priorityGroups, totalProjects, totalTeams] = await Promise.all([
    // Group tasks and calculate distributions across status lanes
    prisma.task.groupBy({
      by: ['status'],
      where: { project: { orgId } },
      _count: { _all: true }
    }),
    
    // Group tasks and calculate priorities
    prisma.task.groupBy({
      by: ['priority'],
      where: { project: { orgId } },
      _count: { _all: true }
    }),

    // Count overall organizational workspace assets
    prisma.project.count({ where: { orgId } }),
    prisma.team.count({ where: { orgId } })
  ]);

  // 2. Format Prisma's raw database arrays into a clean object structure for the UI
  const statusDistribution = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, DONE: 0 };
  statusGroups.forEach(group => {
    if (statusDistribution[group.status] !== undefined) {
      statusDistribution[group.status] = group._count._all;
    }
  });

  const priorityDistribution = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  priorityGroups.forEach(group => {
    if (priorityDistribution[group.priority] !== undefined) {
      priorityDistribution[group.priority] = group._count._all;
    }
  });

  // Calculate the completion velocity percentage safely
  const totalTasks = Object.values(statusDistribution).reduce((a, b) => a + b, 0);
  const completedTasks = statusDistribution.DONE || 0;
  const projectVelocity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalProjects,
        totalTeams,
        totalTasks,
        projectVelocity
      },
      statusDistribution,
      priorityDistribution
    }
  });
});