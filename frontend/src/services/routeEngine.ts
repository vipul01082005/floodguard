import { RouteOption, RiskZone } from '../types';

export const scoreRoute = (route: RouteOption, riskZones: RiskZone[]): RouteOption => {
  let exposure = 0;
  let risks = 0;
  
  route.waypoints.forEach(wp => {
    riskZones.forEach(zone => {
      const dist = Math.sqrt(Math.pow(wp[0] - zone.center[0], 2) + Math.pow(wp[1] - zone.center[1], 2)) * 111000;
      if (dist < zone.radius) {
        risks++;
        exposure += (zone.riskScore / 100);
      }
    });
  });
  
  const normExposure = Math.min(exposure / Math.max(route.waypoints.length, 1), 1);
  const safetyScore = Math.max(100 - (normExposure * 100), 0);
  
  return {
    ...route,
    floodExposure: normExposure,
    riskyZoneCount: risks,
    safetyScore
  };
};

export const compareRoutes = (routes: RouteOption[]): RouteOption[] => {
  const sorted = [...routes].sort((a, b) => b.safetyScore - a.safetyScore);
  if (sorted.length > 0) {
    sorted[0].isRecommended = true;
    for (let i = 1; i < sorted.length; i++) {
      sorted[i].isRecommended = false;
    }
  }
  return sorted;
};

export const generateRouteExplanation = (recommended: RouteOption, alternatives: RouteOption[]): string => {
  return `Recommended route "${recommended.name}" has a safety score of ${Math.round(recommended.safetyScore)}% compared to alternatives.`;
};
