import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validateReport, validateFileUpload } from '../middleware/validation';
import { reportLimiter } from '../middleware/rateLimit';
import { demoReports } from '../services/demoDataService';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../utils/errors';

export const reportRouter = Router();

// In-memory store for demo
const reports = [...demoReports];

reportRouter.post('/', requireAuth, reportLimiter, validateReport, (req, res) => {
  const { type, location, severity, description } = req.body;
  
  // Duplicate detection mock (same type within 500m logic would go here)
  const isDuplicate = reports.some(r => r.type === type && Math.abs(r.location.lat - location.lat) < 0.005);
  if (isDuplicate) {
    throw new ValidationError('Similar report submitted recently in this area');
  }

  const newReport = {
    id: uuidv4(),
    userId: req.user!.id,
    type,
    location,
    severity,
    description,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  reports.push(newReport);
  res.status(201).json(newReport);
});

reportRouter.get('/', (req, res) => {
  res.json({ reports });
});

reportRouter.get('/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) throw new NotFoundError('Report not found');
  res.json(report);
});

reportRouter.put('/:id/verify', requireAuth, requireAdmin, (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) throw new NotFoundError('Report not found');
  report.status = 'VERIFIED';
  res.json(report);
});

reportRouter.put('/:id/resolve', requireAuth, requireAdmin, (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) throw new NotFoundError('Report not found');
  report.status = 'RESOLVED';
  res.json(report);
});

reportRouter.post('/upload-url', requireAuth, validateFileUpload, (req, res) => {
  res.json({
    uploadUrl: 'https://demo-s3-bucket.s3.amazonaws.com/presigned-url-mock',
    fileId: uuidv4()
  });
});
