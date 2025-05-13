import { VACCINE_INDICATORS } from '../../lib/vaccine-indicators';
import fetch from 'node-fetch';

// Map of WHO country codes to ISO-3 codes for Mapbox
const COUNTRY_CODE_MAP = {
  'USA': 'USA',
  'GBR': 'GBR',
  'FRA': 'FRA',
  'DEU': 'DEU',
  'ITA': 'ITA',
  'ESP': 'ESP',
  'PRT': 'PRT',
  'NLD': 'NLD',
  'BEL': 'BEL',
  'CHE': 'CHE',
  'AUT': 'AUT',
  'SWE': 'SWE',
  'NOR': 'NOR',
  'DNK': 'DNK',
  'FIN': 'FIN',
  'ISL': 'ISL',
  'IRL': 'IRL',
  'CAN': 'CAN',
  'MEX': 'MEX',
  'BRA': 'BRA',
  'ARG': 'ARG',
  'CHL': 'CHL',
  'COL': 'COL',
  'PER': 'PER',
  'VEN': 'VEN',
  'ECU': 'ECU',
  'BOL': 'BOL',
  'PRY': 'PRY',
  'URY': 'URY',
  'GUF': 'GUF',
  'GUY': 'GUY',
  'SUR': 'SUR',
  'JPN': 'JPN',
  'KOR': 'KOR',
  'CHN': 'CHN',
  'HKG': 'HKG',
  'TWN': 'TWN',
  'MNG': 'MNG',
  'PRK': 'PRK',
  'VNM': 'VNM',
  'LAO': 'LAO',
  'KHM': 'KHM',
  'THA': 'THA',
  'MMR': 'MMR',
  'BGD': 'BGD',
  'BTN': 'BTN',
  'NPL': 'NPL',
  'PAK': 'PAK',
  'IND': 'IND',
  'LKA': 'LKA',
  'MDV': 'MDV',
  'IDN': 'IDN',
  'MYS': 'MYS',
  'SGP': 'SGP',
  'BRN': 'BRN',
  'PHL': 'PHL',
  'TLS': 'TLS',
  'PNG': 'PNG',
  'AUS': 'AUS',
  'NZL': 'NZL',
  'FJI': 'FJI',
  'VUT': 'VUT',
  'SLB': 'SLB',
  'KIR': 'KIR',
  'TUV': 'TUV',
  'WSM': 'WSM',
  'TON': 'TON',
  'NIU': 'NIU',
  'COK': 'COK',
  'PYF': 'PYF',
  'NCL': 'NCL',
  'RUS': 'RUS',
  'UKR': 'UKR',
  'BLR': 'BLR',
  'POL': 'POL',
  'CZE': 'CZE',
  'SVK': 'SVK',
  'HUN': 'HUN',
  'ROU': 'ROU',
  'BGR': 'BGR',
  'GRC': 'GRC',
  'ALB': 'ALB',
  'MKD': 'MKD',
  'HRV': 'HRV',
  'BIH': 'BIH',
  'SVN': 'SVN',
  'SRB': 'SRB',
  'MNE': 'MNE',
  'KOS': 'KOS',
  'MDA': 'MDA',
  'GEO': 'GEO',
  'ARM': 'ARM',
  'AZE': 'AZE',
  'TUR': 'TUR',
  'CYP': 'CYP',
  'MLT': 'MLT',
  'ISR': 'ISR',
  'LBN': 'LBN',
  'SYR': 'SYR',
  'JOR': 'JOR',
  'IRQ': 'IRQ',
  'KWT': 'KWT',
  'BHR': 'BHR',
  'QAT': 'QAT',
  'ARE': 'ARE',
  'OMN': 'OMN',
  'YEM': 'YEM',
  'SAU': 'SAU',
  'EGY': 'EGY',
  'LBY': 'LBY',
  'TUN': 'TUN',
  'DZA': 'DZA',
  'MAR': 'MAR',
  'ESH': 'ESH',
  'MRT': 'MRT',
  'MLI': 'MLI',
  'NER': 'NER',
  'TCD': 'TCD',
  'SDN': 'SDN',
  'ERI': 'ERI',
  'DJI': 'DJI',
  'SOM': 'SOM',
  'ETH': 'ETH',
  'KEN': 'KEN',
  'UGA': 'UGA',
  'RWA': 'RWA',
  'BDI': 'BDI',
  'TZA': 'TZA',
  'MOZ': 'MOZ',
  'ZWE': 'ZWE',
  'ZMB': 'ZMB',
  'MWI': 'MWI',
  'AGO': 'AGO',
  'NAM': 'NAM',
  'BWA': 'BWA',
  'ZAF': 'ZAF',
  'LSO': 'LSO',
  'SWZ': 'SWZ',
  'MDG': 'MDG',
  'COM': 'COM',
  'MUS': 'MUS',
  'SYC': 'SYC',
  'CPV': 'CPV',
  'STP': 'STP',
  'GNQ': 'GNQ',
  'GAB': 'GAB',
  'CMR': 'CMR',
  'CAF': 'CAF',
  'COG': 'COG',
  'COD': 'COD',
  'GIN': 'GIN',
  'GNB': 'GNB',
  'SLE': 'SLE',
  'LBR': 'LBR',
  'CIV': 'CIV',
  'GHA': 'GHA',
  'TGO': 'TGO',
  'BEN': 'BEN',
  'NGA': 'NGA',
  'GMB': 'GMB',
  'SEN': 'SEN',
  'BFA': 'BFA',
  'SSD': 'SSD'
};

