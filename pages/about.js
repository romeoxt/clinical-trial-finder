import React from 'react'
import { Button } from '../components/ui/button'
import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            About Clinical Trial Finder
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Clinical Trial Finder is a comprehensive platform designed to help patients, researchers, and healthcare professionals discover and participate in clinical trials. Our mission is to accelerate medical research and improve patient outcomes by making clinical trial information more accessible.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Our Tools
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">Clinical Trials Search</h3>
              <p className="mt-2 text-muted-foreground">
                Find and filter clinical trials based on condition, location, and eligibility criteria.
              </p>
              <Button asChild className="mt-4">
                <Link href="/trials">Search Trials</Link>
              </Button>
            </div>
            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">Vaccine Information</h3>
              <p className="mt-2 text-muted-foreground">
                Access comprehensive information about vaccines, their development, and clinical trial results.
              </p>
              <Button asChild className="mt-4">
                <Link href="/vaccines">View Vaccines</Link>
              </Button>
            </div>
            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">Disease Outbreaks</h3>
              <p className="mt-2 text-muted-foreground">
                Track and monitor disease outbreaks worldwide with real-time data and analysis.
              </p>
              <Button asChild className="mt-4">
                <Link href="/outbreaks">Monitor Outbreaks</Link>
              </Button>
            </div>
            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">Personal Dashboard</h3>
              <p className="mt-2 text-muted-foreground">
                Manage your saved trials, track applications, and receive personalized updates.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 