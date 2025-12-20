/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { TravelPlan, TravelPlanFormData } from '@/types/travel';
import api from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { getCookie } from '@/services/auth/tokenHandlers';

export function useMyTravelPlans() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [userPlans, setUserPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Public Plans
const fetchPlans = useCallback(async () => {
    try {
      const res = await api.get("/travelPlan");
      setPlans(res.data.data || []);
    } catch (err) {
      console.error("Public fetch error", err);
    }
  }, []);

  const fetchUserPlans = useCallback(async () => {
    // Check NextAuth first, then check manual cookie
    const token = (session as any)?.accessToken || await getCookie("accessToken");

    if (!token) return;

    try {
      const res = await api.get("/travelPlan/my-plans");
      setUserPlans(res.data.data || []);
    } catch (err) {
      console.error("Private fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchPlans();
    if (status !== 'loading') {
      fetchUserPlans();
    }
  }, [status, fetchPlans, fetchUserPlans]);

  const createPlans = async (data: TravelPlanFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) formData.append('file', value);
        else formData.append(key, String(value));
      }
    });
    const res = await api.post("/travelPlan", formData, { headers: { "Content-Type": "multipart/form-data" } });
    const newPlan = res.data.data;
    setPlans(prev => [newPlan, ...prev]);
    setUserPlans(prev => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = async (id: string, data: TravelPlanFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) formData.append('file', value);
        else formData.append(key, String(value));
      }
    });
    const res = await api.patch(`/travelPlan/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    const updated = res.data.data;
    setPlans(prev => prev.map(p => p.id === id ? updated : p));
    setUserPlans(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deletePlan = async (id: string) => {
    await api.delete(`/travelPlan/${id}`);
    setPlans(prev => prev.filter(p => p.id !== id));
    setUserPlans(prev => prev.filter(p => p.id !== id));
  };
 const getSinglePlan = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/travelPlan/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Fetch single plan error", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  

  return { plans, userPlans, loading, createPlans, updatePlan, deletePlan, getSinglePlan,refreshPlans: fetchUserPlans };
}