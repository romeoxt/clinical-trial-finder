import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, FileText, AlertCircle, AlertTriangle } from 'lucide-react';

export default function Recommendations() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [formData, setFormData] = useState({
    condition: '',
    age: '',
    gender: '',
    medicalHistory: '',
    currentMedications: '',
    location: '',
    preferences: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, search for relevant trials
      const searchResponse = await fetch(`/api/search?condition=${encodeURIComponent(formData.condition)}&location=${encodeURIComponent(formData.location)}`);
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch clinical trials. Please try again later.');
      }
      
      const { studies } = await searchResponse.json();

      if (!studies || studies.length === 0) {
        throw new Error('No clinical trials found matching your criteria. Please try adjusting your search parameters.');
      }

      // Then, get personalized recommendations using HealthBench
      const recommendationsResponse = await fetch('/api/healthbench', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: formData,
          trials: studies
        })
      });

      if (!recommendationsResponse.ok) {
        const errorData = await recommendationsResponse.json().catch(() => ({}));
        if (recommendationsResponse.status === 500) {
          throw new Error('The recommendation service encountered an error. Please try again later.');
        } else if (recommendationsResponse.status === 404) {
          throw new Error('The recommendation service is currently unavailable. Please try again later.');
        } else {
          throw new Error(errorData.message || 'Failed to get personalized recommendations. Please try again later.');
        }
      }
      
      const recommendationsData = await recommendationsResponse.json();
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Personalized Trial Recommendations | Clinical Trial Finder</title>
        <meta name="description" content="Get personalized clinical trial recommendations based on your medical profile" />
      </Head>

      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Personalized Trial Recommendations
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get personalized clinical trial recommendations based on your medical profile, history, and preferences.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Medical Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Medical Condition</label>
                  <Input
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    placeholder="e.g., Type 2 Diabetes"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <Input
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      placeholder="Your gender"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Medical History</label>
                  <Textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Describe your medical history, including any relevant conditions or treatments"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Current Medications</label>
                  <Textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="List your current medications"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Additional Preferences</label>
                  <Textarea
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleInputChange}
                    placeholder="Any specific preferences or requirements for clinical trials"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Get Personalized Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-start text-red-600">
                    <AlertTriangle className="mr-2 h-5 w-5 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Unable to Get Recommendations</h3>
                      <p className="text-sm">{error}</p>
                      <div className="text-sm mt-2">
                        Please try:
                        <ul className="list-disc list-inside mt-1">
                          <li>Checking your internet connection</li>
                          <li>Adjusting your search criteria</li>
                          <li>Refreshing the page</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="trials">Recommended Trials</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Overall Match Score</span>
                          <span className="text-2xl font-bold text-primary">
                            {recommendations.overall_score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {recommendations.summary}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="trials">
                      <div className="space-y-4">
                        {recommendations.recommended_trials.map((trial, index) => (
                          <Card key={trial.NCTId} className="border-l-4 border-primary">
                            <CardContent className="pt-6">
                              <h3 className="font-semibold mb-2">{trial.BriefTitle}</h3>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">
                                  Match Score: {trial.match_score.toFixed(1)}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/trials/${trial.NCTId}`)}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {trial.match_reason}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="analysis">
                      <div className="space-y-4">
                        {Object.entries(recommendations.evaluations).map(([category, data]) => (
                          <div key={category} className="border-b pb-4 last:border-0">
                            <h3 className="font-semibold capitalize mb-2">
                              {category.replace(/_/g, ' ')}
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-muted-foreground">Score</span>
                              <span className="font-semibold">{data.score.toFixed(1)}</span>
                            </div>
                            {data.recommendations.length > 0 && (
                              <div className="mt-2">
                                <h4 className="text-sm font-semibold mb-1">Recommendations</h4>
                                <ul className="text-sm text-muted-foreground list-disc list-inside">
                                  {data.recommendations.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 