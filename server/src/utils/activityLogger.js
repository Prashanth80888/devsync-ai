import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Standardized global utility to record actions inside the workspace database
 * @param {Object} params
 * @param {string} params.actionType - Type of action (e.g., 'TASK_CREATED', 'PROJECT_LAUNCHED')
 * @param {string} params.description - Human-readable explanation of the operation
 * @param {string} params.userId - ID of the user triggering the action
 * @param {string} params.orgId - Current multi-tenant company workspace isolation code
 * @param {string} [params.projectId] - Optional target project link
 * @param {string} [params.teamId] - Optional target engineering team link
 */
export const logActivity = async ({ actionType, description, userId, orgId, projectId = null, teamId = null }) => {
  try {
    // Write the audit log asynchronously to ensure it never blocks the main API response
    await prisma.activityLog.create({
      data: {
        actionType,
        description,
        userId,
        orgId,
        projectId,
        teamId
      }
    });
  } catch (error) {
    // Log failure server-side without crashing the active client request thread
    console.error(`[AUDIT LOG CRITICAL FAILURE]: Failed to record system event [${actionType}]:`, error);
  }
};