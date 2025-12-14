"use client";

import { useState } from "react";
import { BuddyFilters } from "@/components/find-buddy/BuddyFilters";
import { MatchedTravelGrid } from "@/components/find-buddy/MatchedTravelGrid";
import { PremiumCTA } from "@/components/find-buddy/PremiumCTA";
import { useMatchedTravelPlans } from "@/hooks/travelshooks/useMatchedTravelPlans";

export default function FindTravelBuddyComponents() {
  const [filters, setFilters] = useState({});
  const { data, loading } = useMatchedTravelPlans(filters);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Find Your <span className="text-orange-600">Travel Buddy</span>
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Match with travelers going to the same destination, same time, same vibe.
          </p>
        </div>

        {/* Filters */}
        <BuddyFilters onChange={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-10">

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <p className="text-center text-stone-500">Finding travel buddies...</p>
            ) : (
              <MatchedTravelGrid plans={data} />
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <PremiumCTA />
          </div>
        </div>

      </div>
    </div>
  );
}
