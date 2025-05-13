import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Dashboard.module.css';

// Dynamically import the map component to avoid SSR issues with Mapbox
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading map...</div>
});

const ControlPanel = dynamic(() => import('../components/ControlPanel'), {
  ssr: false
});

export default function Dashboard() {
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [coverageData, setCoverageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVaccineSelect = async (vaccine) => {
    setSelectedVaccine(vaccine);
    setSelectedYear(null);
    setCoverageData(null);
  };

  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/coverage?vaccine=${selectedVaccine}&year=${year}`);
      if (!response.ok) throw new Error('Failed to fetch coverage data');
      const data = await response.json();
      setCoverageData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Global Vaccine Coverage Dashboard</h1>
      </header>
      
      <main className={styles.main}>
        <div className={styles.mapContainer}>
          <Map 
            coverageData={coverageData}
            loading={loading}
          />
        </div>
        
        <div className={styles.controlPanel}>
          <ControlPanel
            onVaccineSelect={handleVaccineSelect}
            onYearSelect={handleYearSelect}
            selectedVaccine={selectedVaccine}
            selectedYear={selectedYear}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
} 