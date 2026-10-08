import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, subtitle }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col">
      <h3 className="text-gray-400 text-sm font-medium mb-2">{label}</h3>
      <div className="flex items-end justify-between mt-auto">
        <span className="text-3xl font-bold text-gray-100">{value}</span>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </div>
        )}
      </div>
      {subtitle && <p className="text-gray-500 text-xs mt-2">{subtitle}</p>}
    </div>
  );
};
