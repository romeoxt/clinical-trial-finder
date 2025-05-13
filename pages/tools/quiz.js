import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Brain, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

export default function GeneticQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      question: 'What is a SNP (Single Nucleotide Polymorphism)?',
      options: [
        'A type of genetic mutation that affects multiple genes',
        'A variation in a single DNA building block (nucleotide)',
        'A protein that helps repair DNA damage',
        'A technique used to sequence DNA'
      ],
      correctAnswer: 1,
      explanation: 'A SNP is a variation in a single nucleotide (A, T, C, or G) in the DNA sequence. These variations can affect how genes function and may be associated with disease risk.'
    },
    {
      question: 'What is the purpose of a clinical trial?',
      options: [
        'To diagnose diseases in patients',
        'To test the safety and effectiveness of new treatments',
        'To provide immediate treatment to patients',
        'To replace standard medical care'
      ],
      correctAnswer: 1,
      explanation: 'Clinical trials are research studies that test new treatments, interventions, or tests to determine their safety and effectiveness in humans.'
    },
    {
      question: 'What is CRISPR used for?',
      options: [
        'To diagnose genetic diseases',
        'To sequence DNA',
        'To edit genes',
        'To clone organisms'
      ],
      correctAnswer: 2,
      explanation: 'CRISPR is a gene-editing technology that allows scientists to make precise changes to DNA. It has potential applications in treating genetic diseases and improving crops.'
    },
    {
      question: 'What is the difference between genotype and phenotype?',
      options: [
        'Genotype is the physical expression of genes, while phenotype is the genetic code',
        'Genotype is the genetic code, while phenotype is the physical expression of genes',
        'They are the same thing',
        'Genotype is inherited, while phenotype is not'
      ],
      correctAnswer: 1,
      explanation: 'Genotype refers to the genetic makeup of an organism (the DNA sequence), while phenotype refers to the observable physical and behavioral characteristics that result from the interaction of genes and environment.'
    }
  ]

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
    setSelectedAnswer(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Genetic Literacy Quiz
            </h1>
          </div>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Test your knowledge of genetics, clinical trials, and healthcare research.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          {!showResults ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
                <span className="text-sm text-muted-foreground">
                  Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
                </span>
              </div>

              <div className="rounded-2xl border p-6">
                <h3 className="text-lg font-medium">
                  {questions[currentQuestion].question}
                </h3>
                <div className="mt-6 space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        selectedAnswer === index
                          ? index === questions[currentQuestion].correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-red-500 bg-red-50 dark:bg-red-950'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer === index && (
                          index === questions[currentQuestion].correctAnswer
                            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                            : <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedAnswer !== null && (
                <div className="space-y-4">
                  <div className="rounded-2xl border p-4">
                    <h4 className="font-medium">Explanation:</h4>
                    <p className="mt-2 text-muted-foreground">
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                  <Button onClick={handleNext} className="w-full">
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      'See Results'
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-2xl border p-6 text-center">
                <h2 className="text-2xl font-semibold">Quiz Complete!</h2>
                <p className="mt-2 text-4xl font-bold text-primary">
                  {score}/{questions.length}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {score === questions.length
                    ? 'Perfect score! Excellent knowledge of genetics!'
                    : score >= questions.length * 0.7
                    ? 'Great job! You have a good understanding of genetics.'
                    : 'Keep learning! Review the explanations to improve your knowledge.'}
                </p>
              </div>
              <Button onClick={handleRestart} className="w-full">
                Take Quiz Again
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 