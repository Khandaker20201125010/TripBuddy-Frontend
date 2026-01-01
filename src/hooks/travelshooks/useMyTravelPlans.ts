/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
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
    
    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          // Append image file
          formData.append('file', value);
        } else if (key === 'budget') {
          // Ensure budget is a number
          formData.append(key, String(Number(value) || 0));
        } else if (key === 'visibility') {
          // Handle boolean visibility
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Set proper headers for file upload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${(session as any)?.accessToken || await getCookie("accessToken")}`
      }
    };

    try {
      const res = await api.post("/travelPlan", formData, config);
      const newPlan = res.data.data;
      
      // Update local state
      setPlans(prev => [newPlan, ...prev]);
      setUserPlans(prev => [newPlan, ...prev]);
      
      return newPlan;
    } catch (error) {
      console.error("Create plan error:", error);
      throw error;
    }
  };

  const updatePlan = async (id: string, data: TravelPlanFormData) => {
    const formData = new FormData();
    
    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('file', value);
        } else if (key === 'budget') {
          formData.append(key, String(Number(value) || 0));
        } else if (key === 'visibility') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Set proper headers for file upload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${(session as any)?.accessToken || await getCookie("accessToken")}`
      }
    };

    try {
      const res = await api.patch(`/travelPlan/${id}`, formData, config);
      const updated = res.data.data;
      
      // Update local state
      setPlans(prev => prev.map(p => p.id === id ? updated : p));
      setUserPlans(prev => prev.map(p => p.id === id ? updated : p));
      
      return updated;
    } catch (error) {
      console.error("Update plan error:", error);
      throw error;
    }
  };

  const deletePlan = async (id: string) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${(session as any)?.accessToken || await getCookie("accessToken")}`
      }
    };

    await api.delete(`/travelPlan/${id}`, config);
    
    // Update local state
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

  return { 
    plans, 
    userPlans, 
    loading, 
    createPlans, 
    updatePlan, 
    deletePlan, 
    getSinglePlan, 
    refreshPlans: fetchUserPlans 
  };
}