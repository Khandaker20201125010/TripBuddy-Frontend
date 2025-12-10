import React from 'react'

import { TravelerCard } from './TravelerCard'
import { Traveler } from '@/components/shared/data/mockTravelers'
interface TravelerGridProps {
  travelers: Traveler[]
}
export function TravelerGrid({ travelers }: TravelerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {travelers.map((traveler, index) => (
        <TravelerCard key={traveler.id} traveler={traveler} index={index} />
      ))}
    </div>
  )
}
