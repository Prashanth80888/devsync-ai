import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';
import { getIO } from '../socket.js';

const prisma = new PrismaClient();

/**
 * @desc    Create a new task pinned inside a target project workspace
 * @route   POST /api/v1/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res, next) => {

  const {
    title,
    description,
    status,
    priority,
    dueDate,
    projectId,
    assigneeId
  } = req.body;

  const creatorId = req.user.id;
  const orgId = req.user.orgId;

  if (!title || !projectId) {

    return next(
      new AppError(
        'Please supply both a task title and valid project identification mapping.',
        400
      )
    );
  }

  // ==================================================
  // VERIFY PROJECT OWNERSHIP
  // ==================================================

  const parentProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      orgId
    }
  });

  if (!parentProject) {

    return next(
      new AppError(
        'Target project asset not discovered within this workspace organization.',
        404
      )
    );
  }

  // ==================================================
  // CREATE TASK
  // ==================================================

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
        select: {
          id: true,
          fullName: true,
          avatarUrl: true
        }
      }
    }
  });

  // ==================================================
  // SOCKET.IO REAL-TIME EVENT
  // ==================================================

  getIO()
    .to(projectId)
    .emit('task:created', task);

  // ==================================================
  // RESPONSE
  // ==================================================

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

  // ==================================================
  // VERIFY PROJECT ACCESS
  // ==================================================

  const targetProject = await prisma.project.findFirst({

    where: {
      id: projectId,
      orgId
    }

  });

  if (!targetProject) {

    return next(
      new AppError(
        'Target project context not discovered or access is denied.',
        404
      )
    );
  }

  // ==================================================
  // FETCH TASKS
  // ==================================================

  const tasks = await prisma.task.findMany({

    where: { projectId },

    include: {

      assignee: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true
        }
      },

      creator: {
        select: {
          id: true,
          fullName: true
        }
      }

    },

    orderBy: {
      createdAt: 'asc'
    }

  });

  // ==================================================
  // RESPONSE
  // ==================================================

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

  // ==================================================
  // VERIFY TASK ACCESS
  // ==================================================

  const targetTask = await prisma.task.findFirst({

    where: {
      id,

      project: {
        orgId
      }
    }

  });

  if (!targetTask) {

    return next(
      new AppError(
        'Targeted task asset was not discovered inside this workspace organization.',
        404
      )
    );
  }

  // ==================================================
  // FORMAT DATE
  // ==================================================

  if (updates.dueDate) {
    updates.dueDate = new Date(updates.dueDate);
  }

  // ==================================================
  // UPDATE TASK
  // ==================================================

  const updatedTask = await prisma.task.update({

    where: { id },

    data: updates,

    include: {

      assignee: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true
        }
      }

    }

  });

  // ==================================================
  // SOCKET.IO REAL-TIME UPDATE EVENT
  // ==================================================

  getIO()
    .to(targetTask.projectId)
    .emit('task:updated', updatedTask);

  // ==================================================
  // RESPONSE
  // ==================================================

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

  // ==================================================
  // VERIFY TASK ACCESS
  // ==================================================

  const targetTask = await prisma.task.findFirst({

    where: {
      id,

      project: {
        orgId
      }
    }

  });

  if (!targetTask) {

    return next(
      new AppError(
        'Targeted task asset not located.',
        404
      )
    );
  }

  // ==================================================
  // DELETE TASK
  // ==================================================

  await prisma.task.delete({
    where: { id }
  });

  // ==================================================
  // SOCKET.IO DELETE EVENT
  // ==================================================

  getIO()
    .to(targetTask.projectId)
    .emit('task:deleted', {
      id: targetTask.id
    });

  // ==================================================
  // RESPONSE
  // ==================================================

  res.status(204).json({
    status: 'success',
    data: null
  });

});