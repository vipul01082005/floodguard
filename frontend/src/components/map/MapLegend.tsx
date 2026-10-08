import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg">
      <h4 className="text-sm font-semibold text-white mb-2">Risk Levels</h4>
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs text-gray-300">Low Risk</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span className="text-xs text-gray-300">Moderate Risk</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
          <span className="text-xs text-gray-300">High Risk</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          <span className="text-xs text-gray-300">Severe Risk</span>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-white mb-2">Reports</h4>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-sm mr-2">🌊</span>
          <span className="text-xs text-gray-300">Waterlogging/Flood</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">🚧</span>
          <span className="text-xs text-gray-300">Road Blocked</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">⚠️</span>
          <span className="text-xs text-gray-300">Other Hazards</span>
        </div>
      </div>
    </div>
  );
};
