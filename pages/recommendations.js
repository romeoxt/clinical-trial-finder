import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { AlertTriangle } from 'lucide-react';

export default function Recommendations() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    condition: '',
    age: '',
    gender: '',
    medicalHistory: '',
    currentMedications: '',
    location: '',
    preferences: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, search for relevant trials
      const searchResponse = await fetch(`/api/search?condition=${encodeURIComponent(formData.condition)}&location=${encodeURIComponent(formData.location)}`);
      
      if (!searchResponse.ok) {
        throw new Error('Failed to search for clinical trials');
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.trials || searchData.trials.length === 0) {
        throw new Error('No clinical trials found matching your criteria');
      }

      // Then, get personalized recommendations
      const recommendationsResponse = await fetch('/api/healthbench', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: formData,
          trials: searchData.trials
        }),
      });

      if (!recommendationsResponse.ok) {
        if (recommendationsResponse.status === 404) {
          throw new Error('The HealthBench API service is currently unavailable. Please try again later.');
        }
        throw new Error('Failed to get personalized recommendations');
      }

      const recommendationsData = await recommendationsResponse.json();
      
      // Store the recommendations in localStorage for the results page
      localStorage.setItem('recommendations', JSON.stringify(recommendationsData));
      
      // Navigate to the results page
      router.push('/recommendations/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout 
      title="Personalized Trial Recommendations | Clinical Trial Finder"
      description="Get personalized clinical trial recommendations based on your medical profile"
    >
      <PageHeader
        title="Personalized Trial Recommendations"
        description="Get personalized clinical trial recommendations based on your medical profile, history, and preferences."
        icon={Search}
        iconBgColor="bg-purple-100 dark:bg-purple-900"
        iconColor="text-purple-600 dark:text-purple-400"
      />

      <div className="mx-auto mt-16 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-lg bg-destructive/15 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="text-sm text-destructive">
                  <p className="font-medium">Error</p>
                  <p className="mt-1">{error}</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Check your internet connection</li>
                    <li>Verify your search criteria</li>
                    <li>Try again in a few minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="condition">Medical Condition</Label>
              <Input
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                placeholder="e.g., Type 2 Diabetes"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Describe your relevant medical history"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                placeholder="List your current medications"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                required
              />
            </div>

            <div>
              <Label htmlFor="preferences">Additional Preferences</Label>
              <Textarea
                id="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                placeholder="Any specific preferences or requirements for clinical trials"
                rows={4}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
          </Button>
        </form>
      </div>
    </Layout>
  );
} 