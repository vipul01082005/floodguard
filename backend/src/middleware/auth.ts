import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-secure-secret';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'responder';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt', { token });
    throw new AuthError('Invalid or expired token');
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AuthError('Authentication required');
  }
  if (req.user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
  next();
};
