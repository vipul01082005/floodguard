import { RiskZone, RiskAssessment, RouteOption, Report, Alert, SystemHealth, ReportSubmission, OperationalMetrics } from '../types';
import { DEMO_RISK_ZONES, DEMO_RISK_ASSESSMENTS, DEMO_ROUTES, DEMO_REPORTS, DEMO_ALERTS } from './demoData';
import { submitReport as svcSubmitReport } from './reportService';

const isDemoMode = true; // Wrapper logic can toggle this

export const getRiskZones = async (): Promise<RiskZone[]> => {
  if (isDemoMode) return DEMO_RISK_ZONES;
  try {
    const res = await fetch('/api/zones');
    return await res.json();
  } catch {
    return [];
  }
};

export const getRiskAssessment = async (id: string): Promise<RiskAssessment | null> => {
  if (isDemoMode) return DEMO_RISK_ASSESSMENTS[id] || null;
  try {
    const res = await fetch(`/api/assessments/${id}`);
    return await res.json();
  } catch {
    return null;
  }
};

export const getRoutes = async (): Promise<RouteOption[]> => {
  if (isDemoMode) return DEMO_ROUTES;
  try {
    const res = await fetch('/api/routes');
    return await res.json();
  } catch {
    return [];
  }
};

export const submitReport = async (report: ReportSubmission): Promise<Report> => {
  if (isDemoMode) return svcSubmitReport(report, 'demo-user');
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    return await res.json();
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const getAlerts = async (): Promise<Alert[]> => {
  if (isDemoMode) return DEMO_ALERTS;
  try {
    const res = await fetch('/api/alerts');
    return await res.json();
  } catch {
    return [];
  }
};

export const getSystemHealth = async (): Promise<SystemHealth> => {
  if (isDemoMode) {
    return {
      api: 'HEALTHY',
      database: 'HEALTHY',
      prediction: 'HEALTHY',
      notifications: 'HEALTHY',
      lastUpdated: new Date().toISOString()
    };
  }
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return {
      api: 'UNHEALTHY',
      database: 'UNHEALTHY',
      prediction: 'UNHEALTHY',
      notifications: 'UNHEALTHY',
      lastUpdated: new Date().toISOString()
    };
  }
};

export const getReports = async (): Promise<Report[]> => {
  if (isDemoMode) return DEMO_REPORTS;
  try {
    const res = await fetch('/api/reports');
    return await res.json();
  } catch {
    return [];
  }
};

export const getOperationalMetrics = async (): Promise<OperationalMetrics> => {
  if (isDemoMode) {
    // Generate mock metrics based on demo data
    const activeHighRiskZones = DEMO_RISK_ZONES.filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'SEVERE').length;
    const activeReports = DEMO_REPORTS.length;
    const verifiedIncidents = DEMO_REPORTS.filter(r => r.verificationStatus !== 'UNVERIFIED').length;
    const alertsSent = DEMO_ALERTS.length;
    
    // Mock time series
    const now = new Date();
    const riskOverTime = Array.from({length: 24}).map((_, i) => {
      const t = new Date(now);
      t.setHours(now.getHours() - (23 - i));
      return { timestamp: t.toISOString(), value: 40 + Math.random() * 40 + (i > 18 ? 10 : 0) };
    });
    
    const rainfallOverTime = Array.from({length: 24}).map((_, i) => {
      const t = new Date(now);
      t.setHours(now.getHours() - (23 - i));
      return { timestamp: t.toISOString(), value: Math.max(0, 10 + Math.random() * 20 - (23-i)) };
    });

    const categoryMap = DEMO_REPORTS.reduce((acc, r) => {
      acc[r.incidentType] = (acc[r.incidentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const reportsByCategory = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

    const severityMap = DEMO_RISK_ZONES.reduce((acc, z) => {
      acc[z.riskLevel] = (acc[z.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const riskZonesBySeverity = Object.entries(severityMap).map(([category, count]) => ({ category, count }));

    return {
      activeHighRiskZones,
      activeReports,
      verifiedIncidents,
      alertsSent,
      averageResponseTime: 12,
      riskOverTime,
      rainfallOverTime,
      reportsByCategory,
      riskZonesBySeverity
    };
  }
  try {
    const res = await fetch('/api/metrics');
    return await res.json();
  } catch {
    throw new Error('Failed to fetch metrics');
  }
};
