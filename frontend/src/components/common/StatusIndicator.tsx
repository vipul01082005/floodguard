import React from 'react';

interface StatusIndicatorProps {
  status: 'Healthy' | 'Degraded' | 'Unhealthy' | string;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  label,
  className = '' 
}) => {
  let colorClass = 'bg-slate-500';
  let textColor = 'text-slate-400';
  
  if (status.toLowerCase() === 'healthy') {
    colorClass = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    textColor = 'text-green-400';
  } else if (status.toLowerCase() === 'degraded') {
    colorClass = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    textColor = 'text-amber-400';
  } else if (status.toLowerCase() === 'unhealthy') {
    colorClass = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    textColor = 'text-red-400';
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
        {status.toLowerCase() === 'healthy' && (
          <div className="absolute w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
        )}
      </div>
      <span className={`text-xs font-medium tracking-wide ${textColor}`}>
        {label ? `${label}: ` : ''}{status}
      </span>
    </div>
  );
};
