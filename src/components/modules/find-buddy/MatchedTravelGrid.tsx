"use client";

import { TravelPlan } from "@/types/travel";
import { TravelBuddyCard } from "./TravelBuddyCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PaginationMeta } from "@/hooks/travelshooks/useMatchedTravelPlans";

interface MatchedTravelGridProps {
  plans: TravelPlan[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  itemsPerPage: number; // Add this prop
  onItemsPerPageChange?: (value: number) => void; // Add this prop
}

export function MatchedTravelGrid({ 
  plans, 
  pagination, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange 
}: MatchedTravelGridProps) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near start
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      }

      // Adjust if near end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxVisiblePages - 2));
      }

      // Add ellipsis at start if needed
      if (start > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis at end if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (!plans.length) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
            <ChevronRight className="h-8 w-8 text-stone-400 rotate-90" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">No matches found</h3>
          <p className="text-stone-500 mb-4">Try adjusting your search filters or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-600">
          Showing <span className="font-semibold text-stone-900">
            {(pagination.currentPage - 1) * itemsPerPage + 1} - {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)}
          </span> of <span className="font-semibold text-stone-900">{pagination.totalItems}</span> results
        </div>
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">Show:</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="text-sm border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
            </select>
            <span className="text-sm text-stone-500">per page</span>
          </div>
        )}
      </div>

      {/* Grid Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <TravelBuddyCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>

      {/* Advanced Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pt-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page Info */}
            <div className="text-sm text-stone-600">
              Page <span className="font-semibold text-stone-900">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold text-stone-900">{pagination.totalPages}</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="flex items-center gap-1 border-stone-300 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber, index) =>
                  pageNumber === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-stone-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  ) : (
                    <Button
                      key={`page-${pageNumber}`}
                      variant={pagination.currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNumber as number)}
                      className={`w-9 h-9 font-medium ${
                        pagination.currentPage === pageNumber
                          ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
                          : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                )}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="flex items-center gap-1 border-stone-300 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Jump to Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">Go to:</span>
              <div className="relative">
                <select
                  value={pagination.currentPage}
                  onChange={(e) => onPageChange(Number(e.target.value))}
                  className="pl-3 pr-8 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none cursor-pointer"
                >
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <option key={page} value={page}>
                      Page {page}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none rotate-90" />
              </div>
            </div>
          </div>

          {/* Mobile-friendly pagination */}
          <div className="mt-4 flex items-center justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="flex-1"
            >
              Previous
            </Button>
            <div className="px-4 text-sm text-stone-600">
              {pagination.currentPage}/{pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="flex-1"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}