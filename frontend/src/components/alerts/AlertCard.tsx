import React from 'react';
import { Alert, AlertType } from '../../types';
import { ShieldAlert, AlertTriangle, Route, Users, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
  onClick: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onClick }) => {
  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'SEVERE': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'HIGH_RISK': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'ROUTE_CHANGE': return <Route className="w-5 h-5 text-blue-400" />;
      case 'COMMUNITY_UPDATE': return <Users className="w-5 h-5 text-green-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'MODERATE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'SEVERE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div 
      onClick={() => onClick(alert.id)}
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
        alert.read 
          ? 'border-gray-800 bg-gray-900/50 opacity-75' 
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      }`}
    >
      {!alert.read && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      )}
      
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-700">
            {getIcon(alert.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold truncate ${alert.read ? 'text-gray-400' : 'text-white'}`}>
              {alert.title}
            </h3>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getRiskColor(alert.riskLevel)}`}>
              {alert.riskLevel}
            </span>
          </div>
          
          <p className={`text-sm mb-3 line-clamp-2 ${alert.read ? 'text-gray-500' : 'text-gray-300'}`}>
            {alert.message}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {alert.locationName && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{alert.locationName}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
