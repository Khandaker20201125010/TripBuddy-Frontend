/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useRecommendedTravelers() {
  const { data: session, status } = useSession();
  const [recommendedTravelers, setRecommendedTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommended = useCallback(async () => {
    // Reset states
    setLoading(true);
    setError(null);
    
    // Don't fetch if user is not authenticated
    if (status !== 'authenticated' || !session) {
      setRecommendedTravelers([]);
      setLoading(false);
      return;
    }

    try {
      const token = (session as any)?.accessToken;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travelPlan/recommended`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      // Check if response is OK
      if (!res.ok) {
        // Handle 401/403 - session expired
        if (res.status === 401 || res.status === 403) {
          setError('Session expired. Please login again.');
          setRecommendedTravelers([]);
          return;
        }
        // Handle 500 errors - server error
        if (res.status === 500) {
          setError('Unable to load recommendations at this time.');
          setRecommendedTravelers([]);
          return;
        }
        // Handle other errors
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      
      if (!result.success) {
        // Use a soft error so we don't crash, just show nothing
        console.warn("Recommended API Error:", result.message);
        setRecommendedTravelers([]);
        return;
      }

      // Handle Data Mapping
      let rawData = [];
      if (result?.data && Array.isArray(result.data)) {
        rawData = result.data;
      }

      const mapped = rawData.map((user: any) => ({
        id: user.id,
        name: user.name || 'Traveler',
        avatar: user.profileImage || '/default-avatar.png',
        bio: user.bio || 'Ready to explore.',
        interests: user.interests || [],
        location: user.visitedCountries?.[0] || 'Global',
        rating: user.rating || 0,
      }));

      setRecommendedTravelers(mapped);
    } catch (err: any) {
      console.error("Recommended Hook Error:", err);
      setError(err.message || 'Failed to load recommendations');
      setRecommendedTravelers([]);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  // Initial fetch - only when authenticated
  useEffect(() => {
    // If session is still loading, wait
    if (status === 'loading') {
      return;
    }

    if (status === 'authenticated' && session) {
      fetchRecommended();
    } else {
      // Clear recommendations when not authenticated
      setRecommendedTravelers([]);
      setLoading(false);
      setError(null);
    }
  }, [fetchRecommended, session, status]);

  return { 
    recommendedTravelers, 
    loading, 
    error,
    isAuthenticated: status === 'authenticated',
    status // Add status for finer control
  };
}