import React from 'react';
import { RiskFactor } from '@/types';

interface RiskFactorBarProps {
  factor: RiskFactor;
}

const impactColors = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  SEVERE: 'bg-red-500' // Assuming SEVERE might be possible based on risk levels
};

const impactTextColors = {
  LOW: 'text-green-500',
  MEDIUM: 'text-yellow-500',
  HIGH: 'text-orange-500',
  SEVERE: 'text-red-500'
};

export const RiskFactorBar: React.FC<RiskFactorBarProps> = ({ factor }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-200">{factor.name}</span>
        <span className={`text-xs font-bold ${impactTextColors[factor.impact] || 'text-gray-400'}`}>
          {factor.impact}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${impactColors[factor.impact] || 'bg-gray-400'} h-2 rounded-full`}
          style={{ width: `${factor.value * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 mt-1">{factor.description}</p>
    </div>
  );
};
