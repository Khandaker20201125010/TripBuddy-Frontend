/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { TravelerFilters } from '@/components/modules/ExploreTravelersContent/SearchFilters'
import { Traveler } from '@/types/travel'
import api from '@/lib/axios'

export function useTravelers(
  filters?: TravelerFilters,
  page: number = 1,
  limit: number = 6
) {
  const { data: session, status } = useSession()

  const [travelers, setTravelers] = useState<Traveler[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0 })

  useEffect(() => {
    const fetchTravelers = async () => {
      setLoading(true)
      setError(null)

      try {
        const params: any = {
          page: page.toString(),
          limit: limit.toString(),
        }

        if (filters) {
          if (filters.searchTerm) params.searchTerm = filters.searchTerm
          if (filters.destination) params.destination = filters.destination
          if (filters.travelType) params.travelType = filters.travelType
        }

        const response = await api.get('/travelPlan', { params })

        if (response.data?.meta) {
          setMeta(response.data.meta)
        }

        const mappedTravelers: Traveler[] = (response.data?.data || []).map(
          (plan: any) => {
            const user = plan.user

            let connectionStatus = null
            let connectionDirection = null

            if (user?.connectionInfo) {
              connectionStatus = user.connectionInfo.status
              connectionDirection = user.connectionInfo.direction
            }

            if (!connectionStatus && user) {
              const sentByCurrentUser = user.receivedConnections?.find(
                (conn: any) => conn.senderId === session?.user?.id
              )

              const receivedFromUser = user.sentConnections?.find(
                (conn: any) => conn.receiverId === session?.user?.id
              )

              if (sentByCurrentUser) {
                connectionStatus = sentByCurrentUser.status
                connectionDirection = 'sent'
              } else if (receivedFromUser) {
                connectionStatus = receivedFromUser.status
                connectionDirection = 'received'
              }
            }

            return {
              id: plan.id,
              userId: user?.id,
              name: user?.name || 'Unknown',
              avatar: user?.profileImage || '/default-avatar.png',
              coverImage: plan.image || '/default-cover.jpg',
              bio: plan.description || user?.bio || '',
              visitedCountries: user?.visitedCountries || [],
              profileImage: user?.profileImage,
              interests:
                user?.interests || (plan.travelType ? [plan.travelType] : []),
              rating: user?.rating || 0,
              online: user?.status === 'ACTIVE',
              verified: user?.role === 'ADMIN',
              handle: user?.email
                ? '@' + user.email.split('@')[0]
                : '@unknown',
              location: plan.destination || 'Unknown',
              travelType: plan.travelType || '',
              startDate: plan.startDate,
              endDate: plan.endDate,
              budget: plan.budget,

              receivedConnections: user?.receivedConnections || [],
              sentConnections: user?.sentConnections || [],

              connectionStatus,
              connectionDirection,

              user: user
                ? {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage,
                    bio: user.bio,
                    interests: user.interests,
                    role: user.role,
                    receivedConnections: user.receivedConnections || [],
                    sentConnections: user.sentConnections || [],
                    visitedCountries: user.visitedCountries,
                    status: user.status,
                    rating: user.rating,
                    connectionInfo: user.connectionInfo,
                    
                    // --- ADD THESE TWO LINES ---
                    premium: user.premium,
                    subscriptionType: user.subscriptionType,
                    // ---------------------------
                  }
                : undefined,
            }
          }
        )

        setTravelers(mappedTravelers)
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to fetch travelers'
        )
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      fetchTravelers()
    }
  }, [filters, page, limit, session?.user?.id, status])

  return { travelers, loading, error, meta }
}