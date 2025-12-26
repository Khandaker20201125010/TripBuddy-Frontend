/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { TravelPlan } from '@/types/travel';
import api from '@/lib/axios';

export function useAllTravelPlans() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get("/travelPlan");
      
      // Extract data safely and ensure a consistent structure
      const rawData = res.data?.data || [];
      const transformedPlans = rawData.map((plan: any) => ({
        ...plan,
        user: plan.user || null, // Fallback to null if host user is missing
      }));
      
      setPlans(transformedPlans);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch travel plans";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPlans();
  }, [fetchAllPlans]);

  return { 
    plans, 
    loading, 
    error, 
    refetch: fetchAllPlans 
  };
}