import { RiskZone, RiskAssessment, Report, Alert, RouteOption, RiskLevel, DemoScenario } from '../types';

export const DEMO_SCENARIO: DemoScenario = 'NORMAL';

export const generateIsoTime = (minutesAgo: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
};

export const DEMO_RISK_ZONES: RiskZone[] = [
  { id: 'zone-1', name: 'Connaught Place', center: [28.6315, 77.2167], radius: 500, riskScore: 87, riskLevel: 'SEVERE', lastUpdated: generateIsoTime(5), isDemo: true },
  { id: 'zone-2', name: 'ITO', center: [28.6289, 77.2405], radius: 600, riskScore: 72, riskLevel: 'HIGH', lastUpdated: generateIsoTime(10), isDemo: true },
  { id: 'zone-3', name: 'Minto Bridge', center: [28.6350, 77.2200], radius: 300, riskScore: 91, riskLevel: 'SEVERE', lastUpdated: generateIsoTime(2), isDemo: true },
  { id: 'zone-4', name: 'Pragati Maidan', center: [28.6197, 77.2469], radius: 700, riskScore: 68, riskLevel: 'HIGH', lastUpdated: generateIsoTime(15), isDemo: true },
  { id: 'zone-5', name: 'Sarai Kale Khan', center: [28.5895, 77.2575], radius: 800, riskScore: 55, riskLevel: 'MODERATE', lastUpdated: generateIsoTime(8), isDemo: true },
  { id: 'zone-6', name: 'Lajpat Nagar', center: [28.5700, 77.2400], radius: 600, riskScore: 48, riskLevel: 'MODERATE', lastUpdated: generateIsoTime(20), isDemo: true },
  { id: 'zone-7', name: 'Dwarka', center: [28.5921, 77.0460], radius: 1000, riskScore: 22, riskLevel: 'LOW', lastUpdated: generateIsoTime(30), isDemo: true },
  { id: 'zone-8', name: 'Rohini', center: [28.7495, 77.0565], radius: 900, riskScore: 42, riskLevel: 'MODERATE', lastUpdated: generateIsoTime(25), isDemo: true },
  { id: 'zone-9', name: 'Yamuna Bank', center: [28.6180, 77.2730], radius: 600, riskScore: 94, riskLevel: 'SEVERE', lastUpdated: generateIsoTime(1), isDemo: true },
  { id: 'zone-10', name: 'Mundka', center: [28.6814, 77.0294], radius: 800, riskScore: 18, riskLevel: 'LOW', lastUpdated: generateIsoTime(40), isDemo: true },
  { id: 'zone-11', name: 'Okhla', center: [28.5456, 77.2732], radius: 700, riskScore: 65, riskLevel: 'HIGH', lastUpdated: generateIsoTime(12), isDemo: true },
  { id: 'zone-12', name: 'Mayur Vihar', center: [28.6058, 77.2951], radius: 650, riskScore: 70, riskLevel: 'HIGH', lastUpdated: generateIsoTime(18), isDemo: true }
];

export const DEMO_RISK_ASSESSMENTS: Record<string, RiskAssessment> = DEMO_RISK_ZONES.reduce((acc, zone) => {
  acc[zone.id] = {
    locationId: zone.id,
    locationName: zone.name,
    latitude: zone.center[0],
    longitude: zone.center[1],
    riskScore: zone.riskScore,
    riskLevel: zone.riskLevel,
    probability: zone.riskScore / 100,
    confidence: 0.85,
    riskWindow: 'Next 30-60 minutes',
    topFactors: [
      { name: 'Heavy Rainfall', impact: 'HIGH', value: 0.8, description: 'Sustained heavy rainfall in the area' },
      { name: 'Poor Drainage', impact: 'MEDIUM', value: 0.6, description: 'Known vulnerable drainage infrastructure' }
    ],
    rainfall: { current: 15, oneHour: 25, threeHour: 50, sixHour: 80, twentyFourHour: 120, forecast: 30, intensity: 'HEAVY', trend: 'INCREASING' },
    historicalFloodCount: Math.floor(zone.riskScore / 10),
    recentReportCount: Math.floor(zone.riskScore / 15),
    drainageVulnerability: zone.riskScore > 75 ? 0.9 : 0.4,
    elevationRisk: zone.riskScore > 60 ? 0.7 : 0.3,
    lastUpdated: zone.lastUpdated,
    isDemo: true
  };
  return acc;
}, {} as Record<string, RiskAssessment>);

