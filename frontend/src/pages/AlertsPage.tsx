import React, { useState } from 'react';
import { AlertCard } from '../components/alerts/AlertCard';
import { Alert } from '../types';
import { CheckCheck } from 'lucide-react';

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'SEVERE',
    title: 'Flash Flood Warning',
    message: 'Severe waterlogging reported. Avoid travel in this area.',
    riskLevel: 'SEVERE',
    locationName: 'ITO Intersection',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    read: false,
    isDemo: true,
  },
  {
    id: 'a2',
    type: 'ROUTE_CHANGE',
    title: 'Route Compromised',
    message: 'Your saved route to AIIMS now passes through a HIGH risk zone. Finding alternatives.',
    riskLevel: 'HIGH',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    isDemo: true,
  },
  {
    id: 'a3',
    type: 'HIGH_RISK',
    title: 'Drain Overflow Expected',
    message: 'Heavy rainfall over next 2 hours likely to cause drain overflow.',
    riskLevel: 'HIGH',
    locationName: 'South Extension',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    isDemo: true,
  },
  {
    id: 'a4',
    type: 'COMMUNITY_UPDATE',
    title: 'Area Cleared',
    message: 'Water levels have receded. Road is now clear for traffic.',
    riskLevel: 'LOW',
    locationName: 'Lajpat Nagar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    isDemo: true,
  }
];

const TABS = ['All', 'High Risk', 'Severe', 'Route Changes', 'Community'];

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [activeTab, setActiveTab] = useState('All');

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'All') return true;
    if (activeTab === 'High Risk' && alert.riskLevel === 'HIGH') return true;
    if (activeTab === 'Severe' && alert.riskLevel === 'SEVERE') return true;
    if (activeTab === 'Route Changes' && alert.type === 'ROUTE_CHANGE') return true;
    if (activeTab === 'Community' && alert.type === 'COMMUNITY_UPDATE') return true;
    return false;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Alerts</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide gap-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeTab === tab
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-800">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔕</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No alerts found</h3>
            <p className="text-gray-500">Your monitored areas are currently safe.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onClick={handleMarkAsRead} 
            />
          ))
        )}
      </div>
    </div>
  );
};
