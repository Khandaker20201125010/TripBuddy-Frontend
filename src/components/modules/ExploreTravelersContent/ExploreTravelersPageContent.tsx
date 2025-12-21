'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchFilters, TravelerFilters } from './SearchFilters'
import { TravelerGrid } from './TravelerGrid'
import {
  topRatedTravelers,
  recentlyActiveTravelers,
} from '@/components/shared/data/mockTravelers'
import { RecommendedSection } from './RecommendedSection'
import { TopRatedSection } from './TopRatedSection'
import { RecentlyActiveSection } from './RecentlyActiveSection'
import { BrowseByRegion } from './BrowseByRegion'
import { useRecommendedTravelers } from '@/hooks/travelshooks/useRecommendedTravelers'
import { useTravelers } from '@/hooks/travelshooks/useAllTravelers'

export function ExploreTravelersPageContent() {
  // 1. Local State for Pagination and Filters
  const [filters, setFilters] = useState<TravelerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // 2. Data Fetching Hooks
  const { recommendedTravelers, loading: recLoading } = useRecommendedTravelers()
  
  // Note: Updated hook now accepts currentPage and itemsPerPage
  const { travelers, loading, meta } = useTravelers(filters, currentPage, itemsPerPage)

  // 3. Calculation for Pagination
  const totalPages = Math.ceil((meta?.total || 0) / itemsPerPage)

  // 4. Handlers
  const handleFilterChange = (newFilters: TravelerFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Smooth scroll back to the top of the "Explore" section
    const exploreSection = document.getElementById('explore-travelers')
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="container mx-auto px-4 py-8">

        {/* Header + Search */}
        <div className="relative mb-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Connect with Travelers
            <br className="hidden md:block" />
            <span className="text-orange-600"> Around the World</span>
          </h1>
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            Find travel buddies, get local advice, and share your journey.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-lg border border-stone-100 text-left">
            <SearchFilters onChange={handleFilterChange} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Main Content */}
          <div className="flex-1">
            <RecommendedSection travelers={recommendedTravelers} loading={recLoading} />

            <div id="explore-travelers" className="my-8 scroll-mt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Explore Travelers</h2>
                <div className="text-sm text-stone-500">
                  {loading ? (
                    "Loading results..."
                  ) : (
                    `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, meta?.total || 0)} of ${meta?.total || 0} results`
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Fetching travelers...</p>
                </div>
              ) : travelers.length > 0 ? (
                <>
                  <TravelerGrid travelers={travelers} />

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>

                      {/* Simple Page Number Buttons */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 ${currentPage === page ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-stone-200">
                  <p className="text-stone-500">No travelers found matching your criteria.</p>
                  <Button 
                    variant="link" 
                    className="text-orange-600 mt-2"
                    onClick={() => handleFilterChange({})}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 space-y-8">
            <TopRatedSection travelers={topRatedTravelers} />
            <RecentlyActiveSection travelers={recentlyActiveTravelers} />
            <BrowseByRegion />

            <div className="bg-emerald-700 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Become a Verified Traveler</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  Get the blue badge, unlock exclusive features.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white text-emerald-800 hover:bg-emerald-50"
                >
                  Apply Now
                </Button>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-600 rounded-full opacity-50" />
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}