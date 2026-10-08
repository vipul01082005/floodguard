export const demoRiskZones = [
  { id: 'zone-1', name: 'Downtown Flood Plain', level: 'HIGH', lat: 19.0760, lng: 72.8777, radius: 2000 },
  { id: 'zone-2', name: 'Suburban Drain Area', level: 'MODERATE', lat: 19.0860, lng: 72.8877, radius: 1500 }
];

export const demoReports = [
  { id: 'rep-1', type: 'WATERLOGGING', severity: 'HIGH', location: { lat: 19.076, lng: 72.877 }, status: 'VERIFIED', createdAt: new Date().toISOString() }
];

export const getDemoData = () => ({
  zones: demoRiskZones,
  reports: demoReports
});
