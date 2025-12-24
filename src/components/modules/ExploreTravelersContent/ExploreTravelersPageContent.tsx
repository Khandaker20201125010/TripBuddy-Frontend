'use client'

import { useState } from 'react'
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

export function ExploreTravelersPageContent() {
  const [filters, setFilters] = useState<TravelerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 6

  const { recommendedTravelers, loading: recLoading } = useRecommendedTravelers()
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

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="container mx-auto px-4 py-8">
        {/* Modern Header + Search */}
        <div className="relative mb-12 md:mb-16 max-w-6xl mx-auto">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
            <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-(--color-coral) blur-[120px]" />
            <div className="absolute bottom-60 right-60 w-72 h-72 rounded-full bg-(--color-sunset) blur-[100px]" />
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Badge/Featured Text */}
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 rounded-full px-4 py-1.5 mb-6 md:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-medium text-orange-700">Join {meta?.total} travelers worldwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="block text-stone-900">
                Connect with Travelers
              </span>
              <span className="bg-linear-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Around the World
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Find travel buddies, get local advice, and share your journey with a global community of explorers.
            </p>

            {/* Search Container */}
            <div className=" p-6 md:p-8 text-left ">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-stone-700">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Search className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Find your perfect travel companion</h3>
                    <p className="text-sm text-stone-500">Filter by interests, destinations, and travel styles</p>
                  </div>
                </div>
              </div>

              <SearchFilters onChange={handleFilterChange} />
            </div>

            {/* Stats/Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white bg-linear-to-br from-orange-400 to-amber-300"
                    />
                  ))}
                </div>
                <span>Active travelers today</span>
              </div>

              <div className="hidden md:block w-px h-4 bg-stone-300" />

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live connections</span>
              </div>

              <div className="hidden md:block w-px h-4 bg-stone-300" />

              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <MapPin className="h-3 w-3 text-blue-600" />
                </div>
                <span>150+ countries represented</span>
              </div>
            </div>
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
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 ${currentPage === page ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
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
            {/* FIXED: Removed the travelers prop because these components fetch their own data internally */}
            <TopRatedSection />
            <RecentlyActiveSection />
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
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-600 rounded-full opacity-50" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}