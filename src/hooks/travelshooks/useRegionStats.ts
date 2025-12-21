// hooks/useRegionStats.ts
import { useEffect, useState } from 'react';

export function useRegionStats() {
    const [regions, setRegions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/stats/regions`);
                const data = await res.json();
                if (data.success) setRegions(data.data);
            } catch (error) {
                console.error("Failed to load region stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return { regions, loading };
}