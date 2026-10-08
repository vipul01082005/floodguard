import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authLimiter } from '../middleware/rateLimit';
import { AuthError } from '../utils/errors';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-secure-secret';

authRouter.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  
  if (process.env.DEMO_MODE !== 'true') {
    throw new AuthError('Only demo mode is supported currently');
  }

  if (!email || !password) {
    throw new AuthError('Email and password required');
  }

  const role = email.includes('admin') ? 'admin' : 'user';
  const token = jwt.sign({ id: 'demo-user-123', email, role }, JWT_SECRET, { expiresIn: '24h' });

  res.json({ token, user: { id: 'demo-user-123', email, role } });
});

authRouter.post('/register', authLimiter, (req, res) => {
  const { email, password, name } = req.body;
  const token = jwt.sign({ id: 'demo-user-123', email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ token, user: { id: 'demo-user-123', email, role: 'user', name } });
});

authRouter.post('/logout', requireAuth, (req, res) => {
  res.json({ success: true });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
