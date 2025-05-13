import { useState, useEffect } from 'react';
import { VACCINE_INDICATORS, VACCINE_DISPLAY_NAMES } from '../lib/vaccine-indicators';
import styles from '../styles/ControlPanel.module.css';

// Generate years from 2000 to current year
const YEARS = Array.from(
  { length: new Date().getFullYear() - 1999 },
  (_, i) => new Date().getFullYear() - i
);

const ControlPanel = ({
  onVaccineSelect,
  onYearSelect,
  selectedVaccine,
  selectedYear,
  loading,
  error
}) => {
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState(null);

  useEffect(() => {
    if (selectedVaccine) {
      const info = VACCINE_INDICATORS[selectedVaccine];
      setSelectedVaccineInfo(info);
    } else {
      setSelectedVaccineInfo(null);
    }
  }, [selectedVaccine]);

  return (
    <div className={styles.controlPanel}>
      <div className={styles.section}>
        <h2>Select Vaccine</h2>
        <select
          value={selectedVaccine || ''}
          onChange={(e) => onVaccineSelect(e.target.value)}
          className={styles.select}
          disabled={loading}
        >
          <option value="">Choose a vaccine...</option>
          {Object.entries(VACCINE_INDICATORS).map(([id, info]) => (
            <option key={id} value={id}>
              {VACCINE_DISPLAY_NAMES[id] || info.name}
            </option>
          ))}
        </select>
      </div>

      {selectedVaccine && (
        <div className={styles.section}>
          <h2>Select Year</h2>
          <select
            value={selectedYear || ''}
            onChange={(e) => onYearSelect(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            <option value="">Choose a year...</option>
            {YEARS.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedVaccineInfo && (
        <div className={styles.section}>
          <h2>Vaccine Information</h2>
          <div className={styles.info}>
            <h3>{VACCINE_DISPLAY_NAMES[selectedVaccine] || selectedVaccineInfo.name}</h3>
            <p>Coverage data for {selectedVaccineInfo.targetDisease}</p>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          Loading data...
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 