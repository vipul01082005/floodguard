import { RiskLevel } from '../types';

export const getRiskColor = (level: RiskLevel | string): string => {
  switch (level) {
    case 'LOW':
      return 'text-green-500';
    case 'MODERATE':
      return 'text-amber-500';
    case 'HIGH':
      return 'text-orange-500';
    case 'SEVERE':
      return 'text-red-500';
    default:
      return 'text-slate-400';
  }
};

export const getRiskBgColor = (level: RiskLevel | string): string => {
  switch (level) {
    case 'LOW':
      return 'bg-green-500/10 border-green-500/20';
    case 'MODERATE':
      return 'bg-amber-500/10 border-amber-500/20';
    case 'HIGH':
      return 'bg-orange-500/10 border-orange-500/20';
    case 'SEVERE':
      return 'bg-red-500/10 border-red-500/20';
    default:
      return 'bg-slate-500/10 border-slate-500/20';
  }
};

export const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

export const formatDuration = (min: number): string => {
  if (min < 60) {
    return `${Math.round(min)}m`;
  }
  const hours = Math.floor(min / 60);
  const mins = Math.round(min % 60);
  return `${hours}h ${mins}m`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};
