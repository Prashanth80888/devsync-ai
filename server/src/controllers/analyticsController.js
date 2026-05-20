import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

// ==================================================
// GEMINI AI INITIALIZATION
// ==================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ==================================================
// WORKSPACE SUMMARY METRICS
// ==================================================

/**
 * @desc    Calculate and compile production workflow metrics and status trends
 * @route   GET /api/v1/analytics/summary
 * @access  Private
 */
export const getWorkspaceSummaryMetrics = asyncHandler(async (req, res, next) => {

  const orgId = req.user.orgId;

  if (!orgId) {
    return next(
      new AppError(
        'No valid organization workspace context detected.',
        400
      )
    );
  }

  // ==================================================
  // PARALLEL METRIC QUERIES
  // ==================================================

  const [
    statusGroups,
    priorityGroups,
    totalProjects,
    totalTeams
  ] = await Promise.all([

    prisma.task.groupBy({
      by: ['status'],
      where: {
        project: { orgId }
      },
      _count: {
        _all: true
      }
    }),

    prisma.task.groupBy({
      by: ['priority'],
      where: {
        project: { orgId }
      },
      _count: {
        _all: true
      }
    }),

    prisma.project.count({
      where: { orgId }
    }),

    prisma.team.count({
      where: { orgId }
    })

  ]);

  // ==================================================
  // FORMAT STATUS DISTRIBUTION
  // ==================================================

  const statusDistribution = {
    BACKLOG: 0,
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    DONE: 0
  };

  statusGroups.forEach((group) => {

    if (statusDistribution[group.status] !== undefined) {
      statusDistribution[group.status] = group._count._all;
    }

  });

  // ==================================================
  // FORMAT PRIORITY DISTRIBUTION
  // ==================================================

  const priorityDistribution = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0
  };

  priorityGroups.forEach((group) => {

    if (priorityDistribution[group.priority] !== undefined) {
      priorityDistribution[group.priority] = group._count._all;
    }

  });

  // ==================================================
  // VELOCITY CALCULATION
  // ==================================================

  const totalTasks =
    Object.values(statusDistribution)
      .reduce((a, b) => a + b, 0);

  const completedTasks =
    statusDistribution.DONE || 0;

  const projectVelocity =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // ==================================================
  // RESPONSE
  // ==================================================

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

// ==================================================
// GENERATE AI PROJECT ANALYTICS REPORT
// ==================================================

/**
 * @desc    Generate AI-powered analytics report
 * @route   POST /api/v1/analytics/project/:projectId/generate
 * @access  Private
 */
export const generateProjectAnalytics = asyncHandler(async (req, res) => {

  const { projectId } = req.params;

  const userId = req.user.id;

  // ==================================================
  // VERIFY PROJECT EXISTS
  // ==================================================

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    }
  });

  if (!project) {

    return res.status(404).json({
      message: 'Target project not found'
    });

  }

  // ==================================================
  // COLLECT METRICS
  // ==================================================

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    backlogTasks,
    playgroundCount,
    playgrounds
  ] = await prisma.$transaction([

    prisma.task.count({
      where: {
        projectId
      }
    }),

    prisma.task.count({
      where: {
        projectId,
        status: 'DONE'
      }
    }),

    prisma.task.count({
      where: {
        projectId,
        status: 'IN_PROGRESS'
      }
    }),

    prisma.task.count({
      where: {
        projectId,
        status: 'BACKLOG'
      }
    }),

    prisma.codePlayground.count({
      where: {
        projectId
      }
    }),

    prisma.codePlayground.findMany({
      where: {
        projectId
      },

      select: {
        aiReviewCache: true
      }
    })

  ]);

  // ==================================================
  // CALCULATE VELOCITY SCORE
  // ==================================================

  const velocityScore =
    totalTasks > 0
      ? parseFloat(
          (
            (completedTasks / totalTasks) * 100
          ).toFixed(1)
        )
      : 0.0;

  // ==================================================
  // DETECT SECURITY WARNINGS
  // ==================================================

  let criticalSecurityWarnings = 0;

  playgrounds.forEach((sandbox) => {

    if (
      sandbox.aiReviewCache &&
      typeof sandbox.aiReviewCache === 'string'
    ) {

      const lowerCache =
        sandbox.aiReviewCache.toLowerCase();

      if (
        lowerCache.includes('critical') ||
        lowerCache.includes('security risk')
      ) {

        criticalSecurityWarnings++;

      }
    }

  });

  // ==================================================
  // BUILD GEMINI PROMPT
  // ==================================================

  const prompt = `
    You are an expert technical product manager and engineering systems auditor.

    Analyze the following operational data metrics collected from project team workflows:

    PROJECT METRICS DATA PROFILE:
    - Total Tasks Tracked: ${totalTasks}
    - Completed Tasks: ${completedTasks}
    - Pending Tasks (In-Flight): ${pendingTasks}
    - Backlog Items: ${backlogTasks}
    - Velocity Progress Score: ${velocityScore}%
    - Code Sandbox Environments: ${playgroundCount}
    - Active Critical Security Code Warnings: ${criticalSecurityWarnings}

    Based on these data fields, deliver a comprehensive diagnostic assessment profile.

    Your response MUST be formatted strictly as a valid JSON object string.
    Do not wrap it in markdown code blocks.

    Expected JSON structure:
    {
      "executiveSummary": "A concise paragraph summarizing development health, operational momentum, and cross-team execution status.",
      "bottleneckAnalysis": "A deep analysis identifying friction points, risks, or balance discrepancies based on backlogs or high security warnings.",
      "recommendedActions": [
        "Actionable recommendation 1",
        "Actionable recommendation 2",
        "Actionable recommendation 3"
      ],
      "projectHealthRating": "EXCELLENT"
    }
  `;

  // ==================================================
  // GEMINI API REQUEST
  // ==================================================

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',

    contents: prompt,

    config: {
      responseMimeType: 'application/json'
    }
  });

  const aiOutputText = response.text;

  const aiParsedData =
    JSON.parse(aiOutputText);

  // ==================================================
  // STORE REPORT
  // ==================================================

  const newReport =
    await prisma.analyticsReport.create({

      data: {

        projectId,
        generatedById: userId,

        totalTasks,
        completedTasks,
        pendingTasks,
        backlogTasks,

        velocityScore,

        playgroundCount,

        criticalSecurityWarnings,

        executiveSummary:
          aiParsedData.executiveSummary,

        bottleneckAnalysis:
          aiParsedData.bottleneckAnalysis,

        recommendedActions:
          aiParsedData.recommendedActions || [],

        projectHealthRating:
          aiParsedData.projectHealthRating || 'STABLE'
      }

    });

  // ==================================================
  // RESPONSE
  // ==================================================

  return res.status(201).json({
    status: 'success',

    data: {
      report: newReport
    }
  });

});

// ==================================================
// FETCH LATEST ANALYTICS REPORT
// ==================================================

/**
 * @desc    Fetch latest analytics report for dashboard
 * @route   GET /api/v1/analytics/project/:projectId/latest
 * @access  Private
 */
export const getLatestProjectAnalytics = asyncHandler(async (req, res) => {

  const { projectId } = req.params;

  const latestReport =
    await prisma.analyticsReport.findFirst({

      where: {
        projectId
      },

      orderBy: {
        createdAt: 'desc'
      }

    });

  if (!latestReport) {

    return res.status(404).json({
      message: 'No metric reports generated for this project yet.'
    });

  }

  return res.status(200).json({
    status: 'success',

    data: {
      report: latestReport
    }
  });

});