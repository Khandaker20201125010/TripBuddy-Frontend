import React from 'react'

import { Palmtree, Mountain, Building2, Trees, LayoutGrid } from 'lucide-react'
import { FilterType } from '@/types/commnunity'
interface FilterBarProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}
export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: {
    type: FilterType
    icon: React.ReactNode
  }[] = [
    {
      type: 'All',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      type: 'Beach',
      icon: <Palmtree className="w-4 h-4" />,
    },
    {
      type: 'Mountain',
      icon: <Mountain className="w-4 h-4" />,
    },
    {
      type: 'City',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      type: 'Forest',
      icon: <Trees className="w-4 h-4" />,
    },
  ]
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {filters.map(({ type, icon }) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            ${activeFilter === type ? 'bg-stone-900 text-white shadow-lg scale-105' : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'}
          `}
        >
          {icon}
          {type}
        </button>
      ))}
    </div>
  )
}
