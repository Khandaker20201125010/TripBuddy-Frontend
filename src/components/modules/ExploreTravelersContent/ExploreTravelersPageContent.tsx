'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchFilters, TravelerFilters } from './SearchFilters'
import { TravelerGrid } from './TravelerGrid'
import {
  recommendedTravelers,
  topRatedTravelers,
  recentlyActiveTravelers,
} from '@/components/shared/data/mockTravelers'
import { RecommendedSection } from './RecommendedSection'
import { TopRatedSection } from './TopRatedSection'
import { RecentlyActiveSection } from './RecentlyActiveSection'
import { BrowseByRegion } from './BrowseByRegion'
import { useRecommendedTravelers } from '@/hooks/travelshooks/useRecommendedTravelers'
import { useMatchedTravelers } from '@/hooks/travelshooks/useMatchedTravelers'
import { useTravelers } from '@/hooks/travelshooks/useAllTravelers'


export function ExploreTravelersPageContent() {
  const [filters, setFilters] = useState<TravelerFilters>({});

  const { recommendedTravelers } = useRecommendedTravelers();
  const { matchedTravelers } = useMatchedTravelers(filters);
  const { travelers, loading } = useTravelers(filters)



  return (
    <div className="min-h-screen bg-stone-50">
      <main className="container mx-auto px-4 py-8">

        {/* Header + Search */}
        <div className="relative mb-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Connect with Travelers
            <br className="hidden md:block" />
            <span className="text-orange-600">Around the World</span>
          </h1>
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            Find travel buddies, get local advice, and share your journey.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-lg border border-stone-100 text-left">
            <SearchFilters onChange={setFilters} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Main Content */}
          <div className="flex-1">
            <RecommendedSection travelers={recommendedTravelers} />

            <div className="my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Explore Travelers</h2>
                <div className="text-sm text-stone-500">
                  Showing {travelers.length} results
                </div>
              </div>

              {loading ? (
                <p className="text-center text-stone-500">Loading travelers...</p>
              ) : (
                <TravelerGrid travelers={travelers} />
              )}

              <div className="mt-10 flex justify-center">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Load More Travelers
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 space-y-8">
            <TopRatedSection travelers={topRatedTravelers} />
            <RecentlyActiveSection travelers={recentlyActiveTravelers} />
            <BrowseByRegion />

            <div className="bg-emerald-700 rounded-xl p-6 text-white relative">
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
          </aside>

        </div>
      </main>
    </div>
  )
}
