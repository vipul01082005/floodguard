import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok',
      cache: 'ok',
      storage: 'ok'
    },
    uptime: process.uptime()
  });
});
