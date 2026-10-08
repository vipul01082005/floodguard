import { RiskLevel, RiskAssessment } from '../types';

export interface RiskInputs {
  rainfall_1h: number;
  rainfall_3h: number;
  rainfall_6h: number;
  rainfall_24h: number;
  forecast_rainfall: number;
  rainfall_intensity: number; // 0-1
  historical_flood_count: number; // 0-20
  recent_reports: number; // 0-50
  drainage_vulnerability: number; // 0-1
  elevation_risk: number; // 0-1
  locationId: string;
  locationName: string;
  latitude: number;
  longitude: number;
}

const normalize = (val: number, max: number) => Math.min(Math.max(val / max, 0), 1);

export const calculateRiskScore = (inputs: RiskInputs): RiskAssessment => {
  const norm1h = normalize(inputs.rainfall_1h, 50);
  const norm3h = normalize(inputs.rainfall_3h, 100);
  const normForecast = normalize(inputs.forecast_rainfall, 50);
  const normHist = normalize(inputs.historical_flood_count, 20);
  const normReports = normalize(inputs.recent_reports, 50);
  
  const score = (
    norm1h * 0.20 +
    norm3h * 0.10 +
    normForecast * 0.10 +
    inputs.rainfall_intensity * 0.15 +
    normHist * 0.15 +
    normReports * 0.10 +
    inputs.drainage_vulnerability * 0.10 +
    inputs.elevation_risk * 0.10
  ) * 100;
  
  const riskScore = Math.round(score);
  
  let riskLevel: RiskLevel = 'LOW';
  if (riskScore >= 75) riskLevel = 'SEVERE';
  else if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 25) riskLevel = 'MODERATE';
  
  const completeness = (inputs.rainfall_1h >= 0 ? 0.2 : 0) + (inputs.forecast_rainfall >= 0 ? 0.2 : 0) + 0.6;
  const confidence = Math.min(completeness, 1.0);
  
  const riskWindow = normForecast > 0.5 ? 'Next 30 minutes' : 'Next 1-2 hours';
  
  return {
    locationId: inputs.locationId,
    locationName: inputs.locationName,
    latitude: inputs.latitude,
    longitude: inputs.longitude,
    riskScore,
    riskLevel,
    probability: riskScore / 100,
    confidence,
    riskWindow,
    topFactors: [
      { name: 'Rainfall', impact: norm1h > 0.5 ? 'HIGH' : 'LOW', value: norm1h, description: 'Recent rainfall accumulation' },
      { name: 'Vulnerability', impact: inputs.drainage_vulnerability > 0.5 ? 'HIGH' : 'LOW', value: inputs.drainage_vulnerability, description: 'Drainage status' }
    ],
    rainfall: {
      current: inputs.rainfall_1h,
      oneHour: inputs.rainfall_1h,
      threeHour: inputs.rainfall_3h,
      sixHour: inputs.rainfall_6h,
      twentyFourHour: inputs.rainfall_24h,
      forecast: inputs.forecast_rainfall,
      intensity: inputs.rainfall_intensity > 0.7 ? 'HEAVY' : 'LIGHT',
      trend: normForecast > norm1h ? 'INCREASING' : 'STABLE'
    },
    historicalFloodCount: inputs.historical_flood_count,
    recentReportCount: inputs.recent_reports,
    drainageVulnerability: inputs.drainage_vulnerability,
    elevationRisk: inputs.elevation_risk,
    lastUpdated: new Date().toISOString(),
    isDemo: true
  };
};
