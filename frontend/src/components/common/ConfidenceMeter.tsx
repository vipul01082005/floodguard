import React from 'react';

interface ConfidenceMeterProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ 
  value, 
  label = 'AI Confidence',
  className = '' 
}) => {
  const percentage = Math.max(0, Math.min(100, value));
  
  // Determine color based on value
  let colorClass = 'bg-green-500';
  if (percentage < 50) colorClass = 'bg-orange-500';
  else if (percentage < 75) colorClass = 'bg-amber-500';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-medium text-slate-300">{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {percentage < 50 && (
        <span className="text-xs text-orange-400/80">
          Low confidence. Manual verification recommended.
        </span>
      )}
    </div>
  );
};
