import React from 'react'
import { Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Traveler } from '@/components/shared/data/mockTravelers'


interface RecentlyActiveSectionProps {
  travelers: Traveler[]
}
export function RecentlyActiveSection({
  travelers,
}: RecentlyActiveSectionProps) {
  return (
    <div className="bg-stone-50 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-stone-500" />
        <h3 className="font-semibold text-stone-900 text-sm uppercase tracking-wider">
          Recently Active
        </h3>
      </div>

      <div className="flex -space-x-3 overflow-hidden py-2">
        {travelers.map((traveler) => (
          <Avatar
            key={traveler.id}
            className="inline-block h-10 w-10 ring-2 ring-white hover:z-10 hover:scale-110 transition-transform cursor-pointer"
          >
            <AvatarImage src={traveler.avatar} />
            <AvatarFallback>{traveler.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ))}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-stone-200 ring-2 ring-white text-xs font-medium text-stone-600 cursor-pointer hover:bg-stone-300 transition-colors">
          +12
        </div>
      </div>

      <p className="text-xs text-stone-500 mt-3">
        15 travelers active in your area in the last hour.
      </p>
    </div>
  )
}
