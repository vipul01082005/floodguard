import { Router } from 'express';
import { RiskService } from '../services/riskService';
import { demoRiskZones } from '../services/demoDataService';
import { ValidationError } from '../utils/errors';

export const riskRouter = Router();

riskRouter.get('/zones', (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json({ zones: demoRiskZones });
  }
  res.json({ zones: [] });
});

riskRouter.get('/assessment/:locationId', (req, res) => {
  res.json(RiskService.calculateRisk(0, 0)); // mock
});

riskRouter.get('/assessment', (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    throw new ValidationError('Valid lat and lng query parameters are required');
  }

  res.json(RiskService.calculateRisk(lat, lng));
});
