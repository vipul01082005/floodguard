import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimit';
import { demoReports } from '../services/demoDataService';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin, adminLimiter);

adminRouter.get('/metrics', (req, res) => {
  res.json({
    metrics: {
      activeAlerts: 12,
      pendingReports: 4,
      systemHealth: 98.5,
      activeUsers: 154
    }
  });
});

adminRouter.get('/reports', (req, res) => {
  res.json({ reports: demoReports });
});
