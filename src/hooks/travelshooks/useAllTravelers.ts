/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { TravelerFilters } from '@/components/modules/ExploreTravelersContent/SearchFilters'
import { useEffect, useState } from 'react'


export function useTravelers(filters?: TravelerFilters) {
  const [travelers, setTravelers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  const fetchTravelers = async () => {
  setLoading(true)
  setError(null)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travelPlan`)
    const data = await res.json()
    
    // Map backend travelPlan -> frontend Traveler shape
    const mappedTravelers = (data.data || []).map((plan: any) => ({
      id: plan.id,
      name: plan.user?.name || 'Unknown',
      avatar: plan.user?.profileImage || '/default-avatar.png',
      coverImage: plan.image || '/default-cover.jpg',
      bio: plan.description || plan.user?.bio || '',
      interests: plan.user?.interests || [],
      rating: plan.user?.rating || 0,
      online: Math.random() > 0.5, // just for demo
      verified: plan.user?.role === 'ADMIN',
      handle: plan.user?.email ? '@' + plan.user.email.split('@')[0] : '@unknown',
      location: plan.destination || 'Unknown',
      travelType: plan.travelType || '',
      startDate: plan.startDate,
      endDate: plan.endDate,
      budget: plan.budget
    }))

    setTravelers(mappedTravelers)
  } catch (err: any) {
    setError(err.message || 'Failed to fetch travelers')
  } finally {
    setLoading(false)
  }
}


    fetchTravelers()
  }, [filters])

  return { travelers, loading, error }
}
