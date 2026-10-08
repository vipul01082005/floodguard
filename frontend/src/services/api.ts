import {
  RiskZone,
  RiskAssessment,
  RouteOption,
  Report,
  Alert,
  SystemHealth,
  ReportSubmission,
  OperationalMetrics
} from '../types';

const API_URL = 'https://floodguard-api-h1bf.onrender.com';

const getHeaders = () => {
  const token = localStorage.getItem('fg_token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const getRiskZones = async (): Promise<RiskZone[]> => {
  try {
    const res = await fetch(`${API_URL}/api/risk/zones`);

    if (!res.ok) throw new Error('Failed to fetch risk zones');

    const data = await res.json();
    return data.zones || [];
  } catch (error) {
    console.error('getRiskZones:', error);
    return [];
  }
};

export const getRiskAssessment = async (
  id: string
): Promise<RiskAssessment | null> => {
  try {
    const res = await fetch(`${API_URL}/api/risk/assessment/${id}`);

    if (!res.ok) throw new Error('Failed to fetch risk assessment');

    return await res.json();
  } catch (error) {
    console.error('getRiskAssessment:', error);
    return null;
  }
};

export const getRoutes = async (): Promise<RouteOption[]> => {
  return [];
};

export const submitReport = async (
  report: ReportSubmission
): Promise<Report> => {
  const res = await fetch(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(report)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message || 'Failed to submit report');
  }

  return await res.json();
};

export const getAlerts = async (): Promise<Alert[]> => {
  const res = await fetch(`${API_URL}/api/alerts`, {
    headers: getHeaders()
  });

  if (!res.ok) {
    throw new Error('Failed to fetch alerts');
  }

  const data = await res.json();
  return data.alerts || [];
};

export const getSystemHealth = async (): Promise<SystemHealth> => {
  try {
    const res = await fetch(`${API_URL}/api/health`);

    if (!res.ok) throw new Error('Health check failed');

    const data = await res.json();

    return {
      api: 'HEALTHY',
      database: data.services?.database === 'ok' ? 'HEALTHY' : 'UNHEALTHY',
      prediction: 'HEALTHY',
      notifications: data.services?.storage === 'ok' ? 'HEALTHY' : 'UNHEALTHY',
      lastUpdated: data.timestamp
    };
  } catch (error) {
    console.error('getSystemHealth:', error);

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
  try {
    const res = await fetch(`${API_URL}/api/reports`);

    if (!res.ok) throw new Error('Failed to fetch reports');

    const data = await res.json();
    return data.reports || [];
  } catch (error) {
    console.error('getReports:', error);
    return [];
  }
};

export const getOperationalMetrics = async (): Promise<OperationalMetrics> => {
  return {
    activeHighRiskZones: 0,
    activeReports: 0,
    verifiedIncidents: 0,
    alertsSent: 0,
    averageResponseTime: 0,
    riskOverTime: [],
    rainfallOverTime: [],
    reportsByCategory: [],
    riskZonesBySeverity: []
  };
};
