import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, ExternalLink, MapPin, Calendar, Users, FileText } from 'lucide-react'

export default function SearchResults({ results, isLoading, error, currentPage, totalCount, hasNextPage, onPageChange }) {
  console.log('SearchResults props:', { results, isLoading, error, currentPage, totalCount, hasNextPage }) // Debug log

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Searching for trials...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  if (!results || results.length === 0) {
    console.log('No results condition met:', { results }) // Debug log
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No trials found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((trial) => {
        // Ensure we have a valid NCTId
        if (!trial.NCTId) {
          console.log('Trial missing NCTId:', trial) // Debug log
          return null
        }
        
        return (
          <Card key={trial.NCTId} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <Link href={`/trials/${trial.NCTId}`} className="block">
                  <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                    {trial.BriefTitle || 'Untitled Study'}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {trial.BriefSummary || 'No description available.'}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {trial.LocationFacility || 'Multiple Locations'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(trial.StartDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {trial.EnrollmentCount || 'Not specified'} participants
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {trial.StudyType}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/trials/${trial.NCTId}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button className="w-full">
                  Apply Now
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
      
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 