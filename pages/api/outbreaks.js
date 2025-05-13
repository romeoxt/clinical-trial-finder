import fetch from 'node-fetch';

// Function to fetch available indicators from WHO API
async function fetchWHOIndicators() {
  try {
    const response = await fetch('https://ghoapi.azureedge.net/api/Indicator');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching WHO indicators:', error);
    return [];
  }
}

// Map of disease codes to WHO GHO indicators
let DISEASE_INDICATORS = {
  'measles': 'WHS4_543', // Measles cases
  'yellowfever': 'WHS4_544', // Yellow fever cases
  'polio': 'WHS4_545', // Polio cases
  'dengue': 'WHS8_110', // Dengue cases
  'ebola': 'WHS9_86', // Ebola cases
  'cholera': 'WHS10_93', // Cholera cases
  'covid19': 'WHS11_95' // COVID-19 cases
};

// Helper function to fetch data with retry
async function fetchWithRetry(url, retries = 3) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 404) {
        throw new Error('Disease data not available from WHO API');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Don't retry on 404 errors
      if (error.message.includes('not available')) {
        throw error;
      }
      
      if (i < retries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { disease, timePeriod, severity, refresh } = req.query;

  // If refresh is requested, fetch latest indicators
  if (refresh === 'true') {
    try {
      const indicators = await fetchWHOIndicators();
      console.log('Available WHO indicators:', indicators);
      
      // Update disease indicators based on available indicators
      const updatedIndicators = {};
      indicators.forEach(indicator => {
        if (indicator.IndicatorCode && indicator.IndicatorName) {
          // Map indicator names to our disease codes
          const diseaseName = indicator.IndicatorName.toLowerCase();
          if (diseaseName.includes('measles')) {
            updatedIndicators['measles'] = indicator.IndicatorCode;
          } else if (diseaseName.includes('yellow fever')) {
            updatedIndicators['yellowfever'] = indicator.IndicatorCode;
          } else if (diseaseName.includes('polio')) {
            updatedIndicators['polio'] = indicator.IndicatorCode;
          } else if (diseaseName.includes('dengue')) {
            updatedIndicators['dengue'] = indicator.IndicatorCode;
          } else if (diseaseName.includes('ebola')) {
            updatedIndicators['ebola'] = indicator.IndicatorCode;
          } else if (diseaseName.includes('cholera')) {
            updatedIndicators['cholera'] = indicator.IndicatorCode;
          } else if (diseaseName.includes('covid')) {
            updatedIndicators['covid19'] = indicator.IndicatorCode;
          }
        }
      });

      if (Object.keys(updatedIndicators).length > 0) {
        DISEASE_INDICATORS = updatedIndicators;
        console.log('Updated disease indicators:', DISEASE_INDICATORS);
      }

      // If no disease specified, return available indicators
      if (!disease) {
        return res.status(200).json({
          message: 'Available disease indicators',
          indicators: DISEASE_INDICATORS,
          allIndicators: indicators
        });
      }
    } catch (error) {
      console.error('Error refreshing indicators:', error);
      // Continue with existing indicators if refresh fails
    }
  }

  if (!disease) {
    return res.status(400).json({ 
      message: 'Disease type is required',
      availableDiseases: Object.keys(DISEASE_INDICATORS)
    });
  }

  try {
    const indicator = DISEASE_INDICATORS[disease];
    if (!indicator) {
      return res.status(400).json({ 
        message: 'Invalid disease type',
        availableDiseases: Object.keys(DISEASE_INDICATORS)
      });
    }

    // Calculate date range based on timePeriod
    const now = new Date();
    let startDate;
    switch (timePeriod) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30)); // Default to 30 days
    }

    // Format dates for WHO API (YYYY-MM-DD)
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = new Date().toISOString().split('T')[0];

    // Fetch data from WHO API with proper date format
    const url = `https://ghoapi.azureedge.net/api/${indicator}?$filter=TimeDim ge datetime'${startDateStr}' and TimeDim le datetime'${endDateStr}'`;
    console.log('Fetching outbreak data from:', url);

    const data = await fetchWithRetry(url);
    console.log('Received data:', JSON.stringify(data, null, 2));

    if (!data.value || !Array.isArray(data.value)) {
      throw new Error('Invalid response format from WHO API');
    }

    // Process and format the data
    const outbreaks = data.value
      .filter(item => item.SpatialDimType === 'COUNTRY' && item.Value !== null)
      .map(item => {
        const cases = parseInt(item.Value);
        let severityLevel;
        if (cases >= 1000) severityLevel = 'high';
        else if (cases >= 100) severityLevel = 'moderate';
        else severityLevel = 'low';

        // Filter by severity if specified
        if (severity && severity !== 'all' && severityLevel !== severity) {
          return null;
        }

        return {
          id: `${item.SpatialDim}-${disease}-${item.TimeDim}`,
          disease: disease,
          country: item.SpatialDim,
          cases: cases,
          severity: severityLevel,
          lastUpdated: item.TimeDim,
          coordinates: getCountryCoordinates(item.SpatialDim),
          status: 'active',
          recommendations: generateRecommendations(disease, severityLevel)
        };
      })
      .filter(Boolean);

    if (outbreaks.length === 0) {
      return res.status(404).json({
        message: 'No outbreak data available for the specified criteria',
        details: {
          disease,
          timePeriod,
          severity,
          dateRange: {
            start: startDateStr,
            end: endDateStr
          }
        }
      });
    }

    // Convert to GeoJSON format
    const geoJson = {
      type: 'FeatureCollection',
      features: outbreaks.map(outbreak => ({
        type: 'Feature',
        properties: {
          id: outbreak.id,
          disease: outbreak.disease,
          country: outbreak.country,
          cases: outbreak.cases,
          severity: outbreak.severity,
          lastUpdated: outbreak.lastUpdated,
          status: outbreak.status,
          recommendations: outbreak.recommendations
        },
        geometry: {
          type: 'Point',
          coordinates: outbreak.coordinates
        }
      }))
    };

    res.status(200).json(geoJson);
  } catch (error) {
    console.error('Error fetching outbreak data:', error);
    
    // Handle specific error cases
    if (error.message.includes('not available')) {
      return res.status(404).json({
        message: 'Disease data not available from WHO API',
        details: {
          disease,
          timePeriod,
          severity,
          availableDiseases: Object.keys(DISEASE_INDICATORS)
        }
      });
    }

    res.status(500).json({ 
      message: 'Error fetching outbreak data',
      error: error.message,
      details: {
        disease,
        timePeriod,
        severity,
        errorType: error.name,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}

// Helper function to get country coordinates
function getCountryCoordinates(country) {
  // This should be replaced with a proper geocoding service or database
  const coordinates = {
    'USA': [-98.5795, 39.8283],
    'BRA': [-51.9253, -14.2350],
    'IND': [78.9629, 20.5937],
    'NGA': [8.6753, 9.0820],
    'ZAF': [22.9375, -30.5595],
    'KEN': [37.9062, -0.0236],
    'IDN': [113.9213, -0.7893],
    'PHL': [121.7740, 12.8797]
  };
  return coordinates[country] || [0, 0];
}

// Helper function to generate recommendations based on disease and severity
function generateRecommendations(disease, severity) {
  const baseRecommendations = {
    high: [
      'Implement immediate containment measures',
      'Increase surveillance and testing',
      'Mobilize emergency response teams',
      'Consider travel restrictions',
      'Enhance healthcare capacity'
    ],
    moderate: [
      'Enhance monitoring and reporting',
      'Strengthen healthcare capacity',
      'Implement preventive measures',
      'Increase public awareness',
      'Prepare response plans'
    ],
    low: [
      'Maintain routine surveillance',
      'Continue standard prevention protocols',
      'Monitor for any changes in situation',
      'Review and update response plans',
      'Ensure adequate supplies'
    ]
  };

  const diseaseSpecificRecommendations = {
    measles: [
      'Ensure high vaccination coverage',
      'Implement catch-up vaccination programs',
      'Strengthen routine immunization'
    ],
    yellowfever: [
      'Implement vector control measures',
      'Ensure vaccination of travelers',
      'Monitor mosquito populations'
    ],
    polio: [
      'Maintain high vaccination coverage',
      'Implement supplementary immunization activities',
      'Enhance environmental surveillance'
    ],
    dengue: [
      'Implement vector control measures',
      'Remove standing water sources',
      'Use mosquito repellents'
    ],
    ebola: [
      'Implement strict infection control measures',
      'Establish isolation facilities',
      'Train healthcare workers'
    ],
    cholera: [
      'Ensure access to clean water',
      'Improve sanitation facilities',
      'Implement food safety measures'
    ],
    covid19: [
      'Promote vaccination',
      'Implement social distancing measures',
      'Enhance testing and contact tracing'
    ]
  };

  return [
    ...baseRecommendations[severity],
    ...(diseaseSpecificRecommendations[disease] || [])
  ];
} 