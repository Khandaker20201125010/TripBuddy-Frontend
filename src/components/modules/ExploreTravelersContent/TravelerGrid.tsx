import React from 'react'
import { TravelerCard } from './TravelerCard'
import { Traveler } from '@/types/travel'

interface TravelerGridProps {
  travelers: Traveler[]
}

export function TravelerGrid({ travelers }: TravelerGridProps) {
  if (!travelers || travelers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {travelers.map((traveler, index) => (
        <TravelerCard 
            key={traveler.id || index} // Fallback to index if ID is missing (prevents crash)
            traveler={traveler} 
            index={index} 
        />
      ))}
    </div>
  )
}