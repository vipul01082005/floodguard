import React from 'react';
import { RiskLevel } from '@/types';

interface RiskScoreGaugeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-16 h-16 text-lg',
  md: 'w-24 h-24 text-3xl',
  lg: 'w-32 h-32 text-4xl'
};

const strokeWidthClasses = {
  sm: 4,
  md: 6,
  lg: 8
};

const colorMap: Record<RiskLevel, string> = {
  LOW: 'text-green-500',
  MODERATE: 'text-yellow-500',
  HIGH: 'text-orange-500',
  SEVERE: 'text-red-500'
};

const strokeMap: Record<RiskLevel, string> = {
  LOW: 'stroke-green-500',
  MODERATE: 'stroke-yellow-500',
  HIGH: 'stroke-orange-500',
  SEVERE: 'stroke-red-500'
};

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score, level, size = 'md' }) => {
  const radius = 50 - strokeWidthClasses[size] / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-gray-700"
          strokeWidth={strokeWidthClasses[size]}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${strokeMap[level]} transition-all duration-1000 ease-in-out`}
          strokeWidth={strokeWidthClasses[size]}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="flex flex-col items-center justify-center z-10">
        <span className={`font-bold ${colorMap[level]}`}>{score}</span>
        {size !== 'sm' && <span className="text-xs text-gray-400">/100</span>}
      </div>
    </div>
  );
};
