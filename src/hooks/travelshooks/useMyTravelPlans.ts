/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getPlanStatus } from "@/components/shared/getPlanStatus";
import api from "@/lib/axios";
import { TravelPlan, TravelPlanFormData } from "@/types/travel";
import { useEffect, useState } from "react";

export function useMyTravelPlans() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/travelPlan/my");
      setPlans(res.data.data);
    } finally {
      setLoading(false);
    }
  };

const createPlans = async (data: TravelPlanFormData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "image" && value instanceof File) {
        formData.append("file", value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const res = await api.post("/travelPlan", formData);

  const planWithStatus = {
    ...res.data.data,
    status: getPlanStatus(
      res.data.data.startDate,
      res.data.data.endDate
    ),
  };

  setPlans(prev => [planWithStatus, ...prev]);
};

 const updatePlan = async (id: string, data: TravelPlanFormData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const res = await api.patch(`/travelPlan/${id}`, formData);

  const updatedPlan = {
    ...res.data.data,
    status: getPlanStatus(
      res.data.data.startDate,
      res.data.data.endDate
    ),
  };

  setPlans(prev =>
    prev.map(p => (p.id === id ? updatedPlan : p))
  );
};

  const deletePlan = async (id: string) => {
    await api.delete(`/travelPlan/${id}`);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, createPlans, updatePlan, deletePlan };
}
