import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

/**
 * @desc    Create a new task pinned inside a target project workspace
 * @route   POST /api/v1/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;
  const creatorId = req.user.id;
  const orgId = req.user.orgId;

  if (!title || !projectId) {
    return next(new AppError('Please supply both a task title and valid project identification mapping.', 400));
  }

  // 1. Verify the targeted project asset actually belongs to the user's organization
  const parentProject = await prisma.project.findFirst({
    where: { id: projectId, orgId }
  });

  if (!parentProject) {
    return next(new AppError('Target project asset not discovered within this workspace organization.', 404));
  }

  // 2. Commit the new task to the database
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      assigneeId: assigneeId || null,
      creatorId
    },
    include: {
      assignee: {
        select: { id: true, fullName: true, avatarUrl: true }
      }
    }
  });

  res.status(201).json({
    status: 'success',
    data: { task }
  });
});

/**
 * @desc    Retrieve all tasks associated with a targeted workspace project asset
 * @route   GET /api/v1/tasks/project/:projectId
 * @access  Private
 */
export const getProjectTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const orgId = req.user.orgId;

  // Verify the project exists within the user's organization tenant boundary
  const targetProject = await prisma.project.findFirst({
    where: { id: projectId, orgId }
  });

  if (!targetProject) {
    return next(new AppError('Target project context not discovered or access is denied.', 404));
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: {
        select: { id: true, fullName: true, avatarUrl: true }
      },
      creator: {
        select: { id: true, fullName: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  });
});

/**
 * @desc    Modify standard parameters or drop states for a targeted task item
 * @route   PATCH /api/v1/tasks/:id
 * @access  Private
 */
export const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.orgId;
  const updates = req.body;

  // Locate task item through a cross-relation boundary to ensure it belongs to the user's organization
  const targetTask = await prisma.task.findFirst({
    where: {
      id,
      project: { orgId }
    }
  });

  if (!targetTask) {
    return next(new AppError('Targeted task asset was not discovered inside this workspace organization.', 404));
  }

  // Safe format date parameters if a custom delivery deadline is applied
  if (updates.dueDate) {
    updates.dueDate = new Date(updates.dueDate);
  }

  // Commit task modifications cleanly
  const updatedTask = await prisma.task.update({
    where: { id },
    data: updates,
    include: {
      assignee: {
        select: { id: true, fullName: true, avatarUrl: true }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { task: updatedTask }
  });
});

/**
 * @desc    Permanently wipe a task document record from the cluster database
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.orgId;

  const targetTask = await prisma.task.findFirst({
    where: {
      id,
      project: { orgId }
    }
  });

  if (!targetTask) {
    return next(new AppError('Targeted task asset not located.', 404));
  }

  await prisma.task.delete({ where: { id } });

  res.status(204).json({
    status: 'success',
    data: null
  });
});