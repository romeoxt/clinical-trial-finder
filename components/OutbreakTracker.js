import { useState } from 'react';
import { MapPin, Calendar, AlertTriangle, Syringe, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const OutbreakMap = dynamic(() => import('./OutbreakMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  )
});

const DISEASE_OPTIONS = [
  { value: 'measles', label: 'Measles', color: 'red' },
  { value: 'yellowfever', label: 'Yellow Fever', color: 'yellow' },
  { value: 'polio', label: 'Polio', color: 'blue' },
  { value: 'dengue', label: 'Dengue', color: 'orange' },
  { value: 'ebola', label: 'Ebola', color: 'purple' },
  { value: 'cholera', label: 'Cholera', color: 'green' },
  { value: 'covid19', label: 'COVID-19', color: 'pink' }
];

const TIME_PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
];

const SEVERITY_OPTIONS = [
  { value: 'all', label: 'All Severities' },
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low' }
];

export default function OutbreakTracker() {
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('30');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [showVaccineOverlay, setShowVaccineOverlay] = useState(false);
  const [showTrialsOverlay, setShowTrialsOverlay] = useState(false);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Disease Selection */}
        <div className="space-y-2">
          <Label htmlFor="disease">Disease</Label>
          <Select
            id="disease"
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
          >
            <option value="">Select a disease</option>
            {DISEASE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Time Period */}
        <div className="space-y-2">
          <Label htmlFor="timePeriod">Time Period</Label>
          <Select
            id="timePeriod"
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
          >
            {TIME_PERIODS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <Select
            id="severity"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            {SEVERITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Overlay Controls */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="vaccineOverlay"
              checked={showVaccineOverlay}
              onClick={() => setShowVaccineOverlay(!showVaccineOverlay)}
              data-state={showVaccineOverlay ? 'checked' : 'unchecked'}
            />
            <Label htmlFor="vaccineOverlay">Show Vaccine Coverage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="trialsOverlay"
              checked={showTrialsOverlay}
              onClick={() => setShowTrialsOverlay(!showTrialsOverlay)}
              data-state={showTrialsOverlay ? 'checked' : 'unchecked'}
            />
            <Label htmlFor="trialsOverlay">Show Clinical Trials</Label>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        {selectedDisease ? (
          <OutbreakMap
            disease={selectedDisease}
            timePeriod={selectedTimePeriod}
            severity={selectedSeverity}
            showVaccineOverlay={showVaccineOverlay}
            showTrialsOverlay={showTrialsOverlay}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Select a disease to view outbreak data</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm">High Severity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-sm">Moderate Severity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="text-sm">Low Severity</span>
        </div>
        {showVaccineOverlay && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500 opacity-20"></div>
              <span className="text-sm">High Coverage (≥90%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-amber-500 opacity-20"></div>
              <span className="text-sm">Medium Coverage (70-89%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500 opacity-20"></div>
              <span className="text-sm">Low Coverage (&lt;70%)</span>
            </div>
          </>
        )}
        {showTrialsOverlay && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Clinical Trial</span>
          </div>
        )}
      </div>
    </div>
  );
} 