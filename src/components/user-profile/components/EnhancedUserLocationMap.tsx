/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/components/EnhancedUserLocationMap.tsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { User } from "@/types/user";
import api from "@/lib/axios";

// Import sub-components
import ManualLocationModal from "./location/ManualLocationModal";
import MapHeader from "./location/MapHeader";
import AccuracyIndicator from "./location/AccuracyIndicator";
import ErrorDisplay from "./location/ErrorDisplay";
import LocationInfoFooter from "./location/LocationInfoFooter";
import NoLocationState from "./location/NoLocationState";
import LoadingState from "./location/LoadingState";

// Dynamic imports
const MapWrapper = dynamic(
  () => import("./MapWrapper"),
  { 
    ssr: false,
    loading: () => <LoadingState />
  }
);

interface UserLocationMapProps {
  userId: string;
  user?: User;
  isCurrentUser?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  locationName?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  locationUpdatedAt?: string;
  locationSource?: string;
  enableLiveLocation?: boolean;
}

export default function EnhancedUserLocationMap({ 
  userId, 
  user, 
  isCurrentUser = false 
}: UserLocationMapProps) {
  // State management
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<'exact' | 'approximate' | 'unknown'>('unknown');

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch location data
  const fetchUserLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/location/${userId}`);
      
      if (response.data.success && response.data.data) {
        const loc = response.data.data;
        setLocation(loc);
        updateLocationAccuracy(loc);
        
        if (loc.latitude && loc.longitude) {
          setMapCenter([loc.latitude, loc.longitude]);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch location:", err);
      setError(err.response?.data?.message || "Unable to load location");
      handleFallbackLocation();
    } finally {
      setLoading(false);
    }
  };

  // Determine location accuracy
  const updateLocationAccuracy = (loc: LocationData) => {
    if (loc.locationSource === 'browser' || loc.enableLiveLocation) {
      setLocationAccuracy('exact');
    } else if (loc.locationSource === 'ipapi' || loc.locationSource === 'ipwhois') {
      setLocationAccuracy('approximate');
    } else {
      setLocationAccuracy('unknown');
    }
  };

  // Fallback to user data
  const handleFallbackLocation = () => {
    if (user?.latitude && user?.longitude) {
      setMapCenter([user.latitude, user.longitude]);
      setLocation({
        latitude: user.latitude,
        longitude: user.longitude,
        locationName: user.locationName,
        city: user.city,
        country: user.country,
        profileImage: user.profileImage,
        locationSource: 'database'
      });
    }
  };

  // Initial load
  useEffect(() => {
    if (isClient) {
      fetchUserLocation();
    }
  }, [userId, isClient]);

  // GPS location request
  const requestCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsUpdating(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
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
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError(
          geoError.code === geoError.PERMISSION_DENIED 
            ? "Location permission denied. Please enable location access in browser settings."
            : "Unable to get your current location"
        );
        setIsUpdating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // Manual location save
  const handleManualLocationSave = async (locationData: { 
    country: string; 
    city: string; 
    latitude?: number; 
    longitude?: number 
  }) => {
    try {
      setIsUpdating(true);
      await api.post(`/location/${userId}/manual`, locationData);
      await fetchUserLocation();
      setShowManualModal(false);
    } catch (err: any) {
      console.error("Failed to set manual location:", err);
      setError(err.response?.data?.message || "Failed to set manual location");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper functions
  const refreshLocation = () => {
    setError(null);
    fetchUserLocation();
  };

  const dismissError = () => setError(null);

  // Loading state
  if (!isClient || loading) {
    return <LoadingState />;
  }

  const hasLocation = location?.latitude && location?.longitude;
  const locationName = location?.locationName || `${location?.city || 'Unknown'}, ${location?.country || 'Unknown'}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
      >
        {/* Map Header */}
        <MapHeader
          locationName={locationName}
          isCurrentUser={isCurrentUser}
          isUpdating={isUpdating}
          onRefresh={refreshLocation}
          onSetManual={() => setShowManualModal(true)}
          onUseGPS={requestCurrentLocation}
        />

        {/* Accuracy Indicator */}
        <AccuracyIndicator accuracy={locationAccuracy} />

        {/* Error Display */}
        <ErrorDisplay error={error} onDismiss={dismissError} />

        {/* Map Container */}
        <div className="h-96 w-full z-0">
          {hasLocation ? (
            <MapWrapper
              center={mapCenter}
              user={user}
              location={location}
            />
          ) : (
            <NoLocationState
              isCurrentUser={isCurrentUser}
              isUpdating={isUpdating}
              onSetManual={() => setShowManualModal(true)}
              onUseGPS={requestCurrentLocation}
            />
          )}
        </div>

        {/* Location Info Footer */}
        {hasLocation && (
          <LocationInfoFooter
            city={location.city}
            country={location.country}
            latitude={location.latitude}
            longitude={location.longitude}
            accuracy={locationAccuracy}
          />
        )}
      </motion.div>

      {/* Manual Location Modal */}
      <ManualLocationModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={handleManualLocationSave}
      />
    </>
  );
}