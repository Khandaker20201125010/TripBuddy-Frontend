import { TravelStatus } from '@/types/travel'

interface PlanFiltersProps {
  currentFilter: TravelStatus | 'all'
  onFilterChange: (filter: TravelStatus | 'all') => void
  counts: Record<TravelStatus | 'all', number>
}

export function PlanFilters({
  currentFilter,
  onFilterChange,
  counts,
}: PlanFiltersProps) {
  const filters: { id: TravelStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All Plans' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Past' },
  ]

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-md text-sm ${
            currentFilter === filter.id
              ? 'bg-white text-amber-600 shadow'
              : 'text-gray-600'
          }`}
        >
          {filter.label}
          <span className="ml-2 text-xs">({counts[filter.id]})</span>
        </button>
      ))}
    </div>
  )
}
