// frontend/components/EnhancedUserLocationMapSimple.tsx
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { User } from "@/types/user";

// Import components and hooks

import ManualLocationModal from "./location/ManualLocationModal";
import MapHeader from "./location/MapHeader";
import AccuracyIndicator from "./location/AccuracyIndicator";
import ErrorDisplay from "./location/ErrorDisplay";
import LocationInfoFooter from "./location/LocationInfoFooter";
import NoLocationState from "./location/NoLocationState";
import LoadingState from "./location/LoadingState";
import { useLocation } from "@/hooks/locations/useLocation";

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

export default function EnhancedUserLocationMapSimple({ 
  userId, 
  user, 
  isCurrentUser = false 
}: UserLocationMapProps) {
  const [showManualModal, setShowManualModal] = useState(false);
  
  const {
    location,
    loading,
    error,
    isUpdating,
    locationAccuracy,
    fetchUserLocation,
    updateLocation,
    setManualLocation,
    requestCurrentLocation,
    setError
  } = useLocation({ userId, user });

  const handleUseGPS = async () => {
    const coords = await requestCurrentLocation();
    if (coords) {
      await updateLocation(coords.latitude, coords.longitude);
    }
  };

  const handleManualSave = async (data: { 
    country: string; 
    city: string; 
    latitude?: number; 
    longitude?: number 
  }) => {
    await setManualLocation(data.country, data.city, data.latitude, data.longitude);
    setShowManualModal(false);
  };

  const locationName = location?.locationName || 
    `${location?.city || 'Unknown'}, ${location?.country || 'Unknown'}`;
  
  const hasLocation = location?.latitude && location?.longitude;
  const mapCenter: [number, number] = hasLocation 
    ? [location.latitude, location.longitude]
    : [23.8103, 90.4125]; // Default to Dhaka

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
      >
        <MapHeader
          locationName={locationName}
          isCurrentUser={isCurrentUser}
          isUpdating={isUpdating}
          onRefresh={fetchUserLocation}
          onSetManual={() => setShowManualModal(true)}
          onUseGPS={handleUseGPS}
        />

        <AccuracyIndicator accuracy={locationAccuracy} />

        <ErrorDisplay 
          error={error} 
          onDismiss={() => setError(null)} 
        />

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
              onUseGPS={handleUseGPS}
            />
          )}
        </div>

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

      <ManualLocationModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={handleManualSave}
      />
    </>
  );
}