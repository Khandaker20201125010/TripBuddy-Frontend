/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plane, Users, Sparkles, MapPin, Calendar, TrendingUp } from "lucide-react";
import { BuddyFilters } from "@/components/modules/find-buddy/BuddyFilters";
import { MatchedTravelGrid } from "@/components/modules/find-buddy/MatchedTravelGrid";
import { PremiumCTA } from "@/components/modules/find-buddy/PremiumCTA";
import { useMatchedTravelPlans } from "@/hooks/travelshooks/useMatchedTravelPlans";
import { useTravelStats } from "@/hooks/travelshooks/useTravelStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function FindTravelBuddyComponents() {
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("Best Match");
  const [itemsPerPage, setItemsPerPage] = useState(4); // Changed from 6 to 4

  const { stats, loading: statsLoading } = useTravelStats();
  const { data, loading, pagination } = useMatchedTravelPlans(filters, page, itemsPerPage, sortOption);

  // Normal updates merge state
  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  // Clear function explicitly replaces state with an empty object
  const clearAllFilters = () => {
    setFilters({});
    setPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setPage(1); // Reset to first page when changing items per page
  };

  const totalResults = pagination?.totalItems || 0;
  const activeFiltersCount = Object.keys(filters).filter(key =>
    filters[key] !== undefined && filters[key] !== ''
  ).length;

  // Calculate showing range
  const showingStart = totalResults > 0 ? (page - 1) * itemsPerPage + 1 : 0;
  const showingEnd = Math.min(page * itemsPerPage, totalResults);

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 via-white to-orange-50/30">
      <div className="container mx-auto px-4 py-8 md:py-12">

        {/* Header with Stats */}
        <div className="relative max-w-4xl mx-auto mb-10 md:mb-14">
          <div className="absolute top-0 left-0 w-1/2 h-full opacity-30">
            <div className="absolute top-10 left-20 w-40 h-40 rounded-full bg-(--color-coral) blur-[120px]" />
            <div className="absolute bottom-60 left-60 w-40 h-40 rounded-full bg-(--color-sunset) blur-[100px]" />
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                <Sparkles className="h-3 w-3 mr-1" />
                Match & Travel
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Find Your Perfect{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Travel Buddy
                </span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-orange-200/50 -rotate-1"></span>
              </span>
            </h1>

            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Connect with travelers who share your destination, dates, and travel style.
              Adventure awaits with the perfect companion.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm min-w-[150px]">
              <Plane className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-stone-700">
                {statsLoading ? (
                  <span className="inline-block w-8 h-4 bg-stone-100 animate-pulse rounded mr-1 align-middle" />
                ) : (
                  <span className="font-bold text-orange-600">{stats?.travelers || 0}</span>
                )}
                {" "} Travelers
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm min-w-[150px]">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-stone-700">
                {statsLoading ? (
                  <span className="inline-block w-8 h-4 bg-stone-100 animate-pulse rounded mr-1 align-middle" />
                ) : (
                  <span className="font-bold text-orange-600">{stats?.destinations || 0}+</span>
                )}
                {" "} Destinations
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm min-w-[150px]">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-stone-700">
                {statsLoading ? (
                  <span className="inline-block w-8 h-4 bg-stone-100 animate-pulse rounded mr-1 align-middle" />
                ) : (
                  <span className="font-bold text-orange-600">{stats?.tripsThisYear || 0}</span>
                )}
                {" "} Trips ({new Date().getFullYear()})
              </span>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-stone-800">Find Your Match</h2>
                <p className="text-sm text-stone-500">
                  Use filters to narrow down your perfect travel companion
                </p>
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-sm text-stone-500 hover:text-stone-700"
                  >
                    Clear all filters ({activeFiltersCount})
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="text-sm border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                  </select>
                </div>
              </div>
            </div>
            <BuddyFilters key={activeFiltersCount === 0 ? 'reset' : 'active'} onChange={handleFilterChange} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-stone-800">Matched Travelers</h3>
                  <p className="text-sm text-stone-500">
                    Showing {showingStart}-{showingEnd} of {totalResults} results
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setPage(1);
                    }}
                    className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white cursor-pointer"
                  >
                    <option value="Best Match">Best Match</option>
                    <option value="Date">Date (Soonest)</option>
                    <option value="Destination">Destination (A-Z)</option>
                    <option value="Budget">Budget (Low to High)</option>
                    <option value="Popularity">Most Popular</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-stone-200 p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <MatchedTravelGrid
                  plans={data}
                  pagination={pagination}
                  onPageChange={setPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <PremiumCTA />
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold text-amber-900">Quick Tips</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-amber-400"></div>
                    <span className="text-sm text-amber-800">Complete your profile for better matches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-amber-400"></div>
                    <span className="text-sm text-amber-800">Login to your account for Joining travel plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-amber-400"></div>
                    <span className="text-sm text-amber-800">Verify travel dates before committing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <h4 className="font-semibold text-stone-800">Trending Now</h4>
                </div>
                <div className="space-y-3">
                  {statsLoading ? (
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="flex justify-between p-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    ))
                  ) : stats?.trending && stats.trending.length > 0 ? (
                    stats.trending.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors group"
                        onClick={() => handleFilterChange({ destination: item.destination })}
                      >
                        <span className="text-sm text-stone-700 font-medium capitalize truncate max-w-[140px] group-hover:text-orange-600">
                          {item.destination}
                        </span>
                        <Badge variant="secondary" className="text-xs shrink-0 bg-orange-50 text-orange-700 border-orange-200">
                          {item.count} travelers
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-stone-500 italic p-2">
                      No trending data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-linear-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 text-center">
          <h3 className="text-2xl font-bold text-stone-800 mb-3">
            Ready for your next adventure?
          </h3>
          <p className="text-stone-600 mb-6 max-w-md mx-auto">
            Join thousands of travelers finding their perfect companions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/my-travel-plans">
              <Button size="lg" variant="gradient" className="shadow-md shadow-orange-200 hover:shadow-lg">
                Share Your Trip
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setFilters({});
                setPage(1);
              }}
            >
              Reset Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}