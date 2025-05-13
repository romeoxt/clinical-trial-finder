import React, { useState } from 'react'
import Head from 'next/head'
import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults'
import Navbar from '../components/Navbar'

export default function TrialsPage() {
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = async (searchParams) => {
    setIsLoading(true)
    setError(null)
    setCurrentPage(1)
    setNextPageToken(null)

    try {
      const queryParams = new URLSearchParams({
        condition: searchParams.condition,
        ...(searchParams.location && { location: searchParams.location }),
        ...(searchParams.status && { status: searchParams.status })
      })

      console.log('Searching with params:', Object.fromEntries(queryParams)) // Debug log
      const response = await fetch(`/api/search?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch clinical trials')
      }

      const data = await response.json()
      console.log('Received data:', data) // Debug log
      
      if (!data.studies || !Array.isArray(data.studies)) {
        console.error('Invalid data structure received:', data) // Debug log
        throw new Error('Invalid data structure received from API')
      }

      setSearchResults(data.studies)
      setTotalCount(data.totalCount)
      setNextPageToken(data.nextPageToken)
    } catch (err) {
      console.error('Search error:', err) // Debug log
      setError(err.message)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = async (direction) => {
    if (direction === 'next' && !nextPageToken) return
    if (direction === 'prev' && currentPage === 1) return

    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        condition: searchResults[0]?.Condition || '',
        ...(nextPageToken && { pageToken: nextPageToken })
      })

      console.log('Page change params:', Object.fromEntries(queryParams)) // Debug log
      const response = await fetch(`/api/search?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch clinical trials')
      }

      const data = await response.json()
      console.log('Page change data:', data) // Debug log
      
      if (!data.studies || !Array.isArray(data.studies)) {
        console.error('Invalid data structure received:', data) // Debug log
        throw new Error('Invalid data structure received from API')
      }

      setSearchResults(data.studies)
      setNextPageToken(data.nextPageToken)
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1)
    } catch (err) {
      console.error('Page change error:', err) // Debug log
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Clinical Trial Finder | Search Clinical Trials</title>
        <meta name="description" content="Search for clinical trials worldwide" />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Clinical Trial Finder
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Search for clinical trials by condition, location, and status.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
              <SearchForm onSearch={handleSearch} />
              <div className="mt-8">
                <SearchResults
                  results={searchResults}
                  isLoading={isLoading}
                  error={error}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalCount={totalCount}
                  hasNextPage={!!nextPageToken}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 