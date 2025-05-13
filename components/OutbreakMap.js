import { MapContainer, TileLayer, CircleMarker, Popup, Circle, LayerGroup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Import Leaflet CSS in a Next.js-friendly way
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

// Fix Leaflet default icon
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const SEVERITY_COLORS = {
  high: '#ef4444',    // red-500
  moderate: '#f59e0b', // amber-500
  low: '#10b981'      // emerald-500
};

const SEVERITY_RADIUS = {
  high: 15,
  moderate: 12,
  low: 8
};

export default function OutbreakMap({ disease, timePeriod, severity, showVaccineOverlay, showTrialsOverlay }) {
  const [outbreaks, setOutbreaks] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutbreakData = async () => {
      if (!disease) {
        setOutbreaks([]);
        setMapCenter([20, 0]);
        setMapZoom(2);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/outbreaks?disease=${disease}&timePeriod=${timePeriod}&severity=${severity}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch outbreak data');
        }

        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          setOutbreaks([]);
          return;
        }

        setOutbreaks(data.features);

        // Center map on the first outbreak if available
        if (data.features.length > 0) {
          const firstOutbreak = data.features[0];
          setMapCenter(firstOutbreak.geometry.coordinates.reverse());
          setMapZoom(4);
        }
      } catch (err) {
        console.error('Error fetching outbreak data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutbreakData();
  }, [disease, timePeriod, severity]);

  const getVaccineColor = (coverage) => {
    if (coverage >= 90) return '#10b981'; // emerald-500
    if (coverage >= 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Loading outbreak data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Outbreak Markers */}
        <LayerGroup>
          {outbreaks.map((outbreak, index) => (
            <CircleMarker
              key={`outbreak-${index}`}
              center={outbreak.geometry.coordinates}
              radius={SEVERITY_RADIUS[outbreak.properties.severity]}
              pathOptions={{
                color: SEVERITY_COLORS[outbreak.properties.severity],
                fillColor: SEVERITY_COLORS[outbreak.properties.severity],
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{outbreak.properties.country}</h3>
                  <p className="text-sm">Cases: {outbreak.properties.cases}</p>
                  <p className="text-sm">Severity: {outbreak.properties.severity}</p>
                  <p className="text-sm">Last Updated: {new Date(outbreak.properties.lastUpdated).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Recommendations:</p>
                    <ul className="text-sm list-disc list-inside">
                      {outbreak.properties.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </LayerGroup>

        {/* Vaccine Coverage Overlay */}
        {showVaccineOverlay && disease && (
          <LayerGroup>
            {/* This will be implemented when we have real vaccine coverage data */}
          </LayerGroup>
        )}

        {/* Clinical Trials Overlay */}
        {showTrialsOverlay && disease && (
          <LayerGroup>
            {/* This will be implemented when we have real clinical trials data */}
          </LayerGroup>
        )}
      </MapContainer>
    </div>
  );
} 