import React, { useState, useCallback, useEffect } from 'react'
import Map, { Source, Layer, NavigationControl, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Loader2, Users, TrendingUp, Calendar, Info } from 'lucide-react'

// Mapbox token should be in your environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// Add error message for missing token
if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file')
}

// Layer styles
const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'vaccine-data',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      100,
      30,
      750,
      40
    ]
  }
}

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'vaccine-data',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
}

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'vaccine-data',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'interpolate',
      ['linear'],
      ['get', 'coverage'],
      0, '#ffeda0',
      25, '#feb24c',
      50, '#f03b20',
      75, '#bd0026',
      90, '#800026'
    ],
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', 'coverage'],
      0, 4,
      50, 8,
      90, 12
    ],
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
}

// Coverage legend data
const coverageLegend = [
  { color: '#ffeda0', label: '0-25%', description: 'Low coverage' },
  { color: '#feb24c', label: '25-50%', description: 'Below average' },
  { color: '#f03b20', label: '50-75%', description: 'Moderate coverage' },
  { color: '#bd0026', label: '75-90%', description: 'Good coverage' },
  { color: '#800026', label: '90-100%', description: 'Excellent coverage' }
]

// Cluster legend data
const clusterLegend = [
  { color: '#51bbd6', label: 'Small cluster', description: '1-100 countries' },
  { color: '#f1f075', label: 'Medium cluster', description: '100-750 countries' },
  { color: '#f28cb1', label: 'Large cluster', description: '750+ countries' }
]

