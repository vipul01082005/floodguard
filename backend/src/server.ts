import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimit';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';

import { riskRouter } from './handlers/riskHandler';
import { reportRouter } from './handlers/reportHandler';
import { routeRouter } from './handlers/routeHandler';
import { alertRouter } from './handlers/alertHandler';
import { authRouter } from './handlers/authHandler';
import { adminRouter } from './handlers/adminHandler';
import { healthRouter } from './handlers/healthHandler';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  next();
});

// Routes
app.use('/api/risk', riskRouter);
app.use('/api/reports', reportRouter);
app.use('/api/routes', routeRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/health', healthRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Not Found' } });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Error', { error: err.message, stack: err.stack });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
