/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'

import { TravelerFilters } from '@/components/modules/ExploreTravelersContent/SearchFilters'
import { Traveler } from '@/types/travel'

export function useTravelers(filters?: TravelerFilters, page: number = 1, limit: number = 6) {
  const [travelers, setTravelers] = useState<Traveler[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0 })

  useEffect(() => {
    const fetchTravelers = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters) {
          if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)
          if (filters.destination) params.append('destination', filters.destination)
          if (filters.travelType) params.append('travelType', filters.travelType)
        }
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const url = `${process.env.NEXT_PUBLIC_API_URL}/travelPlan?${params.toString()}`
        const res = await fetch(url)
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch')

        if (data.meta) setMeta(data.meta)

        const mappedTravelers: Traveler[] = (data.data || []).map((plan: any) => ({
          id: plan.id,
          userId: plan.user?.id,
          name: plan.user?.name || 'Unknown',
          avatar: plan.user?.profileImage || '/default-avatar.png',
          coverImage: plan.image || '/default-cover.jpg',
          bio: plan.description || plan.user?.bio || '',
          visitedCountries: plan.user?.visitedCountries || [],
          profileImage: plan.user?.profileImage,
          interests: plan.user?.interests || (plan.travelType ? [plan.travelType] : []),
          rating: plan.user?.rating || 0,
          online: plan.user?.status === "ACTIVE", 
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
  }, [filters, page, limit])

  return { travelers, loading, error, meta }
}