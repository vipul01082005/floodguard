import React from 'react';
import { ReportSeverity } from '../../types';

interface SeveritySelectorProps {
  selected: ReportSeverity | null;
  onSelect: (severity: ReportSeverity) => void;
}

const SEVERITY_OPTIONS: { severity: ReportSeverity; label: string; colorClass: string; dotClass: string }[] = [
  { severity: 'LOW', label: 'Low', colorClass: 'hover:bg-green-500/20 data-[selected=true]:bg-green-500/20 data-[selected=true]:border-green-500', dotClass: 'bg-green-500' },
  { severity: 'MODERATE', label: 'Moderate', colorClass: 'hover:bg-yellow-500/20 data-[selected=true]:bg-yellow-500/20 data-[selected=true]:border-yellow-500', dotClass: 'bg-yellow-500' },
  { severity: 'HIGH', label: 'High', colorClass: 'hover:bg-orange-500/20 data-[selected=true]:bg-orange-500/20 data-[selected=true]:border-orange-500', dotClass: 'bg-orange-500' },
  { severity: 'SEVERE', label: 'Severe', colorClass: 'hover:bg-red-500/20 data-[selected=true]:bg-red-500/20 data-[selected=true]:border-red-500', dotClass: 'bg-red-500' },
];

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {SEVERITY_OPTIONS.map(({ severity, label, colorClass, dotClass }) => (
        <button
          key={severity}
          type="button"
          data-selected={selected === severity}
          onClick={() => onSelect(severity)}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-700 bg-gray-800 transition-all ${colorClass}`}
        >
          <span className={`w-3 h-3 rounded-full ${dotClass}`}></span>
          <span className={`font-medium ${selected === severity ? 'text-white' : 'text-gray-300'}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};
