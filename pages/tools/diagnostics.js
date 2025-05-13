import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Stethoscope, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export default function DiagnosticAssistant() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTest, setSelectedTest] = useState(null)

  const diagnosticTests = [
    {
      id: 'blood',
      name: 'Blood Test',
      description: 'Complete blood count and basic metabolic panel',
      steps: [
        {
          title: 'Preparation',
          instructions: [
            'Fast for 8-12 hours before the test',
            'Stay hydrated with water',
            'Avoid strenuous exercise 24 hours before',
            'Inform about any medications'
          ]
        },
        {
          title: 'Collection',
          instructions: [
            'Clean the venipuncture site with antiseptic',
            'Apply tourniquet 3-4 inches above the site',
            'Insert needle at 15-30 degree angle',
            'Collect required volume in appropriate tubes'
          ]
        },
        {
          title: 'Post-Collection',
          instructions: [
            'Apply pressure to the site for 3-5 minutes',
            'Keep bandage on for at least 15 minutes',
            'Avoid heavy lifting with the arm',
            'Monitor for any unusual bruising or swelling'
          ]
        }
      ]
    },
    {
      id: 'urine',
      name: 'Urine Analysis',
      description: 'Basic urinalysis and culture',
      steps: [
        {
          title: 'Preparation',
          instructions: [
            'Clean the genital area',
            'Collect mid-stream urine',
            'Use sterile container provided',
            'Avoid touching inside of container'
          ]
        },
        {
          title: 'Collection',
          instructions: [
            'Start urinating into toilet',
            'Collect mid-stream sample',
            'Fill container to marked line',
            'Secure lid tightly'
          ]
        },
        {
          title: 'Post-Collection',
          instructions: [
            'Label container with required information',
            'Keep sample at room temperature',
            'Deliver to lab within 1 hour',
            'Avoid exposure to direct sunlight'
          ]
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Diagnostic Assistant
            </h1>
          </div>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get step-by-step guidance for sample collection and analysis procedures.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          {!selectedTest ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Select Test Type</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {diagnosticTests.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className="rounded-2xl border p-6 text-left transition-colors hover:bg-accent"
                  >
                    <h3 className="font-semibold">{test.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{test.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedTest.name}</h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedTest(null)
                    setCurrentStep(0)
                  }}
                >
                  Change Test
                </Button>
              </div>

              <div className="space-y-4">
                {selectedTest.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-6 ${
                      index === currentStep ? 'border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        Step {index + 1}: {step.title}
                      </h3>
                      {index < currentStep && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <ul className="mt-4 space-y-3">
                      {step.instructions.map((instruction, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous Step
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(selectedTest.steps.length - 1, currentStep + 1))}
                  disabled={currentStep === selectedTest.steps.length - 1}
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Important Note</h3>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      This guide is for educational purposes only. Always follow the specific instructions provided by your healthcare provider or testing facility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 