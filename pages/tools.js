import React from 'react'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import { Dna, Stethoscope, Brain } from 'lucide-react'

export default function Tools() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Healthcare Tools
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explore our suite of healthcare tools designed to help you better understand your health, genetic predispositions, and find relevant clinical trials.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <Dna className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Symptom-to-Genetics Mapper</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Understand how your symptoms may be related to genetic predispositions. Learn about SNPs, genes, and traits using data from public databases.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/tools/genetics">Explore Genetics</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Diagnostic Assistant</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Get guidance on sample collection and analysis. Our tool helps you understand diagnostic protocols and procedures.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/tools/diagnostics">Try Diagnostics</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Genetic Literacy Quiz</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Test your knowledge of genetics, clinical trials, and healthcare research. Learn through interactive quizzes and real case studies.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/tools/quiz">Start Learning</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                  <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Clinical Trials Match</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Find clinical trials that match your genetic profile and symptoms. Our tool helps you discover relevant research opportunities.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/trials">Find Trials</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 