import React from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarData[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-gray-500">No data available</div>;

  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex flex-col gap-3 justify-center h-[200px] overflow-y-auto w-full">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 w-full">
          <div className="w-32 text-sm text-gray-400 text-right truncate" title={item.label}>
            {item.label.replace('_', ' ')}
          </div>
          <div className="flex-1 bg-gray-700 h-4 rounded overflow-hidden flex items-center">
            <div 
              className="h-full rounded" 
              style={{ 
                width: `${(item.value / maxVal) * 100}%`,
                backgroundColor: item.color || '#3b82f6'
              }}
            />
          </div>
          <div className="w-8 text-sm font-medium text-gray-300">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};
