import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

/**
 * @desc    Update authenticated user profile information data
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName } = req.body;

  if (!fullName || !fullName.trim()) {
    return next(new AppError('Profile signature title name cannot be empty.', 400));
  }

  // Explicitly apply a secure projection update to defend against parameter injection
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { fullName: fullName.trim() },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      orgId: true,
      createdAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});