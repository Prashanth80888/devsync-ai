import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

// Helper utility to sign enterprise-grade authentication tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Session locks automatically after 7 calendar days
  });
};

/**
 * @desc    Register a new user account
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  // 1. Enforce rigorous schema field validation inputs
  if (!email || !password || !fullName) {
    return next(new AppError('Please supply all required registration parameters (email, password, fullName).', 400));
  }

  // 2. Prevent account registration with duplicate email references
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new AppError('An engineering account utilizing this email address already exists.', 400));
  }

  // 3. Cryptographically secure and scramble the user password string
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Commit user credentials cleanly into the database
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true
    }
  });

  // 5. Generate validation token and send payload to frontend
  const token = generateToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
});

/**
 * @desc    Authenticate existing platform credentials
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Verify credential parameters are supplied
  if (!email || !password) {
    return next(new AppError('Please supply both an email address and account password.', 400));
  }

  // 2. Fetch user profile record along with password hash for comparison
  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) {
    return next(new AppError('Invalid authentication credentials supplied.', 401));
  }

  // 3. Compare raw input against stored database password cryptographic hash
  const holdsValidPassword = await bcrypt.compare(password, targetUser.password);
  if (!holdsValidPassword) {
    return next(new AppError('Invalid authentication credentials supplied.', 401));
  }

  // 4. Establish signed authorization payload token
  const token = generateToken(targetUser.id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: targetUser.id,
        email: targetUser.email,
        fullName: targetUser.fullName,
        role: targetUser.role,
        orgId: targetUser.orgId
      }
    }
  });
});

/**
 * @desc    Retrieve verified profile telemetry for active session owner
 * @route   GET /api/v1/auth/me
 * @access  Private (Protected by guard)
 */
export const getCurrentUserProfile = asyncHandler(async (req, res, next) => {
  // User profile structure is auto-injected onto the request directly by the protect middleware
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});