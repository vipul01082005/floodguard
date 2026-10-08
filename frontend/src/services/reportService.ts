import { Report, ReportSubmission, RiskZone } from '../types';

const reportStore: Report[] = [];
const rateLimits: Record<string, number[]> = {};

export const submitReport = (submission: ReportSubmission, userId: string = 'anon'): Report => {
  const now = Date.now();
  if (!rateLimits[userId]) rateLimits[userId] = [];
  rateLimits[userId] = rateLimits[userId].filter(t => now - t < 600000); // 10 min
  
  if (rateLimits[userId].length >= 5) {
    throw new Error('Rate limit exceeded (5 reports per 10 mins).');
  }
  
  const duplicate = reportStore.find(r => 
    r.incidentType === submission.incidentType && 
    Math.abs(r.latitude - submission.latitude) < 0.001 &&
    Math.abs(r.longitude - submission.longitude) < 0.001 &&
    now - new Date(r.createdAt).getTime() < 1800000 // 30 min
  );
  
  if (duplicate) {
    throw new Error('Duplicate report detected.');
  }
  
  const report: Report = {
    id: `rep-${Date.now()}`,
    ...submission,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verificationStatus: 'UNVERIFIED',
    confirmationCount: 0,
    isDemo: true
  };
  
  reportStore.push(report);
  rateLimits[userId].push(now);
  
  return report;
};

export const verifyReport = (reportId: string, riskZones: RiskZone[], otherReports: Report[]): void => {
  const report = reportStore.find(r => r.id === reportId);
  if (!report) return;
  
  const nearbyReports = otherReports.filter(r => 
    r.id !== reportId &&
    Math.abs(r.latitude - report.latitude) < 0.01 &&
    Math.abs(r.longitude - report.longitude) < 0.01
  );
  
  if (nearbyReports.length >= 2) {
    report.verificationStatus = 'COMMUNITY_CONFIRMED';
  }
};

export const getReportsNear = (lat: number, lng: number, radiusKm: number): Report[] => {
  return reportStore.filter(r => {
    const dist = Math.sqrt(Math.pow(r.latitude - lat, 2) + Math.pow(r.longitude - lng, 2)) * 111; // approx km
    return dist <= radiusKm;
  });
};
