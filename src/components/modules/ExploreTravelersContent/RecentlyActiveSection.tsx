/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react'
import { Clock, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import api from '@/lib/axios'

export function RecentlyActiveSection() {
  const [travelers, setTravelers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const response = await api.get('/user/recently-active')
        setTravelers(response.data.data)
      } catch (error) {
        console.error("Error fetching active users", error)
      } finally {
        setLoading(false)
      }
    }
    fetchActive()
  }, [])

  if (loading) return <Loader2 className="animate-spin h-5 w-5 text-stone-400" />

  // Logic for slicing the data
  const displayLimit = 3;
  const displayTravelers = travelers.slice(0, displayLimit);
  const remainingCount = travelers.length > displayLimit ? travelers.length - displayLimit : 0;

  return (
    <div className="bg-stone-50 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-stone-500" />
        <h3 className="font-semibold text-stone-900 text-sm uppercase tracking-wider">
          Recently Active
        </h3>
      </div>

      <div className="flex -space-x-3 overflow-hidden py-2">
        {displayTravelers.map((traveler) => (
          <Avatar
            key={traveler.id}
            className="inline-block h-10 w-10 ring-2 ring-white hover:z-20 hover:scale-110 transition-transform cursor-pointer"
          >
            <AvatarImage src={traveler.profileImage} className="object-cover" />
            <AvatarFallback className="bg-stone-200 text-[10px]">
              {traveler.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        
        {/* Only show the plus bubble if there are travelers left over */}
        {remainingCount > 0 && (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-stone-200 ring-2 ring-white text-xs font-medium text-stone-600 z-10">
            +{remainingCount}
          </div>
        )}
      </div>

      <p className="text-xs text-stone-500 mt-3">
        {travelers.length} {travelers.length === 1 ? 'traveler was' : 'travelers were'} active recently.
      </p>
    </div>
  )
}