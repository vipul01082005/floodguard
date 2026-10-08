import React from 'react';
import { IncidentType } from '../../types';
import { Droplets, CloudRain, Ban, Waves, Car, CloudLightning } from 'lucide-react';

interface IncidentTypeSelectorProps {
  selected: IncidentType | null;
  onSelect: (type: IncidentType) => void;
}

const INCIDENT_TYPES: { type: IncidentType; label: string; icon: React.FC<any> }[] = [
  { type: 'WATERLOGGING', label: 'Waterlogging', icon: Droplets },
  { type: 'FLOODING', label: 'Flooding', icon: Waves },
  { type: 'ROAD_BLOCKED', label: 'Road Blocked', icon: Ban },
  { type: 'DRAIN_OVERFLOW', label: 'Drain Overflow', icon: CloudRain },
  { type: 'STRANDED_VEHICLE', label: 'Stranded Vehicle', icon: Car },
  { type: 'HEAVY_RAINFALL', label: 'Heavy Rainfall', icon: CloudLightning },
];

export const IncidentTypeSelector: React.FC<IncidentTypeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {INCIDENT_TYPES.map(({ type, label, icon: Icon }) => {
        const isSelected = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200'
            }`}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium text-center">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
