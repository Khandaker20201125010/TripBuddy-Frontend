/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // 1. Import NextAuth hook

export function useRecommendedTravelers() {
  const { data: session, status } = useSession(); // 2. Get session data
  const [recommendedTravelers, setRecommendedTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for session to load before fetching
    if (status === "loading") return;

    const fetchRecommended = async () => {
      setLoading(true);
      try {
        // 3. Get token from Session OR fall back to empty (backend might use cookies)
        // Note: Your authOptions maps token.accessToken to session.accessToken
        const token = (session as any)?.accessToken; 

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travelPlan/recommended`, {
           headers: {
             // If we have a session token, use it. Otherwise, send empty string.
             'Authorization': token ? `Bearer ${token}` : '',
             'Content-Type': 'application/json'
           },
           // 4. IMPORTANT: This allows the browser to send the 'accessToken' cookie 
           // that your backend set in the Login controller.
           credentials: 'include', 
        });
        
        const result = await res.json();
        
        if (!result.success) {
            // Use a soft error so we don't crash, just show nothing
            console.warn("Recommended API Error:", result.message);
            setRecommendedTravelers([]);
            return;
        }

        // 5. Handle Data Mapping
        let rawData = [];
        if (result?.data && Array.isArray(result.data)) {
           rawData = result.data;
        }

        const mapped = rawData.map((user: any) => ({
          id: user.id,
          name: user.name || 'Traveler',
          // Handle both Cloudinary URLs and local paths
          avatar: user.profileImage || '/default-avatar.png', 
          bio: user.bio || 'Ready to explore.',
          interests: user.interests || [],
          location: user.visitedCountries?.[0] || 'Global',
          rating: user.rating || 0,
        }));

        setRecommendedTravelers(mapped);
      } catch (err) {
        console.error("Recommended Hook Error:", err);
        setRecommendedTravelers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [session, status]); // Re-run when session changes

  return { recommendedTravelers, loading };
}