export default function VaccineMap() {
  const [viewport, setViewport] = useState({
    latitude: 20,
    longitude: 0,
    zoom: 1.5,
    padding: {
      left: 320,
      top: 0,
      right: 0,
      bottom: 0
    }
  })
  const [popupInfo, setPopupInfo] = useState(null)
  const [vaccineData, setVaccineData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [indicators, setIndicators] = useState([])
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const [selectedYear, setSelectedYear] = useState('latest')
  const [years] = useState(['latest', '2023', '2022', '2021', '2020', '2019'])

  // Fetch available indicators
  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vaccine-data');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch indicators');
        }
        const data = await response.json();
        if (data.indicators) {
          setIndicators(data.indicators);
          if (data.indicators.length > 0) {
            setSelectedIndicator(data.indicators[0].code);
          }
        }
      } catch (err) {
        console.error('Error fetching indicators:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicators();
  }, []);

  // Fetch data for selected indicator and year
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedIndicator) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching vaccine data:', { indicator: selectedIndicator, year: selectedYear });
        const response = await fetch(`/api/vaccine-data?indicator=${selectedIndicator}&year=${selectedYear}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch vaccine data');
        }
        
        const data = await response.json();
        console.log('Received data:', {
          type: data.type,
          totalFeatures: data.features?.length,
          sampleFeature: data.features?.[0]
        });

        if (!data.features || data.features.length === 0) {
          throw new Error('No vaccine data available for selected parameters');
        }

        // Update coordinates for each feature
        const updatedFeatures = data.features.map(feature => {
          const country = feature.properties.name;
          const coordinates = getCountryCoordinates(country);
          if (coordinates) {
            return {
              ...feature,
              geometry: {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude]
              },
              properties: {
                ...feature.properties,
                displayName: country,
                formattedCoverage: `${feature.properties.coverage.toFixed(1)}%`
              }
            };
          }
          return null;
        }).filter(Boolean);

        setVaccineData({
          type: 'FeatureCollection',
          features: updatedFeatures
        });
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedIndicator, selectedYear]);

  const getCountryCoordinates = (countryCode) => {
    const countryCoordinates = {
      'AFG': { latitude: 33.9391, longitude: 67.7100 },
      'ALB': { latitude: 41.1533, longitude: 20.1683 },
      'DZA': { latitude: 28.0339, longitude: 1.6596 },
      'AND': { latitude: 42.5063, longitude: 1.5218 },
      'AGO': { latitude: -11.2027, longitude: 17.8739 },
      'ATG': { latitude: 17.0608, longitude: -61.7964 },
      'ARG': { latitude: -38.4161, longitude: -63.6167 },
      'ARM': { latitude: 40.0691, longitude: 45.0382 },
      'AUS': { latitude: -25.2744, longitude: 133.7751 },
      'AUT': { latitude: 47.5162, longitude: 14.5501 },
      'AZE': { latitude: 40.1431, longitude: 47.5769 },
      'BHS': { latitude: 25.0343, longitude: -77.3963 },
      'BHR': { latitude: 26.0667, longitude: 50.5577 },
      'BGD': { latitude: 23.6850, longitude: 90.3563 },
      'BRB': { latitude: 13.1939, longitude: -59.5432 },
      'BLR': { latitude: 53.7098, longitude: 27.9534 },
      'BEL': { latitude: 50.8503, longitude: 4.3517 },
      'BLZ': { latitude: 17.1899, longitude: -88.4976 },
      'BEN': { latitude: 9.3077, longitude: 2.3158 },
      'BTN': { latitude: 27.5142, longitude: 90.4336 },
      'BOL': { latitude: -16.2902, longitude: -63.5887 },
      'BIH': { latitude: 43.9159, longitude: 17.6791 },
      'BWA': { latitude: -22.3285, longitude: 24.6849 },
      'BRA': { latitude: -14.2350, longitude: -51.9253 },
      'BRN': { latitude: 4.5353, longitude: 114.7277 },
      'BGR': { latitude: 42.7339, longitude: 25.4858 },
      'BFA': { latitude: 12.2383, longitude: -1.5616 },
      'BDI': { latitude: -3.3731, longitude: 29.9189 },
      'CPV': { latitude: 16.5388, longitude: -23.0418 },
      'KHM': { latitude: 12.5657, longitude: 104.9910 },
      'CMR': { latitude: 7.3697, longitude: 12.3547 },
      'CAN': { latitude: 56.1304, longitude: -106.3468 },
      'CAF': { latitude: 6.6111, longitude: 20.9394 },
      'TCD': { latitude: 15.4542, longitude: 18.7322 },
      'CHL': { latitude: -35.6751, longitude: -71.5430 },
      'CHN': { latitude: 35.8617, longitude: 104.1954 },
      'COL': { latitude: 4.5709, longitude: -74.2973 },
      'COM': { latitude: -11.6455, longitude: 43.3333 },
      'COG': { latitude: -0.2280, longitude: 15.8277 },
      'CRI': { latitude: 9.7489, longitude: -83.7534 },
      'HRV': { latitude: 45.1000, longitude: 15.2000 },
      'CUB': { latitude: 21.5218, longitude: -77.7812 },
      'CYP': { latitude: 35.1264, longitude: 33.4299 },
      'CZE': { latitude: 49.8175, longitude: 15.4730 },
      'DNK': { latitude: 56.2639, longitude: 9.5018 },
      'DJI': { latitude: 11.8251, longitude: 42.5903 },
      'DMA': { latitude: 15.4150, longitude: -61.3710 },
      'DOM': { latitude: 18.7357, longitude: -70.1627 },
      'ECU': { latitude: -1.8312, longitude: -78.1834 },
      'EGY': { latitude: 26.8206, longitude: 30.8025 },
      'SLV': { latitude: 13.7942, longitude: -88.8965 },
      'GNQ': { latitude: 1.6508, longitude: 10.2679 },
      'ERI': { latitude: 15.1794, longitude: 39.7823 },
      'EST': { latitude: 58.5953, longitude: 25.0136 },
      'SWZ': { latitude: -26.5225, longitude: 31.4659 },
      'ETH': { latitude: 9.1450, longitude: 40.4897 },
      'FJI': { latitude: -16.5782, longitude: 179.4144 },
      'FIN': { latitude: 61.9241, longitude: 25.7482 },
      'FRA': { latitude: 46.2276, longitude: 2.2137 },
      'GAB': { latitude: -0.8037, longitude: 11.6094 },
      'GMB': { latitude: 13.4432, longitude: -15.3101 },
      'GEO': { latitude: 42.3154, longitude: 43.3569 },
      'DEU': { latitude: 51.1657, longitude: 10.4515 },
      'GHA': { latitude: 7.9465, longitude: -1.0232 },
      'GRC': { latitude: 39.0742, longitude: 21.8243 },
      'GRD': { latitude: 12.1165, longitude: -61.6790 },
      'GTM': { latitude: 15.7835, longitude: -90.2308 },
      'GIN': { latitude: 9.9456, longitude: -9.6966 },
      'GNB': { latitude: 11.8037, longitude: -15.1804 },
      'GUY': { latitude: 4.8604, longitude: -58.9302 },
      'HTI': { latitude: 18.9712, longitude: -72.2852 },
      'HND': { latitude: 15.1999, longitude: -86.2419 },
      'HUN': { latitude: 47.1625, longitude: 19.5033 },
      'ISL': { latitude: 64.9631, longitude: -19.0208 },
      'IND': { latitude: 20.5937, longitude: 78.9629 },
      'IDN': { latitude: -0.7893, longitude: 113.9213 },
      'IRN': { latitude: 32.4279, longitude: 53.6880 },
      'IRQ': { latitude: 33.2232, longitude: 43.6793 },
      'IRL': { latitude: 53.1424, longitude: -7.6921 },
      'ISR': { latitude: 31.0461, longitude: 34.8516 },
      'ITA': { latitude: 41.8719, longitude: 12.5674 },
      'JAM': { latitude: 18.1096, longitude: -77.2975 },
      'JPN': { latitude: 36.2048, longitude: 138.2529 },
      'JOR': { latitude: 30.5852, longitude: 36.2384 },
      'KAZ': { latitude: 48.0196, longitude: 66.9237 },
      'KEN': { latitude: -0.0236, longitude: 37.9062 },
      'KIR': { latitude: -3.3704, longitude: -168.7340 },
      'KWT': { latitude: 29.3117, longitude: 47.4818 },
      'KGZ': { latitude: 41.2044, longitude: 74.7661 },
      'LAO': { latitude: 19.8563, longitude: 102.4955 },
      'LVA': { latitude: 56.8796, longitude: 24.6032 },
      'LBN': { latitude: 33.8547, longitude: 35.8623 },
      'LSO': { latitude: -29.6099, longitude: 28.2336 },
      'LBR': { latitude: 6.4281, longitude: -9.4295 },
      'LBY': { latitude: 26.3351, longitude: 17.2283 },
      'LIE': { latitude: 47.1660, longitude: 9.5554 },
      'LTU': { latitude: 55.1694, longitude: 23.8813 },
      'LUX': { latitude: 49.8153, longitude: 6.1296 },
      'MDG': { latitude: -18.7669, longitude: 46.8691 },
      'MWI': { latitude: -13.2543, longitude: 34.3015 },
      'MYS': { latitude: 4.2105, longitude: 101.9758 },
      'MDV': { latitude: 3.2028, longitude: 73.2207 },
      'MLI': { latitude: 17.5707, longitude: -3.9962 },
      'MLT': { latitude: 35.9375, longitude: 14.3754 },
      'MHL': { latitude: 7.1315, longitude: 171.1845 },
      'MRT': { latitude: 21.0079, longitude: -10.9408 },
      'MUS': { latitude: -20.3484, longitude: 57.5522 },
      'MEX': { latitude: 23.6345, longitude: -102.5528 },
      'FSM': { latitude: 7.4256, longitude: 150.5508 },
      'MDA': { latitude: 47.4116, longitude: 28.3699 },
      'MCO': { latitude: 43.7384, longitude: 7.4246 },
      'MNG': { latitude: 46.8625, longitude: 103.8467 },
      'MNE': { latitude: 42.7087, longitude: 19.3744 },
      'MAR': { latitude: 31.7917, longitude: -7.0926 },
      'MOZ': { latitude: -18.6657, longitude: 35.5296 },
      'MMR': { latitude: 21.9162, longitude: 95.9560 },
      'NAM': { latitude: -22.9576, longitude: 18.4904 },
      'NRU': { latitude: -0.5228, longitude: 166.9315 },
      'NPL': { latitude: 28.3949, longitude: 84.1240 },
      'NLD': { latitude: 52.1326, longitude: 5.2913 },
      'NZL': { latitude: -40.9006, longitude: 174.8860 },
      'NIC': { latitude: 12.8654, longitude: -85.2072 },
      'NER': { latitude: 17.6078, longitude: 8.0817 },
      'NGA': { latitude: 9.0820, longitude: 8.6753 },
      'PRK': { latitude: 40.3399, longitude: 127.5101 },
      'MKD': { latitude: 41.6086, longitude: 21.7453 },
      'NOR': { latitude: 60.4720, longitude: 8.4689 },
      'OMN': { latitude: 21.4735, longitude: 55.9754 },
      'PAK': { latitude: 30.3753, longitude: 69.3451 },
      'PLW': { latitude: 7.5150, longitude: 134.5825 },
      'PSE': { latitude: 31.9522, longitude: 35.2332 },
      'PAN': { latitude: 8.5380, longitude: -80.7821 },
      'PNG': { latitude: -6.3150, longitude: 143.9555 },
      'PRY': { latitude: -23.4425, longitude: -58.4438 },
      'PER': { latitude: -9.1900, longitude: -75.0152 },
      'PHL': { latitude: 12.8797, longitude: 121.7740 },
      'POL': { latitude: 51.9194, longitude: 19.1451 },
      'PRT': { latitude: 39.3999, longitude: -8.2245 },
      'QAT': { latitude: 25.3548, longitude: 51.1839 },
      'ROU': { latitude: 45.9432, longitude: 24.9668 },
      'RUS': { latitude: 61.5240, longitude: 105.3188 },
      'RWA': { latitude: -1.9403, longitude: 29.8739 },
      'KNA': { latitude: 17.3578, longitude: -62.7830 },
      'LCA': { latitude: 13.9094, longitude: -60.9789 },
      'VCT': { latitude: 12.9843, longitude: -61.2872 },
      'WSM': { latitude: -13.7590, longitude: -172.1046 },
      'SMR': { latitude: 43.9424, longitude: 12.4578 },
      'STP': { latitude: 0.1864, longitude: 6.6131 },
      'SAU': { latitude: 23.8859, longitude: 45.0792 },
      'SEN': { latitude: 14.7167, longitude: -17.4677 },
      'SRB': { latitude: 44.0165, longitude: 21.0059 },
      'SYC': { latitude: -4.6796, longitude: 55.4920 },
      'SLE': { latitude: 8.4606, longitude: -11.7799 },
      'SGP': { latitude: 1.3521, longitude: 103.8198 },
      'SVK': { latitude: 48.6690, longitude: 19.6990 },
      'SVN': { latitude: 46.1512, longitude: 14.9955 },
      'SLB': { latitude: -9.6457, longitude: 160.1562 },
      'SOM': { latitude: 5.1521, longitude: 46.1996 },
      'ZAF': { latitude: -30.5595, longitude: 22.9375 },
      'KOR': { latitude: 35.9078, longitude: 127.7669 },
      'SSD': { latitude: 6.8770, longitude: 31.3070 },
      'ESP': { latitude: 40.4637, longitude: -3.7492 },
      'LKA': { latitude: 7.8731, longitude: 80.7718 },
      'SDN': { latitude: 12.8628, longitude: 30.2176 },
      'SUR': { latitude: 3.9193, longitude: -56.0278 },
      'SWE': { latitude: 60.1282, longitude: 18.6435 },
      'CHE': { latitude: 46.8182, longitude: 8.2275 },
      'SYR': { latitude: 34.8021, longitude: 38.9968 },
      'TWN': { latitude: 23.5505, longitude: 121.0143 },
      'TJK': { latitude: 38.8610, longitude: 71.2761 },
      'TZA': { latitude: -6.3690, longitude: 34.8888 },
      'THA': { latitude: 15.8700, longitude: 100.9925 },
      'TLS': { latitude: -8.8742, longitude: 125.7275 },
      'TGO': { latitude: 8.6195, longitude: 0.8248 },
      'TON': { latitude: -21.1790, longitude: -175.1982 },
      'TTO': { latitude: 10.6918, longitude: -61.2225 },
      'TUN': { latitude: 33.8869, longitude: 9.5375 },
      'TUR': { latitude: 38.9637, longitude: 35.2433 },
      'TKM': { latitude: 38.9697, longitude: 59.5563 },
      'TUV': { latitude: -7.1095, longitude: 177.6493 },
      'UGA': { latitude: 1.3733, longitude: 32.2903 },
      'UKR': { latitude: 48.3794, longitude: 31.1656 },
      'ARE': { latitude: 23.4241, longitude: 53.8478 },
      'GBR': { latitude: 55.3781, longitude: -3.4360 },
      'USA': { latitude: 37.0902, longitude: -95.7129 },
      'URY': { latitude: -32.5228, longitude: -55.7658 },
      'UZB': { latitude: 41.3775, longitude: 64.5853 },
      'VUT': { latitude: -15.3767, longitude: 166.9592 },
      'VAT': { latitude: 41.9029, longitude: 12.4534 },
      'VEN': { latitude: 6.4238, longitude: -66.5897 },
      'VNM': { latitude: 14.0583, longitude: 108.2772 },
      'YEM': { latitude: 15.5527, longitude: 48.5164 },
      'ZMB': { latitude: -13.1339, longitude: 27.8493 },
      'ZWE': { latitude: -19.0154, longitude: 29.1549 },
      // Add WHO region codes
      'AFR': { latitude: 0, longitude: 20 },
      'AMR': { latitude: 0, longitude: -60 },
      'SEAR': { latitude: 20, longitude: 90 },
      'EUR': { latitude: 50, longitude: 10 },
      'EMR': { latitude: 30, longitude: 50 },
      'WPR': { latitude: 20, longitude: 120 },
      // Add World Bank income groups
      'WB_HI': { latitude: 40, longitude: 0 },
      'WB_UMI': { latitude: 20, longitude: 0 },
      'WB_LMI': { latitude: 0, longitude: 0 },
      'WB_LI': { latitude: -20, longitude: 0 },
      // Global
      'GLOBAL': { latitude: 0, longitude: 0 }
    };

    return countryCoordinates[countryCode];
  };

  const handleIndicatorChange = (event) => {
    setSelectedIndicator(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const onViewportChange = useCallback((newViewport) => {
    setViewport(newViewport)
  }, [])

  const onClick = useCallback((event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      if (feature.properties.cluster) {
        const clusterId = feature.properties.cluster_id;
        const mapboxSource = event.target.getSource('vaccine-data');
        
        // Get the cluster's point count
        const pointCount = feature.properties.point_count;
        
        // Show a temporary popup with cluster information
        setPopupInfo({
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          isCluster: true,
          pointCount: pointCount,
          message: `Click to zoom in and see ${pointCount} countries`
        });

        // Zoom to the cluster after a short delay
        setTimeout(() => {
          mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            
            const maxZoom = 8;
            const targetZoom = Math.min(zoom, maxZoom);
            
            event.target.easeTo({
              center: feature.geometry.coordinates,
              zoom: targetZoom,
              duration: 1000,
              padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
              }
            });
          });
        }, 1000); // Show the popup for 1 second before zooming
      } else {
        // Enhanced country information
        const countryData = feature.properties;
        setPopupInfo({
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          isCluster: false,
          displayName: countryData.name,
          formattedCoverage: countryData.formattedCoverage,
          year: countryData.year,
          vaccine: countryData.vaccine,
          source: countryData.source,
          metadata: countryData.metadata
        });
      }
    }
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden flex items-center justify-center bg-destructive/10">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">Mapbox Token Missing</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please add your Mapbox token to the .env.local file:
          </p>
          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
            NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
          </pre>
          <p className="text-sm text-muted-foreground mt-4">
            Get your token from{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mapbox Access Tokens
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (loading && !vaccineData) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading vaccine coverage data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden flex items-center justify-center bg-destructive/10">
        <div className="text-center">
          <p className="text-destructive font-medium">Error loading vaccine data</p>
          <p className="text-destructive/80 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!vaccineData || !vaccineData.features || vaccineData.features.length === 0) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No vaccine coverage data available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px]">
      <Card className="absolute top-4 left-4 z-10 w-72 shadow-lg bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Vaccine Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label htmlFor="indicator" className="block text-xs font-medium text-muted-foreground mb-1">
              Vaccine Indicator
            </label>
            <select
              id="indicator"
              value={selectedIndicator || ''}
              onChange={handleIndicatorChange}
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={loading}
            >
              {indicators.map(indicator => (
                <option key={indicator.code} value={indicator.code}>
                  {indicator.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-xs font-medium text-muted-foreground mb-1">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={loading}
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Coverage</p>
                <div className="space-y-1">
                  {coverageLegend.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Clusters</p>
                <div className="space-y-1">
                  {clusterLegend.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div 
                        className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold text-black flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      >
                        {index === 0 ? '1' : index === 1 ? '100' : '750+'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading vaccine coverage data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 right-4 z-50">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Error</Badge>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Map
        {...viewport}
        onMove={evt => onViewportChange(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={onClick}
        interactiveLayerIds={['clusters', 'unclustered-point']}
      >
        <NavigationControl position="top-right" />

        {vaccineData && (
          <Source
            id="vaccine-data"
            type="geojson"
            data={vaccineData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="z-50"
            offset={[0, -10]}
          >
            <Card className="w-80">
              <CardContent className="p-4">
                {popupInfo.isCluster ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Cluster of Countries</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {popupInfo.message}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{popupInfo.displayName}</h3>
                      <Badge variant="secondary">{popupInfo.formattedCoverage}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Year: {popupInfo.year}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Vaccine: {popupInfo.vaccine}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Source: {popupInfo.source}</span>
                      </div>

                      {popupInfo.metadata && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Data Type: {popupInfo.metadata.dataType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Value Type: {popupInfo.metadata.valueType}
                          </p>
                          {popupInfo.metadata.parentLocation && (
                            <p className="text-xs text-muted-foreground">
                              Region: {popupInfo.metadata.parentLocation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  )
} 