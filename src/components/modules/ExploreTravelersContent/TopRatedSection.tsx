"use client";

import React, { useEffect, useState } from 'react'
import { Trophy, Loader2, UserCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/Rating'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import Link from 'next/link';

export function TopRatedSection() {
  const [travelers, setTravelers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopTravelers = async () => {
      try {
        const response = await api.get('/user/top-rated')
        setTravelers(response.data.data)
      } catch (error) {
        console.error("Failed to fetch top travelers", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTopTravelers()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-6 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="font-bold text-stone-900">Top Rated Travelers</h3>
      </div>

      <div className="space-y-5">
        {travelers.length > 0 ? (
          travelers.map((traveler, i) => (
            <div
              key={traveler.id}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <span className={`absolute -top-1 -left-1 w-5 h-5 text-white text-[10px] flex items-center justify-center rounded-full z-10 border-2 border-white ${
                  i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-stone-900'
                }`}>
                  {i + 1}
                </span>
                <Avatar className="h-12 w-12 border border-stone-100">
                  <AvatarImage
                    src={traveler.profileImage}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-orange-50 text-orange-600 font-bold">
                    {traveler.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                  {traveler.name}
                </h4>
                <div className="flex items-center gap-2">
                  <Rating rating={traveler.rating || 0} size={12} />
                  <span className="text-xs text-stone-400">({traveler.rating?.toFixed(1) || "0.0"})</span>
                </div>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">
                  {traveler._count?.travelPlans || 0} Trips Hosted
                </p>
              </div>

              <Link href={`/profile/${traveler.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-600 hover:text-orange-700"
                >
                  View
                </Button>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <UserCircle className="h-10 w-10 text-stone-200 mx-auto mb-2" />
            <p className="text-stone-400 text-sm">No travelers found.</p>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full mt-6 text-stone-600 hover:bg-stone-50">
        View Full Leaderboard
      </Button>
    </div>
  )
}