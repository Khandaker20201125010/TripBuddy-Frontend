'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchFilters, TravelerFilters } from './SearchFilters'
import { TravelerGrid } from './TravelerGrid'
import { RecommendedSection } from './RecommendedSection'
import { TopRatedSection } from './TopRatedSection'
import { RecentlyActiveSection } from './RecentlyActiveSection'
import { BrowseByRegion } from './BrowseByRegion'
import { useRecommendedTravelers } from '@/hooks/travelshooks/useRecommendedTravelers'
import { useTravelers } from '@/hooks/travelshooks/useAllTravelers'
import Subscription from './Subscription'

export function ExploreTravelersPageContent() {
  const [filters, setFilters] = useState<TravelerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 6

  const { 
    recommendedTravelers, 
    loading: recLoading, 
    error,
    isAuthenticated,
    status: recStatus 
  } = useRecommendedTravelers()
  
  const { travelers, loading, meta } = useTravelers(filters, currentPage, itemsPerPage)

  const totalPages = Math.ceil((meta?.total || 0) / itemsPerPage)

  const handleFilterChange = (newFilters: TravelerFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    const exploreSection = document.getElementById('explore-travelers')
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleRetryRecommendations = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
        {/* Modern Header + Search */}
        <div className="relative mb-8 md:mb-12 lg:mb-16 max-w-6xl mx-auto">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 md:opacity-30">
            <div className="absolute top-10 md:top-20 right-10 md:right-20 w-40 h-40 md:w-60 md:h-60 rounded-full bg-(--color-coral) blur-[80px] md:blur-[120px]" />
            <div className="absolute bottom-40 md:bottom-60 right-40 md:right-60 w-48 h-48 md:w-72 md:h-72 rounded-full bg-(--color-sunset) blur-[60px] md:blur-[100px]" />
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Badge/Featured Text */}
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 rounded-full px-3 py-1 md:px-4 md:py-1.5 mb-4 md:mb-6 lg:mb-8 text-xs md:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="font-medium text-orange-700">Join {meta?.total || 0} travelers worldwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
              <span className="block text-stone-900">
                Connect with Travelers
              </span>
              <span className="bg-linear-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Around the World
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg lg:text-xl text-stone-600 mb-6 md:mb-8 lg:mb-10 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              Find travel buddies, get local advice, and share your journey with a global community of explorers.
            </p>

            {/* Search Container */}
            <div className="mb-6 md:mb-8">
              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-2 text-stone-700">
                  <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
                    <Search className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">Find your perfect travel companion</h3>
                    <p className="text-xs md:text-sm text-stone-500">Filter by interests, destinations, and travel styles</p>
                  </div>
                </div>
              </div>

              <SearchFilters onChange={handleFilterChange} />
            </div>

            {/* Stats/Trust Indicators */}
            <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-linear-to-br from-orange-400 to-amber-300"
                    />
                  ))}
                </div>
                <span>Active travelers today</span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-stone-300" />

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live connections</span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-stone-300" />

              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <MapPin className="h-3 w-3 md:h-3 md:w-3 text-blue-600" />
                </div>
                <span>150+ countries represented</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Main Content */}
          <div className="flex-1">
            {/* Recommended Section */}
            <RecommendedSection 
              travelers={recommendedTravelers} 
              loading={recLoading || recStatus === 'loading'} 
              error={error}
              isAuthenticated={isAuthenticated}
              onRetry={handleRetryRecommendations}
            />

            <div id="explore-travelers" className="my-6 md:my-8 scroll-mt-8 md:scroll-mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-stone-900">Explore Travelers</h2>
                <div className="text-sm text-stone-500">
                  {loading ? (
                    "Loading results..."
                  ) : (
                    `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, meta?.total || 0)} of ${meta?.total || 0} results`
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 md:py-20 text-stone-400">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin mb-2" />
                  <p className="text-sm md:text-base">Fetching travelers...</p>
                </div>
              ) : travelers.length > 0 ? (
                <>
                  <TravelerGrid travelers={travelers} />

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 md:h-10 text-sm"
                      >
                        <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 md:w-9 md:h-9 text-sm ${currentPage === page ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                          >
                            {page}
                          </Button>
                        ))}
                        {totalPages > 5 && (
                          <>
                            <span className="px-1 md:px-2 text-stone-500">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(totalPages)}
                              className={`w-8 h-8 md:w-9 md:h-9 text-sm ${currentPage === totalPages ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 md:h-10 text-sm"
                      >
                        Next <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 md:py-20 bg-white rounded-lg md:rounded-xl border border-dashed border-stone-200">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                    <Search className="h-6 w-6 md:h-8 md:w-8 text-stone-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-stone-900 mb-2">No travelers found</h3>
                  <p className="text-sm md:text-base text-stone-500 mb-4">Try adjusting your search filters</p>
                  <Button
                    variant="outline"
                    className="border-stone-300 hover:bg-stone-50 text-sm"
                    onClick={() => handleFilterChange({})}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 space-y-6 md:space-y-8">
            <TopRatedSection />
            <RecentlyActiveSection />
            <BrowseByRegion />
            <Subscription />
          </aside>
        </div>
      </main>
    </div>
  )
}