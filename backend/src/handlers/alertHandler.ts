import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export const alertRouter = Router();

const alerts = [
  { id: 'alert-1', userId: 'demo-user', message: 'Heavy rain expected in your area', read: false, createdAt: new Date().toISOString() }
];

alertRouter.get('/', requireAuth, (req, res) => {
  const userAlerts = alerts.filter(a => a.userId === req.user!.id || a.userId === 'demo-user');
  res.json({ alerts: userAlerts });
});

alertRouter.put('/:id/read', requireAuth, (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) throw new NotFoundError('Alert not found');
  alert.read = true;
  res.json(alert);
});

alertRouter.put('/read-all', requireAuth, (req, res) => {
  alerts.forEach(a => { if (a.userId === req.user!.id || a.userId === 'demo-user') a.read = true });
  res.json({ success: true });
});

alertRouter.post('/subscribe', requireAuth, (req, res) => {
  const { location, radius } = req.body;
  res.json({ subscriptionId: uuidv4(), location, radius, status: 'active' });
});
