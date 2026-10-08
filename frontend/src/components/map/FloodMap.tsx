import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RiskZone, Report, SelectedLocation } from '@/types';
import { MapLegend } from './MapLegend';

import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FloodMapProps {
  zones: RiskZone[];
  reports: Report[];
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
  onMapClick?: (loc: SelectedLocation) => void;
}

// Map Updater Component to change view when a zone is selected
const MapUpdater: React.FC<{ selectedZone: RiskZone | undefined }> = ({ selectedZone }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedZone) {
      map.flyTo(selectedZone.center, 14, { duration: 1.5 });
    }
  }, [selectedZone, map]);
  return null;
};

const getRiskColor = (level: string) => {
  switch (level) {
    case 'LOW': return '#22c55e';
    case 'MODERATE': return '#eab308';
    case 'HIGH': return '#f97316';
    case 'SEVERE': return '#ef4444';
    default: return '#6b7280';
  }
};

export const FloodMap: React.FC<FloodMapProps> = ({
  zones,
  reports,
  selectedZoneId,
  onZoneSelect,
  onMapClick
}) => {
  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  // Custom click handler
  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      if (!onMapClick) return;
      const handleClick = (e: L.LeafletMouseEvent) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      };
      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }, [map]);
    return null;
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      <MapContainer
        center={[28.6139, 77.2090]} // Delhi
        zoom={12}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater selectedZone={selectedZone} />
        <MapEvents />

        {/* Render Risk Zones */}
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const color = getRiskColor(zone.riskLevel);
          const isSevere = zone.riskLevel === 'SEVERE';
          
          return (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: isSelected ? 0.4 : (zone.riskScore / 200),
                weight: isSelected ? 3 : 1,
                className: isSevere ? 'animate-pulse' : ''
              }}
              eventHandlers={{
                click: () => onZoneSelect(zone.id)
              }}
            >
              <Popup>
                <div className="text-gray-900 font-sans">
                  <h3 className="font-bold text-sm">{zone.name}</h3>
                  <p className="text-xs">Risk: {zone.riskLevel} ({zone.riskScore}/100)</p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Render Reports (Simplified generic marker for now, ideally custom icons) */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
          >
            <Popup>
              <div className="text-gray-900 font-sans">
                <p className="font-bold text-sm mb-1">{report.incidentType.replace('_', ' ')}</p>
                <p className="text-xs text-gray-600">{report.description}</p>
                <p className="text-[10px] text-gray-400 mt-1">Severity: {report.severity}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Example user location marker could go here */}

      </MapContainer>
      <MapLegend />
    </div>
  );
};
