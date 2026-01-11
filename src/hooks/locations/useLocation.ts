/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/hooks/useLocation.ts
import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface LocationData {
  latitude: number;
  longitude: number;
  locationName?: string;
  city?: string;
  country?: string;
  locationSource?: string;
  enableLiveLocation?: boolean;
}

interface UseLocationProps {
  userId: string;
  user?: any;
}

export function useLocation({ userId, user }: UseLocationProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<'exact' | 'approximate' | 'unknown'>('unknown');

  const fetchUserLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/location/${userId}`);
      
      if (response.data.success && response.data.data) {
        const loc = response.data.data;
        setLocation(loc);
        updateLocationAccuracy(loc);
      }
    } catch (err: any) {
      console.error("Failed to fetch location:", err);
      setError(err.response?.data?.message || "Unable to load location");
      handleFallbackLocation();
    } finally {
      setLoading(false);
    }
  };

  const updateLocationAccuracy = (loc: LocationData) => {
    if (loc.locationSource === 'browser' || loc.enableLiveLocation) {
      setLocationAccuracy('exact');
    } else if (loc.locationSource === 'ipapi' || loc.locationSource === 'ipwhois') {
      setLocationAccuracy('approximate');
    } else {
      setLocationAccuracy('unknown');
    }
  };

  const handleFallbackLocation = () => {
    if (user?.latitude && user?.longitude) {
      setLocation({
        latitude: user.latitude,
        longitude: user.longitude,
        locationName: user.locationName,
        city: user.city,
        country: user.country,
        locationSource: 'database'
      });
    }
  };

  const requestCurrentLocation = async (): Promise<{latitude: number, longitude: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        resolve(null);
        return;
      }

      setIsUpdating(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsUpdating(false);
          resolve({ latitude, longitude });
        },
        (geoError) => {
          console.error("Geolocation error:", geoError);
          setError(
            geoError.code === geoError.PERMISSION_DENIED 
              ? "Location permission denied. Please enable location access in browser settings."
              : "Unable to get your current location"
          );
          setIsUpdating(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    try {
      setIsUpdating(true);
      await api.post(`/location/${userId}/update`, {
        latitude,
        longitude
      });
      await fetchUserLocation();
      setError(null);
      setLocationAccuracy('exact');
    } catch (err: any) {
      console.error("Failed to update location:", err);
      setError(err.response?.data?.message || "Failed to update location");
    } finally {
      setIsUpdating(false);
    }
  };

  const setManualLocation = async (country: string, city: string, latitude?: number, longitude?: number) => {
    try {
      setIsUpdating(true);
      await api.post(`/location/${userId}/manual`, {
        country,
        city,
        latitude,
        longitude
      });
      await fetchUserLocation();
    } catch (err: any) {
      console.error("Failed to set manual location:", err);
      setError(err.response?.data?.message || "Failed to set manual location");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, [userId]);

  return {
    location,
    loading,
    error,
    isUpdating,
    locationAccuracy,
    fetchUserLocation,
    updateLocation,
    setManualLocation,
    requestCurrentLocation,
    setError,
    setLocationAccuracy
  };
}