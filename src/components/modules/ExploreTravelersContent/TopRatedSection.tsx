import React from 'react'
import { Trophy } from 'lucide-react'
import { Traveler } from '@/components/shared/data/mockTravelers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/Rating'
import { Button } from '@/components/ui/button'

interface TopRatedSectionProps {
  travelers: Traveler[]
}
export function TopRatedSection({ travelers }: TopRatedSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="font-bold text-stone-900">Top Rated Travelers</h3>
      </div>

      <div className="space-y-5">
        {travelers.slice(0, 4).map((traveler, i) => (
          <div
            key={traveler.id}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-stone-900 text-white text-xs flex items-center justify-center rounded-full z-10 border-2 border-white">
                {i + 1}
              </span>
              <Avatar className="h-12 w-12">
                <AvatarImage src={traveler.avatar} />
                <AvatarFallback>{traveler.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                {traveler.name}
              </h4>
              <Rating rating={traveler.rating} size={12} showText />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-6 text-stone-600">
        View Leaderboard
      </Button>
    </div>
  )
}
