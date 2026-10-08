import React, { useState, useEffect, useMemo } from 'react';
import { FloodMap } from '@/components/map/FloodMap';
import { RiskDetailPanel } from '@/components/risk/RiskDetailPanel';
import { useAppContext } from '@/contexts/AppContext';
import { DEMO_RISK_ZONES, DEMO_RISK_ASSESSMENTS, DEMO_REPORTS } from '@/services/demoData';
import { applyScenario } from '@/services/demoEngine';
import { RiskZone, RiskAssessment, DemoScenario, Report } from '@/types';

export const DashboardPage: React.FC = () => {
  const { demoState, setDemoMode } = useAppContext();
  const [zones, setZones] = useState<RiskZone[]>(DEMO_RISK_ZONES);
  const [reports] = useState<Report[]>(DEMO_REPORTS);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter zones by search
  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return zones;
    const q = searchQuery.toLowerCase();
    return zones.filter((z: RiskZone) => z.name.toLowerCase().includes(q));
  }, [zones, searchQuery]);

  // Scenario change handler
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scenario = e.target.value as DemoScenario;
    setDemoMode(true, scenario);
    const updatedZones = applyScenario(scenario, DEMO_RISK_ZONES);
    setZones(updatedZones);
  };

  // Build selected assessment from zone + demo data
  useEffect(() => {
    if (selectedZoneId) {
      const zone = zones.find((z: RiskZone) => z.id === selectedZoneId);
      const assessmentRecord = DEMO_RISK_ASSESSMENTS;
      const baseAssessment = assessmentRecord[selectedZoneId]
        || Object.values(assessmentRecord)[0];

      if (zone && baseAssessment) {
        setSelectedAssessment({
          ...baseAssessment,
          locationName: zone.name,
          riskScore: zone.riskScore,
          riskLevel: zone.riskLevel,
          isDemo: true,
        });
      }
    } else {
      setSelectedAssessment(null);
    }
  }, [selectedZoneId, zones]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-surface-950 overflow-hidden text-surface-200 font-sans pt-16">
      {/* Demo Scenario Selector */}
      <div className="absolute top-16 right-4 z-[1000] bg-surface-900 border border-surface-700 p-2 rounded-lg shadow-lg flex items-center gap-2">
        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">DEMO</span>
        <select
          value={demoState.scenario}
          onChange={handleScenarioChange}
          className="bg-surface-800 text-white text-xs rounded border border-surface-700 px-2 py-1 outline-none focus:border-blue-500"
          aria-label="Select demo scenario"
        >
          <option value="NORMAL">Normal</option>
          <option value="HEAVY_RAIN">Heavy Rain</option>
          <option value="EXTREME_RAIN">Extreme Rain</option>
          <option value="FLASH_FLOOD">Flash Flood</option>
        </select>
      </div>

      {/* Left Sidebar */}
      <div className="w-full md:w-80 h-1/3 md:h-full bg-surface-900 border-r border-surface-800 flex flex-col z-10 shadow-xl">
        <div className="p-4 border-b border-surface-800">
          <input
            type="text"
            placeholder="Search location or risk zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-surface-500"
            aria-label="Search risk zones"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2 px-2">
              Active Risk Zones ({filteredZones.length})
            </h3>
            <div className="space-y-1">
              {filteredZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id === selectedZoneId ? null : zone.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedZoneId === zone.id
                      ? 'bg-surface-800 border border-surface-600'
                      : 'hover:bg-surface-800/50 border border-transparent'
                  }`}
                  aria-label={`${zone.name}: risk level ${zone.riskLevel}, score ${zone.riskScore}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm truncate pr-2">{zone.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                        zone.riskLevel === 'LOW'
                          ? 'bg-green-900/50 text-green-400'
                          : zone.riskLevel === 'MODERATE'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : zone.riskLevel === 'HIGH'
                          ? 'bg-orange-900/50 text-orange-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {zone.riskLevel === 'SEVERE' && '🔴 '}
                      {zone.riskLevel === 'HIGH' && '⚠ '}
                      {zone.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-surface-500">
                    <span>Score: {zone.riskScore}/100</span>
                    <span>
                      {new Date(zone.lastUpdated).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {/* Mini risk bar */}
                  <div className="mt-1.5 w-full h-1 bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        zone.riskLevel === 'LOW'
                          ? 'bg-green-500'
                          : zone.riskLevel === 'MODERATE'
                          ? 'bg-yellow-500'
                          : zone.riskLevel === 'HIGH'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${zone.riskScore}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative h-2/3 md:h-full w-full">
        <FloodMap
          zones={zones}
          reports={reports}
          selectedZoneId={selectedZoneId}
          onZoneSelect={setSelectedZoneId}
        />
      </div>

      {/* Right Panel (Risk Details) */}
      <div
        className={`absolute top-16 md:top-0 right-0 h-[calc(100vh-4rem)] md:h-full w-full md:w-[400px] bg-surface-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${
          selectedAssessment ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedAssessment && (
          <RiskDetailPanel
            zone={selectedAssessment}
            onClose={() => setSelectedZoneId(null)}
          />
        )}
      </div>

      {/* Mobile Bottom Summary */}
      {!selectedAssessment && (
        <div className="md:hidden absolute bottom-0 w-full bg-surface-900 border-t border-surface-800 p-4 z-10 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold">Area Status</p>
            <p className="text-xs text-surface-400">
              {zones.filter((z: RiskZone) => z.riskLevel === 'HIGH' || z.riskLevel === 'SEVERE').length} high-risk zones active
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-surface-500">
              {demoState.scenario !== 'NORMAL' ? `Scenario: ${demoState.scenario.replace('_', ' ')}` : 'Live monitoring'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
