import React from 'react';
import { RiskLevel } from '../../types';
import { getRiskColor, getRiskBgColor } from '../../utils/helpers';

interface RiskBadgeProps {
  riskLevel: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getRiskIcon = (level: RiskLevel | string) => {
  switch (level) {
    case 'LOW':
      return '✓';
    case 'MODERATE':
    case 'HIGH':
      return '⚠';
    case 'SEVERE':
      return '🔴';
    default:
      return '•';
  }
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  riskLevel, 
  size = 'md',
  className = ''
}) => {
  const bgColor = getRiskBgColor(riskLevel);
  const textColor = getRiskColor(riskLevel);
  const icon = getRiskIcon(riskLevel);

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bgColor} ${textColor} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Risk level: ${riskLevel}`}
    >
      <span aria-hidden="true">{icon}</span>
      {riskLevel}
    </span>
  );
};
