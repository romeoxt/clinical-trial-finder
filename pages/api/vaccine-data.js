import fetch from 'node-fetch';

// Add retry logic with shorter timeout
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 5000, // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      // Shorter wait times between retries
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 3000)));
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { indicator, year = 'latest' } = req.query;

  try {
    // If no indicator is specified, return the list of available indicators
    if (!indicator) {
      console.log('Fetching indicators from WHO API...');
      const response = await fetchWithRetry('https://ghoapi.azureedge.net/api/Indicator');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Found ${data.value.length} indicators`);

      // Filter for vaccine-related indicators
      const vaccineIndicators = data.value
        .filter(ind => ind.IndicatorCode.startsWith('MCV') || 
                       ind.IndicatorCode.startsWith('DTP') ||
                       ind.IndicatorCode.startsWith('POL') ||
                       ind.IndicatorCode.startsWith('HEP') ||
                       ind.IndicatorCode.startsWith('ROT'))
        .map(ind => ({
          code: ind.IndicatorCode,
          name: ind.IndicatorName,
          description: ind.IndicatorDescription
        }));

      console.log(`Returning ${vaccineIndicators.length} filtered indicators`);
      return res.status(200).json({ indicators: vaccineIndicators });
    }

    // For specific indicator requests
    console.log('Selected indicator:', indicator);

    // Construct the filter based on the year parameter
    let timeFilter;
    if (year === 'latest') {
      timeFilter = 'TimeDim le 2023';
    } else {
      timeFilter = `TimeDim eq ${year}`;
    }

    // Fetch data for the specific indicator with filters
    const dataUrl = `https://ghoapi.azureedge.net/api/${indicator}?$filter=${encodeURIComponent(timeFilter)}`;
    console.log('Fetching data from:', dataUrl);
    
    const dataResponse = await fetchWithRetry(dataUrl);
    const data = await dataResponse.json();

    if (!data.value || !Array.isArray(data.value) || data.value.length === 0) {
      return res.status(404).json({
        message: 'No data available for the specified indicator and time period',
        indicator,
        timeFilter
      });
    }

    // Process the data into GeoJSON format
    const geoJsonData = {
      type: 'FeatureCollection',
      features: data.value
        .filter(item => {
          const value = item.Value !== null ? parseFloat(item.Value) : null;
          return !isNaN(value) && item.SpatialDim && item.TimeDim;
        })
        .map(item => ({
          type: 'Feature',
          properties: {
            name: item.SpatialDim,
            coverage: parseFloat(item.Value),
            year: item.TimeDim,
            vaccine: indicator,
            source: item.DataSource || 'WHO',
            metadata: {
              dataType: item.DataType,
              valueType: item.ValueType,
              parentLocation: item.ParentLocation
            }
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          }
        }))
    };

    if (geoJsonData.features.length === 0) {
      return res.status(404).json({
        message: 'No valid data points found after processing',
        indicator,
        timeFilter
      });
    }

    return res.status(200).json(geoJsonData);

  } catch (error) {
    console.error('Error in vaccine-data API:', error);
    res.status(500).json({ 
      message: 'Error fetching vaccine data from WHO API',
      error: error.message,
      details: {
        indicator,
        year,
        errorType: error.name,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
} 