export default async function handler(req, res) {
  const { vaccine, year } = req.query;

  if (!vaccine || !year) {
    return res.status(400).json({ message: 'Vaccine and year are required' });
  }

  // Validate vaccine type
  const vaccineInfo = VACCINE_INDICATORS[vaccine];
  if (!vaccineInfo) {
    return res.status(400).json({ message: 'Invalid vaccine selected' });
  }

  try {
    // Make request to WHO API with properly encoded URL
    const encodedCode = encodeURIComponent(vaccineInfo.code);
    const encodedFilter = encodeURIComponent(`TimeDim eq ${year}`);
    const url = `https://ghoapi.azureedge.net/api/${encodedCode}?$filter=${encodedFilter}`;
    console.log('Making request to WHO API:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WHO API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        response: errorText
      });
      throw new Error(`WHO API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('WHO API Response:', JSON.stringify(data, null, 2));

    // Filter and transform the data
    const filteredData = data.value.filter(item => {
      const isCountry = item.SpatialDimType === 'COUNTRY';
      const hasCountryCode = COUNTRY_CODE_MAP[item.SpatialDim];
      console.log(`Country ${item.SpatialDim}: isCountry=${isCountry}, hasCountryCode=${hasCountryCode}`);
      return isCountry && hasCountryCode;
    });

    console.log('Filtered data:', JSON.stringify(filteredData, null, 2));

    // Transform the data into GeoJSON format for Mapbox
    const geojson = {
      type: 'FeatureCollection',
      features: filteredData.map(item => ({
        type: 'Feature',
        properties: {
          country: item.SpatialDim,
          countryCode: COUNTRY_CODE_MAP[item.SpatialDim],
          coverage: item.NumericValue,
          cases: item.Value,
          year: item.TimeDim,
          vaccine: vaccine,
          indicator: vaccineInfo.code,
          targetDisease: vaccineInfo.targetDisease
        },
        geometry: {
          type: 'Point',
          coordinates: [0, 0] // We'll use the country code for styling
        }
      }))
    };

    console.log('Transformed GeoJSON:', JSON.stringify(geojson, null, 2));
    res.status(200).json(geojson);
  } catch (error) {
    console.error('Error fetching vaccine coverage:', error);
    res.status(500).json({ 
      message: 'Error fetching vaccine coverage',
      error: error.message 
    });
  }
} 