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
      
      // CRITICAL: Log exact response structure
      console.log("🔍 FULL API RESPONSE:", {
        status: res.status,
        dataStructure: {
          hasData: !!res.data.data,
          dataIsArray: Array.isArray(res.data.data),
          arrayLength: res.data.data?.length || 0
        },
        firstPlanStructure: res.data.data?.[0] ? {
          keys: Object.keys(res.data.data[0]),
          hasUserKey: 'user' in res.data.data[0],
          userValue: res.data.data[0].user,
          userIdValue: res.data.data[0].userId
        } : 'No plans'
      });
      
      // Transform the data if needed
      const plansData = (res.data.data || []).map((plan: any) => {
        // Log each plan's structure
        console.log(`📋 Plan "${plan.destination}":`, {
          hasUser: 'user' in plan,
          user: plan.user,
          userId: plan.userId
        });
        
        return {
          ...plan,
          user: plan.user || null, // Ensure user is at least null
        };
      });
      
      console.log("💾 Setting plans:", plansData.length);
      setPlans(plansData);
      
    } catch (err: any) {
      console.error("❌ Error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.message);
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