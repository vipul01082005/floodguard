import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { getOperationalMetrics, getReports, getRiskZones } from '../services/api';
import { OperationalMetrics, Report, RiskZone } from '../types';
import { MetricCard } from '../components/admin/MetricCard';
import { SimpleLineChart } from '../components/admin/SimpleLineChart';
import { SimpleBarChart } from '../components/admin/SimpleBarChart';
import { SimpleDonutChart } from '../components/admin/SimpleDonutChart';
import { ReportsTable } from '../components/admin/ReportsTable';

export const AdminPage: React.FC = () => {
  const { authState, demoState } = useAppContext();
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, reportsData, zonesData] = await Promise.all([
          getOperationalMetrics(),
          getReports(),
          getRiskZones()
        ]);
        setMetrics(metricsData);
        setReports(reportsData);
        setZones(zonesData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, verificationStatus: 'SYSTEM_CORROBORATED' as const } : r));
  };

  const handleResolve = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, verificationStatus: 'RESOLVED' as const } : r));
  };

  if (!authState.isAuthenticated || authState.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center border border-gray-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need administrator privileges to access the Operations Dashboard.</p>
          <a href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  const severityColors: Record<string, string> = {
    LOW: '#4ade80',
    MODERATE: '#fbbf24',
    HIGH: '#f97316',
    SEVERE: '#ef4444'
  };

  const donutData = metrics?.riskZonesBySeverity.map(item => ({
    label: item.category,
    value: item.count,
    color: severityColors[item.category] || '#9ca3af'
  })) || [];

  const barData = metrics?.reportsByCategory.map(item => {
    return {
      label: item.category,
      value: item.count,
      color: '#3b82f6'
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Operations Dashboard</h1>
            <p className="text-gray-400 mt-1">Real-time environmental monitoring and incident management</p>
          </div>
          <div className="flex items-center gap-4">
            {demoState.isActive && (
              <span className="bg-amber-900/50 text-amber-500 border border-amber-700/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Demo Mode Active
              </span>
            )}
            <a href="/system-health" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-colors">
              System Health
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                label="Active High-Risk Zones" 
                value={metrics?.activeHighRiskZones || 0} 
                trend={{ direction: 'up', percentage: 12 }} 
                subtitle="vs previous hour"
              />
              <MetricCard 
                label="Active Reports" 
                value={metrics?.activeReports || 0} 
                subtitle="in last hour"
              />
              <MetricCard 
                label="Verified Incidents" 
                value={metrics?.verifiedIncidents || 0} 
              />
              <MetricCard 
                label="Alerts Sent" 
                value={metrics?.alertsSent || 0} 
                trend={{ direction: 'up', percentage: 5 }}
                subtitle="automated + manual"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <h3 className="text-gray-100 font-medium mb-4">Risk Over Time (24h)</h3>
                <SimpleLineChart 
                  data={metrics?.riskOverTime || []} 
                  color="#ef4444" 
                  thresholds={[25, 50, 75]} 
                />
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <h3 className="text-gray-100 font-medium mb-4">Reports by Category</h3>
                <SimpleBarChart data={barData} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <h3 className="text-gray-100 font-medium mb-4">Risk Zones by Severity</h3>
                <SimpleDonutChart data={donutData} />
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <h3 className="text-gray-100 font-medium mb-4">Rainfall Intensity (mm/hr)</h3>
                <SimpleLineChart 
                  data={metrics?.rainfallOverTime || []} 
                  color="#3b82f6" 
                  yMax={50}
                />
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-100 font-medium">Recent Reports</h3>
                <span className="text-sm text-gray-400">Total: {reports.length}</span>
              </div>
              <ReportsTable 
                reports={reports} 
                onVerify={handleVerify} 
                onResolve={handleResolve} 
              />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 h-[400px] flex flex-col relative overflow-hidden">
              <h3 className="text-gray-100 font-medium mb-4 z-10 relative">Active Incidents Map</h3>
              <div className="flex-1 bg-gray-900 rounded border border-gray-700 flex items-center justify-center text-gray-500 relative z-10">
                <div className="text-center">
                  <p>Interactive Map Component</p>
                  <p className="text-xs mt-2">Showing {zones.length} active risk zones and {reports.filter(r => r.verificationStatus !== 'RESOLVED').length} incidents.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
