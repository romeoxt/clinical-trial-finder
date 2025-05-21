import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function GeneticAnalysis() {
  const [symptoms, setSymptoms] = useState('')
  const [familyHistory, setFamilyHistory] = useState('')
  const [snps, setSnps] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/genetics-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          familyHistory,
          snps: snps.split(',').map(s => s.trim()).filter(Boolean)
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Genetic Analysis</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Symptoms</label>
          <Textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms..."
            className="w-full"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Family History</label>
          <Textarea
            value={familyHistory}
            onChange={(e) => setFamilyHistory(e.target.value)}
            placeholder="Enter relevant family medical history..."
            className="w-full"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SNPs (comma-separated)</label>
          <Input
            value={snps}
            onChange={(e) => setSnps(e.target.value)}
            placeholder="e.g., rs53576, rs1800497"
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <div className="mt-8">
          <Tabs defaultValue="diagnoses">
            <TabsList>
              <TabsTrigger value="diagnoses">Possible Diagnoses</TabsTrigger>
              <TabsTrigger value="genes">Genes</TabsTrigger>
              <TabsTrigger value="snps">SNPs</TabsTrigger>
              <TabsTrigger value="family">Family History</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnoses">
              <div className="grid gap-4">
                {analysis.possibleDiagnoses.map((diagnosis, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="text-xl font-semibold">{diagnosis.condition}</h3>
                    <p className="text-sm text-muted-foreground">Confidence: {diagnosis.confidence}</p>
                    <p className="mt-2">{diagnosis.description}</p>
                    <div className="mt-4">
                      <h4 className="font-medium">Symptoms:</h4>
                      <ul className="list-disc list-inside">
                        {diagnosis.symptoms.map((symptom, i) => (
                          <li key={i}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="list-disc list-inside">
                        {diagnosis.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    {diagnosis.clinicalTrials.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium">Relevant Clinical Trials:</h4>
                        <ul className="list-disc list-inside">
                          {diagnosis.clinicalTrials.map((trial, i) => (
                            <li key={i}>
                              <a href={trial.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {trial.title}
                              </a>
                              {' '}({trial.status})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="genes">
              <div className="grid gap-4">
                {analysis.genes.map((gene, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="text-xl font-semibold">{gene.name}</h3>
                    <p className="text-sm text-muted-foreground">Relevance: {gene.relevance}</p>
                    <p className="mt-2">{gene.description}</p>
                    {gene.associatedSNPs.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium">Associated SNPs:</h4>
                        <ul className="list-disc list-inside">
                          {gene.associatedSNPs.map((snp, i) => (
                            <li key={i}>{snp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {gene.familyHistoryRelevance && (
                      <div className="mt-4">
                        <h4 className="font-medium">Family History Relevance:</h4>
                        <p>{gene.familyHistoryRelevance}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="snps">
              <div className="grid gap-4">
                {analysis.snps.map((snp, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="text-xl font-semibold">{snp.id}</h3>
                    <p className="text-sm text-muted-foreground">Gene: {snp.gene}</p>
                    <p className="mt-2">{snp.description}</p>
                    <div className="mt-4">
                      <h4 className="font-medium">Clinical Significance:</h4>
                      <p>{snp.clinicalSignificance}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium">Population Frequency:</h4>
                      <p>{snp.populationFrequency}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="family">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Family History Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Risk Factors:</h4>
                    <ul className="list-disc list-inside">
                      {analysis.familyHistoryAnalysis.riskFactors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Preventive Measures:</h4>
                    <ul className="list-disc list-inside">
                      {analysis.familyHistoryAnalysis.preventiveMeasures.map((measure, i) => (
                        <li key={i}>{measure}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Screening Recommendations:</h4>
                    <ul className="list-disc list-inside">
                      {analysis.familyHistoryAnalysis.screeningRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
} 