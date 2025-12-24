import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface TrendingDestination {
  destination: string;
  count: number;
}

interface StatsData {
  travelers: number;
  destinations: number;
  tripsThisYear: number;
  trending: TrendingDestination[];
}

export const useTravelStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ensure this endpoint exists in your backend router
        const res = await api.get("/travelPlan/stats"); 
        
        // Adjust 'res.data.data' based on your API response structure (e.g. ApiResponse wrapper)
        setStats(res.data.data); 
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};