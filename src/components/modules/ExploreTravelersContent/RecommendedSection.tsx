import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

import { TravelerCard } from './TravelerCard'
import { Traveler } from '@/components/shared/data/mockTravelers'
import { Button } from '@/components/ui/button'
interface RecommendedSectionProps {
  travelers: Traveler[]
}
export function RecommendedSection({ travelers }: RecommendedSectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-full text-orange-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Recommended for You
            </h2>
            <p className="text-sm text-stone-500">
              Based on your interests in Photography and Hiking
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {travelers.map((traveler, index) => (
          <TravelerCard key={traveler.id} traveler={traveler} index={index} />
        ))}
      </div>
    </section>
  )
}
