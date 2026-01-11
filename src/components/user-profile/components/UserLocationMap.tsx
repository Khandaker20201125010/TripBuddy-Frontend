/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { User } from "@/types/user";
import api from "@/lib/axios";
import { Loader2, Navigation, MapPin, Globe, RefreshCw } from "lucide-react";

// Create a client-side only map wrapper
const MapWrapper = dynamic(
  () => import("./MapWrapper"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
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
}

export default function UserLocationMap({ userId, user, isCurrentUser = false }: UserLocationMapProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // London default
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user location
  const fetchUserLocation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/location/${userId}`);
      
      if (response.data.data) {
        const loc = response.data.data;
        setLocation(loc);
        
        if (loc.latitude && loc.longitude) {
          setMapCenter([loc.latitude, loc.longitude]);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch location:", err);
      setError(err.response?.data?.message || "Unable to load location");
      
      // Fallback to user data if available
      if (user?.latitude && user?.longitude) {
        setMapCenter([user.latitude, user.longitude]);
        setLocation({
          latitude: user.latitude,
          longitude: user.longitude,
          locationName: user.locationName,
          city: user.city,
          country: user.country,
          profileImage: user.profileImage
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchUserLocation();
    }
  }, [userId, isClient]);

  // Request browser geolocation
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
          // Update location in backend
          await api.post(`/location/${userId}/update`, {
            latitude,
            longitude
          });
          
          // Refresh location data
          await fetchUserLocation();
          
          setError(null);
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
            ? "Location permission denied. Please enable location access."
            : "Unable to get your current location"
        );
        setIsUpdating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const refreshLocation = () => {
    setError(null);
    fetchUserLocation();
  };

  if (!isClient || loading) {
    return (
      <div className="h-96 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading location...</p>
        </div>
      </div>
    );
  }

  const hasLocation = location?.latitude && location?.longitude;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
    >
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-sm p-4 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Location Map</h3>
              <p className="text-sm text-blue-100">
                {hasLocation 
                  ? (location.locationName || `${location.city || 'Unknown'}, ${location.country || 'Unknown'}`)
                  : "Location not available"
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={refreshLocation}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {isCurrentUser && (
              <button
                onClick={requestCurrentLocation}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Navigation className="w-4 h-4" />
                Use My Location
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-4 right-4 z-10 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="h-96 w-full z-0">
        {hasLocation ? (
          <MapWrapper
            center={mapCenter}
            user={user}
            location={location}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <Globe className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Location Available</h3>
            <p className="text-gray-600 text-center mb-6">
              {isCurrentUser 
                ? "Your location hasn't been set yet. Click below to add your location."
                : "This user hasn't shared their location yet."
              }
            </p>
            {isCurrentUser && (
              <button
                onClick={requestCurrentLocation}
                disabled={isUpdating}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                {isUpdating ? "Detecting..." : "Add My Location"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Location Info Footer */}
      {hasLocation && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider">City</p>
              <p className="font-medium">{location.city || "Unknown"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider">Country</p>
              <p className="font-medium">{location.country || "Unknown"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider">Coordinates</p>
              <p className="font-medium font-mono text-xs">
                {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider">Status</p>
              <p className="font-medium">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}