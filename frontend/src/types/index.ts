// ============================================================
// FloodGuard Core Types
// ============================================================

// --- Risk Types ---

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface RiskAssessment {
  locationId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  riskScore: number;          // 0–100
  riskLevel: RiskLevel;
  probability: number;        // 0–1
  confidence: number;         // 0–1
  riskWindow: string;         // e.g. "20-35 minutes"
  topFactors: RiskFactor[];
  rainfall: RainfallData;
  historicalFloodCount: number;
  recentReportCount: number;
  drainageVulnerability: number; // 0–1
  elevationRisk: number;        // 0–1
  lastUpdated: string;          // ISO timestamp
  isDemo: boolean;
}

export interface RiskFactor {
  name: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  value: number;               // 0–1 contribution
  description: string;
}

export interface RainfallData {
  current: number;             // mm/hr
  oneHour: number;             // mm
  threeHour: number;           // mm
  sixHour: number;             // mm
  twentyFourHour: number;      // mm
  forecast: number;            // mm expected next 3h
  intensity: 'LIGHT' | 'MODERATE' | 'HEAVY' | 'EXTREME';
  trend: 'DECREASING' | 'STABLE' | 'INCREASING';
}

// --- Risk Zone ---

export interface RiskZone {
  id: string;
  name: string;
  center: [number, number];   // [lat, lng]
  radius: number;             // meters
  polygon?: [number, number][];
  riskScore: number;
  riskLevel: RiskLevel;
  lastUpdated: string;
  isDemo: boolean;
}

// --- Report Types ---

export type IncidentType =
  | 'WATERLOGGING'
  | 'FLOODING'
  | 'ROAD_BLOCKED'
  | 'DRAIN_OVERFLOW'
  | 'STRANDED_VEHICLE'
  | 'HEAVY_RAINFALL';

export type ReportSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'COMMUNITY_CONFIRMED'
  | 'SYSTEM_CORROBORATED'
  | 'RESOLVED';

export interface Report {
  id: string;
  incidentType: IncidentType;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  verificationStatus: VerificationStatus;
  confirmationCount: number;
  isDemo: boolean;
}

export interface ReportSubmission {
  incidentType: IncidentType;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageFile?: File;
}

// --- Route Types ---

export interface RouteRequest {
  origin: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string };
}

export interface RouteOption {
  id: string;
  name: string;
  distance: number;           // km
  duration: number;           // minutes
  floodExposure: number;      // 0–1
  riskyZoneCount: number;
  safetyScore: number;        // 0–100
  riskLevel: RiskLevel;
  isRecommended: boolean;
  waypoints: [number, number][];
  riskSegments: RouteRiskSegment[];
  explanation: string;
}

export interface RouteRiskSegment {
  startIndex: number;
  endIndex: number;
  riskLevel: RiskLevel;
  riskScore: number;
}

// --- Alert Types ---

export type AlertType =
  | 'HIGH_RISK'
  | 'SEVERE'
  | 'ROUTE_CHANGE'
  | 'COMMUNITY_UPDATE';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  riskLevel: RiskLevel;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  read: boolean;
  isDemo: boolean;
}

// --- User Types ---

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// --- Demo Types ---

export type DemoScenario = 'NORMAL' | 'HEAVY_RAIN' | 'EXTREME_RAIN' | 'FLASH_FLOOD';

export interface DemoState {
  isActive: boolean;
  scenario: DemoScenario;
  timeMultiplier: number;
}

// --- System Health ---

export interface SystemHealth {
  api: ServiceStatus;
  database: ServiceStatus;
  prediction: ServiceStatus;
  notifications: ServiceStatus;
  lastUpdated: string;
}

export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';

// --- Admin Dashboard ---

export interface OperationalMetrics {
  activeHighRiskZones: number;
  activeReports: number;
  verifiedIncidents: number;
  alertsSent: number;
  averageResponseTime: number; // minutes
  riskOverTime: TimeSeriesPoint[];
  rainfallOverTime: TimeSeriesPoint[];
  reportsByCategory: CategoryCount[];
  riskZonesBySeverity: CategoryCount[];
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

// --- API Response ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Map Types ---

export interface MapViewState {
  center: [number, number];
  zoom: number;
}

export interface SelectedLocation {
  lat: number;
  lng: number;
  name?: string;
}
