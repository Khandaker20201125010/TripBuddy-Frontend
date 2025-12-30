/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/axios'
import Swal from 'sweetalert2'
import { connectionManager } from './connectionManager'
import { useSession } from 'next-auth/react'

// ================= TYPES =================

export interface ConnectionRequest {
  id: string
  status: string
  sender: {
    id: string
    name: string
    profileImage: string
    email?: string
  }
  createdAt: string
}

export interface TripRequest {
  id: string
  status: string
  user: {
    id: string
    name: string
    profileImage: string
    email?: string
  }
  travelPlan: {
    id: string
    destination: string
    startDate: string
    endDate?: string
  }
  createdAt: string
}

// ================= HOOK =================

export const useNotifications = () => {
  const { data: session, status } = useSession()
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([])
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    // Don't fetch if user is not authenticated or session is loading
    if (status !== 'authenticated' || !session) {
      setConnectionRequests([])
      setTripRequests([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // ---------- CONNECTION REQUESTS ----------
      const connResponse = await api.get('/connections/incoming')

      if (connResponse.data?.success) {
        setConnectionRequests(connResponse.data.data || [])
      }

      // ---------- TRIP REQUESTS ----------
      const tripResponse = await api.get('/travelPlan/my-plans')

      if (tripResponse.data?.success && tripResponse.data.data) {
        const tripRequestsData: TripRequest[] = []

        tripResponse.data.data.forEach((plan: any) => {
          if (Array.isArray(plan.buddies)) {
            plan.buddies.forEach((buddy: any) => {
              if (buddy.status === 'PENDING') {
                tripRequestsData.push({
                  id: buddy.id,
                  status: buddy.status,
                  user: {
                    id: buddy.user?.id || '',
                    name: buddy.user?.name || 'Unknown Traveler',
                    profileImage: buddy.user?.profileImage || '',
                    email: buddy.user?.email || '',
                  },
                  travelPlan: {
                    id: plan.id,
                    destination: plan.destination,
                    startDate: plan.startDate,
                    endDate: plan.endDate,
                  },
                  createdAt: buddy.createdAt || new Date().toISOString(),
                })
              }
            })
          }
        })

        setTripRequests(tripRequestsData)
      }
    } catch (err: any) {
      // Handle 401 Unauthorized (token expired/invalid)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please login again.')
        setConnectionRequests([])
        setTripRequests([])
      } else {
        // Don't show error for network issues or temporary failures
        console.error('Error fetching notifications:', err)
        setConnectionRequests([])
        setTripRequests([])
      }
    } finally {
      setLoading(false)
    }
  }, [session, status])

  // Initial fetch - only when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchNotifications()
    } else {
      // Clear notifications when not authenticated
      setConnectionRequests([])
      setTripRequests([])
    }
  }, [fetchNotifications, session, status])

  // Poll every 30 seconds - only when authenticated
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    if (status === 'authenticated' && session) {
      intervalId = setInterval(fetchNotifications, 30000)
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchNotifications, session, status])

  // ================= ACTIONS =================

  const handleConnectionAction = async (
    connectionId: string,
    actionStatus: 'ACCEPTED' | 'REJECTED'
  ) => {
    // Don't proceed if not authenticated
    if (!session) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication required',
        text: 'Please login to perform this action',
        confirmButtonText: 'Login',
      }).then(() => {
        window.location.href = '/login'
      })
      return
    }

    try {
      const response = await api.patch(`/connections/respond/${connectionId}`, {
        status: actionStatus,
      })

      // Optimistically update UI
      setConnectionRequests(prev =>
        prev.filter(req => req.id !== connectionId)
      )

      const connection = response.data?.data
      if (connection) {
        connectionManager.notify(connection.senderId, {
          userId: connection.receiverId,
          status: actionStatus,
          direction: 'sent',
          connectionId: connection.id,
        })

        connectionManager.notify(connection.receiverId, {
          userId: connection.senderId,
          status: actionStatus,
          direction: 'received',
          connectionId: connection.id,
        })
      }

      Swal.fire({
        icon: 'success',
        title:
          actionStatus === 'ACCEPTED'
            ? 'Connection accepted!'
            : 'Request declined',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })

      // Refresh notifications after a delay
      setTimeout(fetchNotifications, 1000)
    } catch (err: any) {
      // If error is due to authentication, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        Swal.fire({
          icon: 'warning',
          title: 'Session expired',
          text: 'Please login again',
          confirmButtonText: 'Login',
        }).then(() => {
          window.location.href = '/login'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            err.response?.data?.message ||
            err.message ||
            'Could not process connection request',
        })
      }
    }
  }

  const handleTripAction = async (
    buddyId: string,
    actionStatus: 'APPROVED' | 'REJECTED'
  ) => {
    // Don't proceed if not authenticated
    if (!session) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication required',
        text: 'Please login to perform this action',
        confirmButtonText: 'Login',
      }).then(() => {
        window.location.href = '/login'
      })
      return
    }

    try {
      await api.patch(`/travelPlan/request-status/${buddyId}`, { status: actionStatus })

      // Optimistically update UI
      setTripRequests(prev => prev.filter(req => req.id !== buddyId))

      Swal.fire({
        icon: 'success',
        title: `Request ${actionStatus.toLowerCase()} successfully`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })

      // Refresh notifications after a delay
      setTimeout(fetchNotifications, 1000)
    } catch (err: any) {
      // If error is due to authentication, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        Swal.fire({
          icon: 'warning',
          title: 'Session expired',
          text: 'Please login again',
          confirmButtonText: 'Login',
        }).then(() => {
          window.location.href = '/login'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            err.response?.data?.message ||
            err.message ||
            'Could not process trip request',
        })
      }
    }
  }

  const totalNotifications = connectionRequests.length + tripRequests.length

  return {
    connectionRequests,
    tripRequests,
    loading,
    error,
    totalNotifications,
    handleConnectionAction,
    handleTripAction,
    refresh: fetchNotifications,
    isAuthenticated: status === 'authenticated',
  }
}