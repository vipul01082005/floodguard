import { DemoScenario, RiskZone, RiskAssessment } from '../types';

export const applyScenario = (scenario: DemoScenario, baseData: RiskZone[]): RiskZone[] => {
  return baseData.map(zone => {
    let scoreMultiplier = 1;
    let addScore = 0;
    
    switch (scenario) {
      case 'HEAVY_RAIN':
        scoreMultiplier = 1.15;
        addScore = 15;
        break;
      case 'EXTREME_RAIN':
        scoreMultiplier = 1.30;
        addScore = 25;
        break;
      case 'FLASH_FLOOD':
        scoreMultiplier = 1.5;
        addScore = 40;
        break;
      case 'NORMAL':
      default:
        break;
    }
    
    let newScore = Math.min(Math.round((zone.riskScore * scoreMultiplier) + addScore), 100);
    let riskLevel = zone.riskLevel;
    if (newScore >= 75) riskLevel = 'SEVERE';
    else if (newScore >= 50) riskLevel = 'HIGH';
    else if (newScore >= 25) riskLevel = 'MODERATE';
    else riskLevel = 'LOW';
    
    return { ...zone, riskScore: newScore, riskLevel };
  });
};

export const simulateTimeProgression = (scenario: DemoScenario, elapsedMinutes: number, currentZones: RiskZone[]): RiskZone[] => {
  // gradual increase based on scenario severity and time
  const drift = scenario === 'FLASH_FLOOD' ? 5 : scenario === 'EXTREME_RAIN' ? 2 : scenario === 'HEAVY_RAIN' ? 1 : 0;
  return currentZones.map(zone => {
    const newScore = Math.min(zone.riskScore + drift, 100);
    let riskLevel = zone.riskLevel;
    if (newScore >= 75) riskLevel = 'SEVERE';
    else if (newScore >= 50) riskLevel = 'HIGH';
    else if (newScore >= 25) riskLevel = 'MODERATE';
    else riskLevel = 'LOW';
    return { ...zone, riskScore: newScore, riskLevel };
  });
};
