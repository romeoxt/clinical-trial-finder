import React from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import VaccineMap from '../components/VaccineMap'
import { AlertCircle, Info, TrendingUp, Globe, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function VaccinesPage() {
  return (
    <>
      <Head>
        <title>Vaccine Coverage Map | Clinical Trial Finder</title>
        <meta name="description" content="Track vaccine distribution and coverage across different regions" />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Vaccine Coverage Map
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Track vaccine distribution and coverage across different regions. Click on locations to view detailed information.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <VaccineMap />

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Global Coverage</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">75%</div>
                    <p className="text-xs text-muted-foreground">
                      Average global vaccine coverage
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coverage Trend</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+5.2%</div>
                    <p className="text-xs text-muted-foreground">
                      Year-over-year improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Protected Population</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5.8B</div>
                    <p className="text-xs text-muted-foreground">
                      People with vaccine coverage
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      About the Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This map displays vaccine coverage data from the World Health Organization (WHO). 
                      Coverage percentages represent the proportion of the target population that has received 
                      the recommended vaccine doses. Data is updated annually and may vary by country.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary">WHO Data</Badge>
                      <Badge variant="secondary">Annual Updates</Badge>
                      <Badge variant="secondary">Global Coverage</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      Important Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Vaccine availability and recommendations may vary by location. Please consult with your 
                      healthcare provider for specific guidance and eligibility. Coverage data may not reflect 
                      recent changes in vaccination programs or policies.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Consult Healthcare Provider
                      </Badge>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Check Local Guidelines
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 