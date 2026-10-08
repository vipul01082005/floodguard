import React from 'react';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface SimpleDonutChartProps {
  data: Segment[];
}

export const SimpleDonutChart: React.FC<SimpleDonutChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  if (total === 0) return <div className="h-[200px] flex items-center justify-center text-gray-500">No data</div>;

  const size = 200;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[200px] h-[200px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 w-full h-full">
          {data.map((segment, index) => {
            const strokeDasharray = `${(segment.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (segment.value / total) * circumference;
            
            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-100">{total}</span>
          <span className="text-xs text-gray-400">Total</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-xs text-gray-400">{segment.label} ({segment.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
