'use client'
import React from 'react'
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { TravelerCard } from './TravelerCard'
import { Button } from '@/components/ui/button'

interface RecommendedSectionProps {
  travelers: any[]
  loading?: boolean
}

export function RecommendedSection({ travelers, loading }: RecommendedSectionProps) {
  
  // 1. Loading State
  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-stone-400">
        <Loader2 className="animate-spin mr-2 h-5 w-5" /> Finding travel matches...
      </div>
    )
  }

  // 2. Empty State (Debug Check)
  // If this returns null, you won't see anything. 
  // If you are logged in but have 0 recommendations, this hides the section.
  if (!travelers || travelers.length === 0) {
     console.log("RecommendedSection hidden: No travelers found.");
     return null; 
  }

  // 3. Data State
  return (
    <section className="py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-full text-orange-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Recommended for You</h2>
            <p className="text-sm text-stone-500">Based on your activity and interests</p>
          </div>
        </div>
        <Button variant="ghost" className="text-orange-600">
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