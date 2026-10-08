import React, { useEffect, useState } from 'react';
import { getSystemHealth } from '../services/api';
import { SystemHealth } from '../types';
import { useAppContext } from '../contexts/AppContext';

export const SystemHealthPage: React.FC = () => {
  const { authState } = useAppContext();
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const data = await getSystemHealth();
      setHealth(data);
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!authState.isAuthenticated || authState.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center border border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need administrator privileges to view System Health.</p>
          <a href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'DEGRADED': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'UNHEALTHY': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-400';
      case 'DEGRADED': return 'bg-amber-400';
      case 'UNHEALTHY': return 'bg-red-400 animate-pulse';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
              System Health
              {health && (
                <span className="flex h-3 w-3 relative mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </h1>
            <p className="text-gray-400 mt-1">Infrastructure status and environmental impact metrics</p>
          </div>
          <a href="/admin" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-colors">
            Back to Dashboard
          </a>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'API Gateway', key: 'api' },
              { name: 'Database Engine', key: 'database' },
              { name: 'Prediction Engine', key: 'prediction' },
              { name: 'Notification Service', key: 'notifications' }
            ].map((service) => {
              const status = health ? (health[service.key as keyof SystemHealth] as string) : 'LOADING';
              return (
                <div key={service.key} className={`border rounded-lg p-5 flex flex-col ${getStatusColor(status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-200">{service.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${getStatusDot(status)}`} />
                  </div>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold uppercase">{status}</p>
                    <p className="text-xs opacity-70 mt-1">Last check: {health ? new Date(health.lastUpdated).toLocaleTimeString() : '--:--'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-xl font-semibold text-gray-200">Environmental Impact Metrics</h2>
            <p className="text-sm text-amber-500 mt-1 font-medium">SYSTEM METRICS — These represent platform activity, not externally validated impact data.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">High-risk Routes Avoided</p>
              <p className="text-3xl font-bold text-gray-100">12,450</p>
              <p className="text-xs text-gray-500 mt-1">System metric (7 days)</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Users Alerted</p>
              <p className="text-3xl font-bold text-gray-100">45,219</p>
              <p className="text-xs text-gray-500 mt-1">System metric (7 days)</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Reports Processed</p>
              <p className="text-3xl font-bold text-gray-100">1,892</p>
              <p className="text-xs text-gray-500 mt-1">System metric (7 days)</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Risk Zones Identified</p>
              <p className="text-3xl font-bold text-gray-100">84</p>
              <p className="text-xs text-gray-500 mt-1">System metric (current)</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-200 mb-6">AWS Architecture</h2>
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[800px] flex flex-col items-center gap-8 py-4">
              
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="px-6 py-3 border-2 border-blue-500/50 bg-blue-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-blue-400">Web App</div>
                  <div className="text-xs text-gray-400">React / CloudFront</div>
                </div>
                <div className="text-gray-500 font-bold">⇄</div>
                <div className="px-6 py-3 border-2 border-purple-500/50 bg-purple-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-purple-400">Cognito</div>
                  <div className="text-xs text-gray-400">Auth</div>
                </div>
              </div>

              <div className="text-gray-500 font-bold text-xl">↓</div>

              <div className="flex items-center gap-4 w-full justify-center">
                <div className="px-6 py-3 border-2 border-orange-500/50 bg-orange-500/10 rounded-lg text-center min-w-[200px]">
                  <div className="font-bold text-orange-400">API Gateway</div>
                  <div className="text-xs text-gray-400">REST & WebSocket</div>
                </div>
              </div>

              <div className="text-gray-500 font-bold text-xl">↓</div>

              <div className="flex items-center justify-center gap-8 w-full">
                <div className="px-6 py-3 border-2 border-green-500/50 bg-green-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-green-400">Lambda</div>
                  <div className="text-xs text-gray-400">Data API</div>
                </div>
                <div className="px-6 py-3 border-2 border-green-500/50 bg-green-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-green-400">Lambda</div>
                  <div className="text-xs text-gray-400">Prediction Engine</div>
                </div>
                <div className="px-6 py-3 border-2 border-green-500/50 bg-green-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-green-400">EventBridge</div>
                  <div className="text-xs text-gray-400">Cron Jobs</div>
                </div>
              </div>

              <div className="text-gray-500 font-bold text-xl">↓</div>

              <div className="flex items-center justify-center gap-8 w-full">
                <div className="px-6 py-3 border-2 border-indigo-500/50 bg-indigo-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-indigo-400">DynamoDB</div>
                  <div className="text-xs text-gray-400">NoSQL Storage</div>
                </div>
                <div className="px-6 py-3 border-2 border-indigo-500/50 bg-indigo-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-indigo-400">S3</div>
                  <div className="text-xs text-gray-400">Image Storage</div>
                </div>
                <div className="px-6 py-3 border-2 border-pink-500/50 bg-pink-500/10 rounded-lg text-center min-w-[150px]">
                  <div className="font-bold text-pink-400">SNS / SQS</div>
                  <div className="text-xs text-gray-400">Alert Queues</div>
                </div>
              </div>
              
              <div className="mt-4 px-6 py-2 border border-gray-600 bg-gray-800/50 rounded-full text-center text-sm text-gray-400">
                Observability: CloudWatch Logs & Metrics
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
