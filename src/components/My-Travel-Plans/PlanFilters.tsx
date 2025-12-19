'use client'

import { TravelStatus } from '@/types/travel'

// Define the filter types including 'MyPlans'
export type FilterType = TravelStatus | 'all' | 'MyPlans';

interface PlanFiltersProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

export function PlanFilters({
  currentFilter,
  onFilterChange,
  counts,
}: PlanFiltersProps) {
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Plans' },
    { id: 'MyPlans', label: 'My Plans' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Past' },
  ]

  return (
    <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-md text-sm transition-all ${
            currentFilter === filter.id
              ? 'bg-white text-amber-600 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          {filter.label}
          <span className="ml-2 text-xs opacity-70">({counts[filter.id] || 0})</span>
        </button>
      ))}
    </div>
  )
}