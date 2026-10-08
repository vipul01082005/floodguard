export interface RiskAssessment {
  locationId?: string;
  coordinates: { lat: number, lng: number };
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  score: number;
  factors: { name: string; impact: number; description: string }[];
  confidence: number;
}

export class RiskService {
  public static calculateRisk(lat: number, lng: number): RiskAssessment {
    // Simple deterministic pseudo-random logic based on coordinates for demo
    const baseScore = ((Math.abs(lat * 100) % 10) + (Math.abs(lng * 100) % 10)) * 5; 
    let riskLevel: RiskAssessment['riskLevel'] = 'LOW';
    
    if (baseScore > 75) riskLevel = 'SEVERE';
    else if (baseScore > 50) riskLevel = 'HIGH';
    else if (baseScore > 25) riskLevel = 'MODERATE';

    return {
      coordinates: { lat, lng },
      riskLevel,
      score: baseScore,
      factors: [
        { name: 'Elevation', impact: 0.4, description: 'Low elevation relative to sea level' },
        { name: 'Rainfall', impact: 0.35, description: 'Recent heavy precipitation' },
        { name: 'Drainage', impact: 0.25, description: 'Historical drainage capacity' }
      ],
      confidence: 0.85
    };
  }
}
