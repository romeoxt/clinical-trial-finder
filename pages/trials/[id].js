import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Users, FileText, AlertCircle, CheckCircle2, Clock, ArrowLeft, Printer } from 'lucide-react';

export default function TrialDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrialData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/trials/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trial data');
        }

        const data = await response.json();
        setTrial(data);
      } catch (err) {
        console.error('Error fetching trial data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialData();
  }, [id]);

  const handleApply = () => {
    // TODO: Implement application process
    alert('Application process coming soon!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">Trial Not Found</h2>
          <p className="text-yellow-600">The requested clinical trial could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
        <h1 className="text-3xl font-bold mb-2">{trial.BriefTitle}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>NCT ID: {trial.NCTId}</span>
          <span>Status: {trial.OverallStatus}</span>
          {trial.Phase && <span>Phase: {trial.Phase}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{trial.BriefSummary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Condition</h3>
                  <p className="text-muted-foreground">{trial.Condition}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Study Type</h3>
                  <p className="text-muted-foreground">{trial.StudyType}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Start Date</h3>
                  <p className="text-muted-foreground">
                    {trial.StartDate ? new Date(trial.StartDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Completion Date</h3>
                  <p className="text-muted-foreground">
                    {trial.CompletionDate ? new Date(trial.CompletionDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Study Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Brief Summary</h3>
                      <p className="text-muted-foreground">{trial.BriefSummary}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Detailed Description</h3>
                      <p className="text-muted-foreground">{trial.DetailedDescription || 'Not available'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="eligibility">
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Inclusion Criteria</h3>
                      <p className="text-muted-foreground">{trial.EligibilityCriteria || 'Not available'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="locations">
              <Card>
                <CardHeader>
                  <CardTitle>Study Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trial.Locations && trial.Locations.length > 0 ? (
                      trial.Locations.map((location, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <h3 className="font-semibold">{location.Facility}</h3>
                          <p className="text-muted-foreground">{location.City}, {location.Country}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No locations available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trial.ContactInfo ? (
                      <>
                        <div>
                          <h3 className="font-semibold mb-2">Primary Contact</h3>
                          <p className="text-muted-foreground">{trial.ContactInfo.Name}</p>
                          <p className="text-muted-foreground">{trial.ContactInfo.Email}</p>
                          <p className="text-muted-foreground">{trial.ContactInfo.Phone}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Contact information not available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={handleApply}
                  className="w-full"
                >
                  Apply for This Trial
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Details
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/recommendations')}
                >
                  Get Personalized Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 