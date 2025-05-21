import React from 'react'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import { Info } from 'lucide-react'

export default function About() {
  return (
    <Layout
      title="About Clinical Trial Finder"
      description="Learn about our mission to accelerate medical research and improve patient outcomes"
    >
      <PageHeader
        title="About Clinical Trial Finder"
        description="Clinical Trial Finder is a comprehensive platform designed to help patients, researchers, and healthcare professionals discover and participate in clinical trials. Our mission is to accelerate medical research and improve patient outcomes by making clinical trial information more accessible."
        icon={Info}
        iconBgColor="bg-blue-100 dark:bg-blue-900"
        iconColor="text-blue-600 dark:text-blue-400"
      />

      <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
          Our Tools
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Clinical Trials Search</h3>
            <p className="text-muted-foreground mb-4">
              Find and filter clinical trials based on condition, location, and eligibility criteria.
            </p>
            <Button asChild>
              <Link href="/trials">Search Trials</Link>
            </Button>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Vaccine Information</h3>
            <p className="text-muted-foreground mb-4">
              Access comprehensive information about vaccines, their development, and clinical trial results.
            </p>
            <Button asChild>
              <Link href="/vaccines">View Vaccines</Link>
            </Button>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Disease Outbreaks</h3>
            <p className="text-muted-foreground mb-4">
              Track and monitor disease outbreaks worldwide with real-time data and analysis.
            </p>
            <Button asChild>
              <Link href="/outbreaks">Monitor Outbreaks</Link>
            </Button>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Personal Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Manage your saved trials, track applications, and receive personalized updates.
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 