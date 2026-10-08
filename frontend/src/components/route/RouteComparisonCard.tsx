import React from 'react';
import { RouteOption } from '../../types';
import { Shield, Clock, Map, AlertTriangle, CheckCircle } from 'lucide-react';

interface RouteComparisonCardProps {
  route: RouteOption;
  letter: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const RouteComparisonCard: React.FC<RouteComparisonCardProps> = ({
  route,
  letter,
  isSelected,
  onSelect,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'HIGH': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'SEVERE': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div 
      className={`p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-blue-500 bg-gray-800/80 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${
            isSelected ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}>
            {letter}
          </div>
          <div>
            <h3 className="font-bold text-white">{route.name}</h3>
            <div className="flex gap-2 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Map className="w-3 h-3" /> {route.distance.toFixed(1)} km</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.duration} min</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={`px-2 py-1 rounded text-xs font-semibold border ${getRiskColor(route.riskLevel)}`}>
            {route.riskLevel} RISK
          </div>
          {route.isRecommended && (
            <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">
              <CheckCircle className="w-3 h-3" /> RECOMMENDED
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="bg-gray-900/50 p-2 rounded flex flex-col">
          <span className="text-gray-400 text-xs mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Safety Score
          </span>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${route.safetyScore >= 80 ? 'text-green-400' : route.safetyScore >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {route.safetyScore}/100
            </span>
            <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${route.safetyScore >= 80 ? 'bg-green-400' : route.safetyScore >= 50 ? 'bg-yellow-400' : 'bg-orange-400'}`}
                style={{ width: `${route.safetyScore}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 p-2 rounded flex flex-col">
          <span className="text-gray-400 text-xs mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Flood Risk
          </span>
          <span className="font-bold text-white">
            {Math.round(route.floodExposure * 100)}% exposure
          </span>
          {route.riskyZoneCount > 0 && (
            <span className="text-xs text-orange-400">Passes {route.riskyZoneCount} risky zones</span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 bg-blue-900/20 p-2 rounded border border-blue-500/20">
        {route.explanation}
      </p>

      <button
        onClick={onSelect}
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {isSelected ? 'Selected Route' : 'Select Route'}
      </button>
    </div>
  );
};
