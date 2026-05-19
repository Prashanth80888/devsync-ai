import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from './errorMiddleware.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Core Route Security Guard Middleware
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read token from industry-standard HTTP Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Fail instantly if no active token structure is located
  if (!token) {
    return next(new AppError('You are not logged inside an active session. Please authenticate.', 401));
  }

  try {
    // Verify token validity using our environment security key
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the owner of the token from the relational database cluster
    const structuralUser = await prisma.user.findUnique({
      where: { id: decodedPayload.id },
      select: { id: true, email: true, fullName: true, role: true, orgId: true } // Avoid picking up password hashes
    });

    if (!structuralUser) {
      return next(new AppError('The user account owning this verified session no longer exists.', 401));
    }

    // Attach the authenticated user schema information directly into the request object flow
    req.user = structuralUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token signature session parameters. Access Denied.', 401));
  }
});