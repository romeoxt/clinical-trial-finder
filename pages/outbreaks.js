import Head from 'next/head';
import OutbreakTracker from '../components/OutbreakTracker';
import Navbar from '../components/Navbar';
import { AlertTriangle, Info } from 'lucide-react';

export default function OutbreaksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Disease Outbreak Tracker | Clinical Trial Finder</title>
        <meta name="description" content="Track disease outbreaks worldwide and their relationship to vaccine coverage and clinical trials." />
      </Head>

      <Navbar />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Disease Outbreak Tracker
            </h1>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-lg leading-8 text-muted-foreground">
              Monitor disease outbreaks worldwide and their relationship to vaccine coverage and clinical trials.
              Select a disease, time period, and severity level to view outbreak data.
            </p>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">How to use this tool:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Select a disease from the dropdown menu</li>
                    <li>Choose a time period to view recent outbreaks</li>
                    <li>Filter by severity level to focus on specific cases</li>
                    <li>Toggle overlays to see vaccine coverage and clinical trials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto mt-12 max-w-7xl">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <OutbreakTracker />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mx-auto mt-8 max-w-7xl">
          <p className="text-sm text-muted-foreground text-center">
            Data is updated daily from WHO, CDC, and other global health organizations.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
} 