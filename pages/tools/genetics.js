import React from 'react'
import GeneticAnalysis from '../../components/GeneticAnalysis'
import { Card } from '../../components/ui/card'

export default function GeneticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Symptom-to-Genetics Mapper
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Understand how your symptoms may be related to genetic predispositions. Our tool analyzes your symptoms, family history, and genetic markers to provide personalized insights and recommendations.
          </p>
        </div>

        <div className="mt-16">
          <Card className="p-6">
            <GeneticAnalysis />
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Input Your Information</h3>
              <p className="text-muted-foreground">
                Enter your symptoms, family medical history, and any known genetic markers (SNPs) you'd like to analyze.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your information against medical databases, genetic research, and clinical studies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Get Personalized Insights</h3>
              <p className="text-muted-foreground">
                Receive detailed analysis of possible conditions, genetic factors, and relevant clinical trials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Medical Databases</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>SNPedia - Genetic variant database</li>
                <li>ClinVar - Clinical variant database</li>
                <li>OMIM - Online Mendelian Inheritance in Man</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Research Sources</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>PubMed - Medical research database</li>
                <li>ClinicalTrials.gov - Clinical trial registry</li>
                <li>GWAS Catalog - Genome-wide association studies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Privacy & Security</h2>
          <p className="text-muted-foreground">
            Your genetic and medical information is handled with the utmost care. We use industry-standard encryption and never share your data with third parties without your explicit consent. All analysis is performed securely and confidentially.
          </p>
        </div>
      </main>
    </div>
  )
} 