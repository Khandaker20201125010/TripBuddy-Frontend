/* eslint-disable @typescript-eslint/no-explicit-any */
import { TravelerFilters } from '@/components/modules/ExploreTravelersContent/SearchFilters';
import { useEffect, useState } from 'react';


export function useMatchedTravelers(filters: TravelerFilters) {
  const [matchedTravelers, setTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravelers = async () => {
      setLoading(true);
      try {
        const queryObject: any = {};

        Object.entries(filters).forEach(([k, v]) => {
          if (v) queryObject[k] = v;
        });

        const query = new URLSearchParams(queryObject).toString();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travelPlan/match?${query}`);
        const result = await res.json();
        setTravelers(result.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch matchedTravelers');
      } finally {
        setLoading(false);
      }
    };

    fetchTravelers();
  }, [filters]);

  return { matchedTravelers, loading, error };
}
