import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from '../styles/Map.module.css';

// You'll need to replace this with your actual Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ coverageData, loading }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(null);
  const [lng] = useState(0);
  const [lat] = useState(20);
  const [zoom] = useState(1.5);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Initialize popup with custom styling
    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 15,
      className: 'custom-popup'
    });

    // Add custom CSS for the popup
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup .mapboxgl-popup-content {
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        min-width: 200px;
        position: relative;
      }
      .popup-content {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        padding-top: 5px;
      }
      .popup-content h3 {
        margin: 0 0 15px 0;
        color: #1a1a1a;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 8px;
      }
      .popup-content p {
        margin: 8px 0;
        color: #4a4a4a;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .popup-content .label {
        font-weight: 500;
        color: #666;
      }
      .popup-content .value {
        font-weight: 600;
        color: #1a1a1a;
      }
      .popup-content .coverage-value {
        color: #e41a1c;
      }
      .popup-content .cases-value {
        color: #377eb8;
      }
      .mapboxgl-popup-close-button {
        position: absolute;
        right: 8px;
        top: 8px;
        font-size: 16px;
        color: #666;
        padding: 4px;
        background: none;
        border: none;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }
      .mapboxgl-popup-close-button:hover {
        background-color: #f0f0f0;
        color: #1a1a1a;
      }
      .mapboxgl-popup-tip {
        border-top-color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);

    map.current.on('load', () => {
      console.log('Map loaded');
      // Add source for country boundaries
      map.current.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add layer for country boundaries
      map.current.addLayer({
        'id': 'country-boundaries',
        'type': 'fill',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'paint': {
          'fill-color': '#ffffff',
          'fill-opacity': 0.1,
          'fill-outline-color': '#000000'
        }
      });

      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      document.head.removeChild(style);
    };
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !coverageData) return;

    console.log('Updating map with coverage data:', coverageData);

    // Update the map with new coverage data
    const updateMap = () => {
      try {
        // Create a map of country codes to coverage values and case numbers
        const coverageMap = {};
        const caseMap = {};
        coverageData.features.forEach(feature => {
          coverageMap[feature.properties.countryCode] = feature.properties.coverage;
          caseMap[feature.properties.countryCode] = feature.properties.cases;
        });

        console.log('Coverage map:', coverageMap);

        // Update the country boundaries layer with coverage data
        map.current.setPaintProperty('country-boundaries', 'fill-color', [
          'case',
          ['has', ['get', 'iso_3166_1_alpha_3'], ['literal', coverageMap]],
          [
            'interpolate',
            ['linear'],
            ['get', ['get', 'iso_3166_1_alpha_3'], ['literal', coverageMap]],
            0, '#ffeda0',
            50, '#feb24c',
            80, '#f03b20',
            100, '#bd0026'
          ],
          '#ffffff' // Default color for countries without data
        ]);

        map.current.setPaintProperty('country-boundaries', 'fill-opacity', 0.7);

        // Remove existing event listeners
        map.current.off('click', 'country-boundaries');
        map.current.off('mouseenter', 'country-boundaries');
        map.current.off('mouseleave', 'country-boundaries');

        // Add click effect
        map.current.on('click', 'country-boundaries', (e) => {
          if (e.features.length > 0) {
            const countryCode = e.features[0].properties.iso_3166_1_alpha_3;
            const coverage = coverageMap[countryCode];
            const cases = caseMap[countryCode];
            const country = e.features[0].properties.name_en;
            
            // Toggle popup if clicking the same country
            if (selectedCountry === countryCode) {
              popup.current.remove();
              setSelectedCountry(null);
              return;
            }

            // Create popup content with both coverage and cases
            const popupContent = `
              <div class="popup-content">
                <h3>${country}</h3>
                <p>
                  <span class="label">Vaccine Coverage</span>
                  <span class="value coverage-value">${coverage !== undefined ? coverage.toFixed(1) + '%' : 'No data'}</span>
                </p>
                ${cases !== undefined ? `
                  <p>
                    <span class="label">Reported Cases</span>
                    <span class="value cases-value">${cases.toLocaleString()}</span>
                  </p>
                ` : ''}
              </div>
            `;

            // Show popup
            popup.current
              .setLngLat(e.lngLat)
              .setHTML(popupContent)
              .addTo(map.current);

            setSelectedCountry(countryCode);
          }
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'country-boundaries', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'country-boundaries', () => {
          map.current.getCanvas().style.cursor = '';
        });

      } catch (error) {
        console.error('Error updating map:', error);
      }
    };

    updateMap();
  }, [coverageData, mapLoaded, selectedCountry]);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainer} className={styles.mapContainer} />
      {loading && <div className={styles.loading}>Loading data...</div>}
    </div>
  );
};

export default Map; 