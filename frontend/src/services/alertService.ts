import { RiskZone, Alert, RiskLevel } from '../types';

const alertCooldowns: Record<string, number> = {};

export const generateAlerts = (riskZones: RiskZone[], previousRiskZones: Record<string, RiskLevel>, userLocation?: [number, number]): Alert[] => {
  const alerts: Alert[] = [];
  const now = Date.now();
  
  riskZones.forEach(zone => {
    const prevLevel = previousRiskZones[zone.id];
    
    // threshold crossing
    if (zone.riskLevel !== prevLevel && (zone.riskLevel === 'HIGH' || zone.riskLevel === 'SEVERE')) {
      const lastAlertTime = alertCooldowns[zone.id] || 0;
      
      if (now - lastAlertTime > 1800000) { // 30 mins
        alerts.push({
          id: `alert-${Date.now()}-${zone.id}`,
          type: zone.riskLevel === 'SEVERE' ? 'SEVERE' : 'HIGH_RISK',
          title: `Risk escalated to ${zone.riskLevel} at ${zone.name}`,
          message: `Flood risk level has reached ${zone.riskLevel} in your area.`,
          riskLevel: zone.riskLevel,
          locationName: zone.name,
          latitude: zone.center[0],
          longitude: zone.center[1],
          createdAt: new Date().toISOString(),
          read: false,
          isDemo: true
        });
        alertCooldowns[zone.id] = now;
      }
    }
  });
  
  return alerts;
};
