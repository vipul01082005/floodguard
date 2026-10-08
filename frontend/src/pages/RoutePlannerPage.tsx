import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RouteComparisonCard } from '../components/route/RouteComparisonCard';
import { RouteOption, RiskLevel, RiskZone } from '../types';
import { MapPin, Navigation, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { DEMO_RISK_ZONES } from '../services/demoData';
import { useSearchParams } from 'react-router-dom';

// Known locations in Delhi with coordinates
const KNOWN_LOCATIONS: Record<string, [number, number]> = {
  'india gate':       [28.6129, 77.2295],
  'aiims':            [28.5672, 77.2100],
  'connaught place':  [28.6315, 77.2167],
  'cp':               [28.6315, 77.2167],
  'ito':              [28.6289, 77.2405],
  'minto bridge':     [28.6350, 77.2200],
  'pragati maidan':   [28.6197, 77.2469],
  'sarai kale khan':  [28.5895, 77.2575],
  'lajpat nagar':     [28.5700, 77.2400],
  'dwarka':           [28.5921, 77.0460],
  'rohini':           [28.7495, 77.0565],
  'yamuna bank':      [28.6180, 77.2730],
  'mundka':           [28.6814, 77.0294],
  'okhla':            [28.5456, 77.2732],
  'mayur vihar':      [28.6058, 77.2951],
  'janpath':          [28.6240, 77.2180],
  'karol bagh':       [28.6514, 77.1907],
  'rajiv chowk':      [28.6328, 77.2197],
  'nehru place':      [28.5491, 77.2533],
  'hauz khas':        [28.5494, 77.2001],
  'greater kailash':  [28.5412, 77.2430],
  'defence colony':   [28.5728, 77.2310],
  'south extension':  [28.5770, 77.2210],
  'green park':       [28.5592, 77.2070],
  'lodhi road':       [28.5918, 77.2273],
  'khan market':      [28.6006, 77.2278],
};

function resolveLocation(input: string): [number, number] | null {
  const key = input.trim().toLowerCase();
  if (KNOWN_LOCATIONS[key]) return KNOWN_LOCATIONS[key];
  // Fuzzy match
  for (const [name, coords] of Object.entries(KNOWN_LOCATIONS)) {
    if (name.includes(key) || key.includes(name)) return coords;
  }
  return null;
}

// Calculate distance between two lat/lng points in km
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Check if a point is within a risk zone
function pointInZone(point: [number, number], zone: RiskZone): boolean {
  const dist = haversine(point, zone.center) * 1000; // to meters
  return dist <= zone.radius;
}

// Generate a realistic waypoint path between two points with a detour factor
function generatePath(
  from: [number, number],
  to: [number, number],
  detour: { lat: number; lng: number } | null,
  jitter: number
): [number, number][] {
  const points: [number, number][] = [from];
  const steps = 12;

  if (detour) {
    // First half: from → detour point
    for (let i = 1; i <= steps / 2; i++) {
      const t = i / (steps / 2);
      points.push([
        from[0] + (detour.lat - from[0]) * t + (Math.random() - 0.5) * jitter,
        from[1] + (detour.lng - from[1]) * t + (Math.random() - 0.5) * jitter,
      ]);
    }
    // Second half: detour → destination
    for (let i = 1; i <= steps / 2; i++) {
      const t = i / (steps / 2);
      points.push([
        detour.lat + (to[0] - detour.lat) * t + (Math.random() - 0.5) * jitter,
        detour.lng + (to[1] - detour.lng) * t + (Math.random() - 0.5) * jitter,
      ]);
    }
  } else {
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      points.push([
        from[0] + (to[0] - from[0]) * t + (Math.random() - 0.5) * jitter,
        from[1] + (to[1] - from[1]) * t + (Math.random() - 0.5) * jitter,
      ]);
    }
  }

  points.push(to);
  return points;
}

