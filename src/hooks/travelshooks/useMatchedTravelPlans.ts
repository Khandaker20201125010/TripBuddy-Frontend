import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { TravelPlan } from "@/types/travel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMatchedTravelPlans = (filters: Record<string, any>) => {
  const [data, setData] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await api.get("/travelPlan/match", {
          params: filters,
        });

        if (isMounted) {
          setData(res.data.data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPlans();

    return () => {
      isMounted = false; // ✅ prevents state update on unmount
    };
  }, [filters]); // ✅ stable dependency

  return { data, loading };
};
