import { Router } from 'express';
import { validateRoute } from '../middleware/validation';
import { RiskService } from '../services/riskService';

export const routeRouter = Router();

routeRouter.post('/compare', validateRoute, (req, res) => {
  const { origin, destination } = req.body;
  
  // Mock routes
  const routes = [
    {
      id: 'route-1',
      name: 'Main Highway',
      durationMinutes: 45,
      riskAssessment: RiskService.calculateRisk(origin.lat, origin.lng) // simple mock
    },
    {
      id: 'route-2',
      name: 'Alternative Bypass',
      durationMinutes: 55,
      riskAssessment: {
        ...RiskService.calculateRisk(origin.lat, origin.lng),
        riskLevel: 'LOW',
        score: 15
      }
    }
  ];

  res.json({ routes });
});
