import React from 'react';

interface Point {
  timestamp: string;
  value: number;
}

interface SimpleLineChartProps {
  data: Point[];
  color?: string;
  thresholds?: number[];
  yMax?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, color = '#3b82f6', thresholds = [], yMax = 100 }) => {
  if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-gray-500">No data available</div>;

  const width = 1000;
  const height = 200;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.value / yMax) * (height - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M ${paddingX},${height - paddingY} L ${points} L ${width - paddingX},${height - paddingY} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[200px]" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={paddingX}
            y1={height - paddingY - ratio * (height - paddingY * 2)}
            x2={width - paddingX}
            y2={height - paddingY - ratio * (height - paddingY * 2)}
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}
        {/* Y Axis Labels */}
        {[0, 25, 50, 75, 100].map((val) => (
          <text key={val} x={paddingX - 10} y={height - paddingY - (val / 100) * (height - paddingY * 2)} fill="#9ca3af" fontSize="12" textAnchor="end" alignmentBaseline="middle">
            {val}
          </text>
        ))}
        
        {/* Threshold lines */}
        {thresholds.map((t, i) => (
          <line
            key={`t-${i}`}
            x1={paddingX}
            y1={height - paddingY - (t / yMax) * (height - paddingY * 2)}
            x2={width - paddingX}
            y2={height - paddingY - (t / yMax) * (height - paddingY * 2)}
            stroke={t >= 75 ? '#ef4444' : t >= 50 ? '#f97316' : '#eab308'}
            strokeDasharray="2 2"
            strokeWidth="1.5"
          />
        ))}

        <defs>
          <linearGradient id={`gradient-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill={`url(#gradient-${color.replace('#','')})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