// Generate routes dynamically based on origin/destination
function generateRoutes(
  from: [number, number],
  to: [number, number],
  originName: string,
  destName: string,
  zones: RiskZone[]
): RouteOption[] {
  const directDist = haversine(from, to);

  // Route A: Direct / shortest — goes straight, may hit flood zones
  const pathA = generatePath(from, to, null, 0.003);
  const zonesHitA = zones.filter(z => pathA.some(p => pointInZone(p, z)));
  const floodExposureA = zonesHitA.length > 0
    ? Math.min(0.95, zonesHitA.reduce((s, z) => s + z.riskScore / 100, 0) / Math.max(zonesHitA.length * 0.8, 1))
    : 0.05;

  // Route B: Slightly longer, avoids worst zones — detour to the south/west
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const offsetB = { lat: midLat - 0.015, lng: midLng - 0.02 };
  const pathB = generatePath(from, to, offsetB, 0.004);
  const zonesHitB = zones.filter(z => pathB.some(p => pointInZone(p, z)));
  const floodExposureB = zonesHitB.length > 0
    ? Math.min(0.6, zonesHitB.reduce((s, z) => s + z.riskScore / 100, 0) / Math.max(zonesHitB.length * 1.5, 1))
    : 0.03;

  // Route C: Longest, maximum avoidance — big detour
  const offsetC = { lat: midLat + 0.025, lng: midLng + 0.03 };
  const pathC = generatePath(from, to, offsetC, 0.005);
  const zonesHitC = zones.filter(z => pathC.some(p => pointInZone(p, z)));
  const floodExposureC = zonesHitC.length > 0
    ? Math.min(0.3, zonesHitC.reduce((s, z) => s + z.riskScore / 100, 0) / Math.max(zonesHitC.length * 3, 1))
    : 0.02;

  const distA = +(directDist * 1.1).toFixed(1);
  const distB = +(directDist * 1.35).toFixed(1);
  const distC = +(directDist * 1.6).toFixed(1);

  const durA = Math.round(distA * 3.2);
  const durB = Math.round(distB * 3.0);
  const durC = Math.round(distC * 2.8);

  const safetyA = Math.round(100 - floodExposureA * 100);
  const safetyB = Math.round(100 - floodExposureB * 100);
  const safetyC = Math.round(100 - floodExposureC * 100);

  function riskLevel(exposure: number): RiskLevel {
    if (exposure < 0.25) return 'LOW';
    if (exposure < 0.5) return 'MODERATE';
    if (exposure < 0.75) return 'HIGH';
    return 'SEVERE';
  }

  const routes: RouteOption[] = [
    {
      id: 'route-a',
      name: `Direct via ${zonesHitA.length > 0 ? zonesHitA[0].name : 'Main Road'}`,
      distance: distA,
      duration: durA,
      floodExposure: +floodExposureA.toFixed(2),
      riskyZoneCount: zonesHitA.length,
      safetyScore: safetyA,
      riskLevel: riskLevel(floodExposureA),
      isRecommended: false,
      waypoints: pathA,
      riskSegments: [],
      explanation: zonesHitA.length > 0
        ? `Shortest route but passes through ${zonesHitA.map(z => z.name).join(', ')}. ${zonesHitA.filter(z => z.riskLevel === 'SEVERE').length > 0 ? 'Severe flooding risk.' : 'Moderate flooding risk.'}`
        : `Direct route with minimal flood exposure.`,
    },
    {
      id: 'route-b',
      name: `Via Ring Road / Bypass`,
      distance: distB,
      duration: durB,
      floodExposure: +floodExposureB.toFixed(2),
      riskyZoneCount: zonesHitB.length,
      safetyScore: safetyB,
      riskLevel: riskLevel(floodExposureB),
      isRecommended: false,
      waypoints: pathB,
      riskSegments: [],
      explanation: `${Math.round(durB - durA)} min longer but avoids ${zonesHitA.length - zonesHitB.length} high-risk flood zone${zonesHitA.length - zonesHitB.length !== 1 ? 's' : ''}.`,
    },
    {
      id: 'route-c',
      name: `Via Outer Ring / NH bypass`,
      distance: distC,
      duration: durC,
      floodExposure: +floodExposureC.toFixed(2),
      riskyZoneCount: zonesHitC.length,
      safetyScore: safetyC,
      riskLevel: riskLevel(floodExposureC),
      isRecommended: false,
      waypoints: pathC,
      riskSegments: [],
      explanation: `Longest route but maximum safety. Avoids all major flood zones between ${originName} and ${destName}.`,
    },
  ];

  // Mark the safest route as recommended (highest safety score)
  const bestIdx = routes.reduce((best, r, i) => r.safetyScore > routes[best].safetyScore ? i : best, 0);
  routes[bestIdx].isRecommended = true;

  return routes;
}

