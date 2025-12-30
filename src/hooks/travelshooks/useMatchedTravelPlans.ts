/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { TravelPlan } from "@/types/travel";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const useMatchedTravelPlans = (
  filters: Record<string, any>, 
  page: number = 1, 
  limit: number = 6,
  sortBy: string = "Best Match" 
) => {
  const [data, setData] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      setLoading(true);
      try {
        // 1. CLEAN THE FILTERS: Remove empty strings, nulls, or undefined values
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );

        const res = await api.get("/travelPlan/match", {
          params: { 
            ...cleanFilters, // Send cleaned filters
            page, 
            limit, 
            sortBy 
          },
        });

        if (isMounted) {
          const responseData = res.data?.data || [];
          const responseMeta = res.data?.meta || res.data?.data?.meta;

          setData(responseData);

          if (responseMeta) {
            setPagination({
              currentPage: Number(responseMeta.page),
              totalPages: Number(responseMeta.totalPages),
              totalItems: Number(responseMeta.total),
            });
          }
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlans();

    return () => { isMounted = false; };
  }, [filters, page, limit, sortBy]); 

  return { data, loading, pagination };
};