export const DEMO_REPORTS: Report[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `rep-${i}`,
  incidentType: i % 3 === 0 ? 'WATERLOGGING' : i % 2 === 0 ? 'ROAD_BLOCKED' : 'HEAVY_RAINFALL',
  severity: i % 4 === 0 ? 'SEVERE' : i % 3 === 0 ? 'HIGH' : 'MODERATE',
  description: `User reported issue near demo area ${i + 1}`,
  latitude: 28.6 + (Math.random() * 0.1 - 0.05),
  longitude: 77.2 + (Math.random() * 0.1 - 0.05),
  locationName: `Location ${i}`,
  userId: `user-${i % 5}`,
  createdAt: generateIsoTime(Math.floor(Math.random() * 120)),
  updatedAt: generateIsoTime(Math.floor(Math.random() * 60)),
  verificationStatus: i % 5 === 0 ? 'SYSTEM_CORROBORATED' : 'UNVERIFIED',
  confirmationCount: Math.floor(Math.random() * 10),
  isDemo: true
}));

export const DEMO_ALERTS: Alert[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `alt-${i}`,
  type: i % 2 === 0 ? 'HIGH_RISK' : 'SEVERE',
  title: i % 2 === 0 ? 'High Risk Alert' : 'Severe Flooding Expected',
  message: `Alert generated for demo location ${i + 1}. Please exercise caution.`,
  riskLevel: i % 2 === 0 ? 'HIGH' : 'SEVERE',
  locationName: `Alert Zone ${i + 1}`,
  latitude: 28.6 + (Math.random() * 0.1 - 0.05),
  longitude: 77.2 + (Math.random() * 0.1 - 0.05),
  createdAt: generateIsoTime(Math.floor(Math.random() * 60)),
  read: i % 3 === 0,
  isDemo: true
}));

export const DEMO_ROUTES: RouteOption[] = [
  {
    id: 'route-a',
    name: 'Shortest Route (Via Minto Bridge)',
    distance: 5.2,
    duration: 15,
    floodExposure: 0.85,
    riskyZoneCount: 3,
    safetyScore: 25,
    riskLevel: 'SEVERE',
    isRecommended: false,
    waypoints: [[28.6129, 77.2295], [28.6350, 77.2200], [28.5674, 77.2100]],
    riskSegments: [{ startIndex: 0, endIndex: 1, riskLevel: 'SEVERE', riskScore: 91 }],
    explanation: 'High risk of severe flooding at Minto Bridge.'
  },
  {
    id: 'route-b',
    name: 'Recommended Route (Via Ring Road)',
    distance: 6.8,
    duration: 22,
    floodExposure: 0.2,
    riskyZoneCount: 1,
    safetyScore: 85,
    riskLevel: 'LOW',
    isRecommended: true,
    waypoints: [[28.6129, 77.2295], [28.5900, 77.2300], [28.5674, 77.2100]],
    riskSegments: [],
    explanation: 'Safest and most balanced route avoiding major waterlogging.'
  },
  {
    id: 'route-c',
    name: 'Safest but Longest (Via Outer Ring)',
    distance: 8.5,
    duration: 35,
    floodExposure: 0.05,
    riskyZoneCount: 0,
    safetyScore: 95,
    riskLevel: 'LOW',
    isRecommended: false,
    waypoints: [[28.6129, 77.2295], [28.6000, 77.2500], [28.5500, 77.2100]],
    riskSegments: [],
    explanation: 'Maximum safety but significantly longer duration.'
  }
];