// Map component that fits bounds to show all routes
function MapFitter({ routes }: { routes: RouteOption[] }) {
  const map = useMap();
  useEffect(() => {
    if (routes.length > 0) {
      const allPoints = routes.flatMap(r => r.waypoints);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints.map(p => [p[0], p[1]] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [routes, map]);
  return null;
}

const ROUTE_COLORS: Record<string, string> = {
  'route-a': '#f97316', // orange
  'route-b': '#3b82f6', // blue
  'route-c': '#22c55e', // green
};

export const RoutePlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [origin, setOrigin] = useState(searchParams.get('from') || '');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFindRoutes = () => {
    if (!origin.trim() || !destination.trim()) return;

    const fromCoords = resolveLocation(origin);
    const toCoords = resolveLocation(destination);

    if (!fromCoords) {
      setError(`Could not find "${origin}". Try: India Gate, AIIMS, CP, Rohini, Dwarka, etc.`);
      return;
    }
    if (!toCoords) {
      setError(`Could not find "${destination}". Try: India Gate, AIIMS, CP, Rohini, Dwarka, etc.`);
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate brief analysis delay
    setTimeout(() => {
      const generated = generateRoutes(fromCoords, toCoords, origin, destination, DEMO_RISK_ZONES);
      setRoutes(generated);
      setSelectedRouteId(generated.find(r => r.isRecommended)?.id || generated[0].id);
      setIsLoading(false);
    }, 800);
  };

  const selectedRoute = routes?.find(r => r.id === selectedRouteId);
  const recommended = routes?.find(r => r.isRecommended);
  const shortest = routes?.[0];

  // Safety comparison message
  const comparisonMessage = useMemo(() => {
    if (!recommended || !shortest || recommended.id === shortest.id) return null;
    const timeDiff = recommended.duration - shortest.duration;
    const zonesDiff = shortest.riskyZoneCount - recommended.riskyZoneCount;
    if (timeDiff <= 0 || zonesDiff <= 0) return null;
    return `Recommended route is ${timeDiff} min longer but avoids ${zonesDiff} high-risk flood zone${zonesDiff !== 1 ? 's' : ''}.`;
  }, [recommended, shortest]);

  // Risk zone color
  function zoneColor(level: RiskLevel): string {
    switch (level) {
      case 'LOW': return '#22c55e';
      case 'MODERATE': return '#eab308';
      case 'HIGH': return '#f97316';
      case 'SEVERE': return '#ef4444';
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-full lg:w-[420px] flex flex-col bg-surface-900 border-r border-surface-800 overflow-hidden">

        {/* Form */}
        <div className="p-5 border-b border-surface-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            Safe Route Planner
          </h2>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute top-3 left-3 text-surface-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={origin}
                onChange={(e) => { setOrigin(e.target.value); setError(''); }}
                placeholder="FROM (e.g. India Gate)"
                className="w-full bg-surface-800 border border-surface-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleFindRoutes()}
                aria-label="Origin location"
              />
            </div>

            <div className="flex justify-center -my-1 relative z-10">
              <button
                onClick={() => { setOrigin(destination); setDestination(origin); }}
                className="bg-surface-700 p-1.5 rounded-full text-surface-300 hover:text-white hover:bg-surface-600 transition-colors border-2 border-surface-800"
                aria-label="Swap origin and destination"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 rotate-90" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute top-3 left-3 text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setError(''); }}
                placeholder="TO (e.g. AIIMS)"
                className="w-full bg-surface-800 border border-surface-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleFindRoutes()}
                aria-label="Destination location"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-2.5 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleFindRoutes}
              disabled={!origin.trim() || !destination.trim() || isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-surface-700 disabled:text-surface-500 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {isLoading ? 'Analyzing Routes...' : 'Find Safe Routes'}
            </button>
          </div>

          <div className="mt-3">
            <p className="text-[10px] text-surface-500 mb-1.5 uppercase font-semibold tracking-wider">Quick Locations</p>
            <div className="flex flex-wrap gap-1.5">
              {['India Gate', 'AIIMS', 'CP', 'ITO', 'Rohini', 'Dwarka', 'Lajpat Nagar', 'Okhla'].map(loc => (
                <button
                  key={loc}
                  onClick={() => !origin ? setOrigin(loc) : setDestination(loc)}
                  className="px-2 py-1 bg-surface-800 border border-surface-700 rounded text-[11px] text-surface-300 hover:bg-surface-700 hover:text-white transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!routes && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-surface-500 p-6 text-center">
              <Navigation className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">Enter origin and destination to find the safest routes avoiding flood zones.</p>
              <p className="text-xs mt-2 text-surface-600">Try: India Gate → AIIMS</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-surface-400">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Analyzing flood risk along routes...</p>
            </div>
          )}

          {comparisonMessage && (
            <div className="p-3 bg-blue-900/20 border border-blue-800/40 rounded-lg text-blue-300 text-xs flex items-start gap-2">
              <span className="text-blue-400 text-lg leading-none">✓</span>
              <span>{comparisonMessage}</span>
            </div>
          )}

          {routes && routes.map((route, idx) => (
            <RouteComparisonCard
              key={route.id}
              route={route}
              letter={String.fromCharCode(65 + idx)}
              isSelected={selectedRouteId === route.id}
              onSelect={() => setSelectedRouteId(route.id)}
            />
          ))}

          {routes && (
            <p className="text-[10px] text-surface-600 text-center pt-2">
              DEMO DATA — Routes are simulated for demonstration
            </p>
          )}
        </div>
      </div>

      {/* Right Area - Actual Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={12}
          className="w-full h-full z-0"
          zoomControl={true}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {routes && <MapFitter routes={routes} />}

          {/* Draw risk zones */}
          {DEMO_RISK_ZONES.map(zone => (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zoneColor(zone.riskLevel),
                fillColor: zoneColor(zone.riskLevel),
                fillOpacity: 0.15,
                weight: 1,
                dashArray: '4 4',
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{zone.name}</strong><br />
                  Risk: {zone.riskScore}/100 ({zone.riskLevel})
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Draw route polylines */}
          {routes && routes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.waypoints}
              pathOptions={{
                color: ROUTE_COLORS[route.id] || '#888',
                weight: selectedRouteId === route.id ? 5 : 3,
                opacity: selectedRouteId === route.id ? 1 : 0.5,
                dashArray: route.isRecommended ? undefined : '8 6',
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{route.name}</strong><br />
                  {route.distance} km · {route.duration} min<br />
                  Safety: {route.safetyScore}/100
                  {route.isRecommended && <><br /><strong className="text-green-600">✓ RECOMMENDED</strong></>}
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Origin / Destination markers */}
          {routes && routes[0]?.waypoints.length > 0 && (
            <>
              <Marker position={routes[0].waypoints[0]}>
                <Popup><strong>Origin:</strong> {origin}</Popup>
              </Marker>
              <Marker position={routes[0].waypoints[routes[0].waypoints.length - 1]}>
                <Popup><strong>Destination:</strong> {destination}</Popup>
              </Marker>
            </>
          )}
        </MapContainer>

        {/* Map legend */}
        {routes && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-surface-900/90 border border-surface-700 rounded-lg p-3 text-xs backdrop-blur-sm">
            <p className="font-semibold text-surface-300 mb-2">Routes</p>
            {routes.map((route, idx) => (
              <div key={route.id} className="flex items-center gap-2 mb-1">
                <div
                  className="w-5 h-0.5 rounded"
                  style={{
                    backgroundColor: ROUTE_COLORS[route.id],
                    borderStyle: route.isRecommended ? 'solid' : 'dashed',
                  }}
                />
                <span className="text-surface-300">
                  {String.fromCharCode(65 + idx)}: {route.name}
                  {route.isRecommended && ' ✓'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
