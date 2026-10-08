import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'map' | 'chart';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'text', 
  className = '' 
}) => {
  const baseClass = 'animate-pulse bg-slate-800 rounded-md';

  switch (type) {
    case 'card':
      return (
        <div className={`p-4 border border-slate-800 rounded-lg bg-slate-900/50 ${className}`}>
          <div className={`${baseClass} h-6 w-1/3 mb-4`} />
          <div className="space-y-3">
            <div className={`${baseClass} h-4 w-full`} />
            <div className={`${baseClass} h-4 w-5/6`} />
            <div className={`${baseClass} h-4 w-4/6`} />
          </div>
        </div>
      );
    
    case 'map':
      return (
        <div className={`${baseClass} w-full h-[400px] ${className}`}>
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            Loading Map Data...
          </div>
        </div>
      );
      
    case 'chart':
      return (
        <div className={`flex items-end gap-2 h-40 ${className}`}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`${baseClass} flex-1`}
              style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
            />
          ))}
        </div>
      );

    case 'text':
    default:
      return <div className={`${baseClass} h-4 w-full ${className}`} />;
  }
};
