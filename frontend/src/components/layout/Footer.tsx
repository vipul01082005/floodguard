import React from 'react';
import { StatusIndicator } from '../common/StatusIndicator';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          
          <div className="flex items-center gap-6">
            <StatusIndicator status="Healthy" label="API" />
            <StatusIndicator status="Healthy" label="AI Models" />
          </div>
        </div>
      </div>
    </footer>
  );
};
