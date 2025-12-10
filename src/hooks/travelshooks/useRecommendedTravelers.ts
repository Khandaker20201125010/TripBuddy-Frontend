import { useEffect, useState } from 'react';
import { Traveler } from '@/components/shared/data/mockTravelers';

export function useRecommendedTravelers() {
  const [recommendedTravelers, setRecommendedTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedTravelers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travelers/recommended`);
        const data = await res.json();
        setRecommendedTravelers(data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recommended travelers');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedTravelers();
  }, []);

  return { recommendedTravelers, loading, error };
}
