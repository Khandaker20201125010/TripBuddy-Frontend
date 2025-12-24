"use client";

import { TravelPlan } from "@/types/travel";
import { TravelBuddyCard } from "./TravelBuddyCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/hooks/travelshooks/useMatchedTravelPlans";

interface MatchedTravelGridProps {
  plans: TravelPlan[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function MatchedTravelGrid({ plans, pagination, onPageChange }: MatchedTravelGridProps) {
  // NOTE: We do NOT filter by session.user.id here anymore.
  // The backend already excluded my own trips.
  // This ensures pagination works (if backend sends 6 items, we show 6 items).

  return (
    <div className="space-y-8">
      {/* Grid Display */}
      {plans.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <TravelBuddyCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-stone-500 font-medium">No trips found on this page.</p>
          <p className="text-sm text-stone-400 mt-1">
             Try adjusting your filters or checking previous pages.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="text-sm font-medium text-gray-700 bg-orange-50 px-4 py-2 rounded-md border">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>

          <Button
            variant="gradient"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}