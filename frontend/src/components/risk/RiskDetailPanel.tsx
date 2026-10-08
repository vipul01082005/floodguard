import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskAssessment } from '@/types';
import { RiskScoreGauge } from './RiskScoreGauge';
import { RiskFactorBar } from './RiskFactorBar';

interface RiskDetailPanelProps {
  zone: RiskAssessment;
  onClose: () => void;
}

const getRecommendation = (level: string) => {
  switch (level) {
    case 'LOW':
      return 'Normal conditions. Stay informed.';
    case 'MODERATE':
      return 'Monitor conditions. Prepare alternative routes.';
    case 'HIGH':
      return 'Avoid low-lying roads. Consider alternative routes.';
    case 'SEVERE':
      return 'Avoid this area. Use recommended safe routes.';
    default:
      return '';
  }
};

export const RiskDetailPanel: React.FC<RiskDetailPanelProps> = ({ zone, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 text-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold">{zone.locationName}</h2>
          {zone.isDemo && (
            <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded mt-1">
              DEMO MODE
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Risk Score Area */}
        <div className="flex flex-col items-center justify-center p-4 bg-gray-800/50 rounded-xl">
          <RiskScoreGauge score={zone.riskScore} level={zone.riskLevel} size="lg" />
          <div className="mt-4 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
              zone.riskLevel === 'LOW' ? 'bg-green-900/50 text-green-400' :
              zone.riskLevel === 'MODERATE' ? 'bg-yellow-900/50 text-yellow-400' :
              zone.riskLevel === 'HIGH' ? 'bg-orange-900/50 text-orange-400' :
              'bg-red-900/50 text-red-400'
            }`}>
              {zone.riskLevel} RISK
            </span>
          </div>
          
          {/* Confidence Meter */}
          <div className="w-full mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Data Confidence</span>
              <span>{Math.round(zone.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${zone.confidence * 100}%` }}
              ></div>
            </div>
            {zone.confidence < 0.5 && (
              <p className="text-xs text-yellow-500 mt-2 flex items-center">
                <span className="mr-1">⚠️</span> Limited data. Treat as advisory.
              </p>
            )}
          </div>
        </div>

        {/* Current Conditions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Conditions</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Rainfall</p>
              <p className="text-lg font-semibold">
                {zone.rainfall.current} <span className="text-sm font-normal text-gray-500">mm/hr</span>
                {zone.rainfall.trend === 'INCREASING' ? ' ↗' : zone.rainfall.trend === 'DECREASING' ? ' ↘' : ' →'}
              </p>
              <span className="text-xs text-blue-400">{zone.rainfall.intensity}</span>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Risk Window</p>
              <p className="text-sm font-medium">{zone.riskWindow}</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Recent Reports</p>
              <p className="text-lg font-semibold">{zone.recentReportCount}</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Historical Floods</p>
              <p className="text-lg font-semibold">{zone.historicalFloodCount}</p>
            </div>
          </div>
        </div>

        {/* Why is this area at risk? */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Why is this area at risk?</h3>
          <div className="bg-gray-800/50 p-4 rounded-xl">
            {zone.topFactors.map((factor, idx) => (
              <RiskFactorBar key={idx} factor={factor} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recommendations</h3>
          <div className={`p-4 rounded-xl border ${
            zone.riskLevel === 'LOW' ? 'bg-green-900/20 border-green-900/50 text-green-300' :
            zone.riskLevel === 'MODERATE' ? 'bg-yellow-900/20 border-yellow-900/50 text-yellow-300' :
            zone.riskLevel === 'HIGH' ? 'bg-orange-900/20 border-orange-900/50 text-orange-300' :
            'bg-red-900/20 border-red-900/50 text-red-300'
          }`}>
            <p className="text-sm font-medium">{getRecommendation(zone.riskLevel)}</p>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => navigate(`/routes?from=${encodeURIComponent(zone.locationName)}`)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Plan Safe Route
        </button>
      </div>
    </div>
  );
};
