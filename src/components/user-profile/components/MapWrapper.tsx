/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/components/profile/MapWrapper.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { User } from "@/types/user";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

// Custom icon
const createUserIcon = (profileImage?: string): L.DivIcon => {
  if (profileImage) {
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img src="${profileImage}" alt="User" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48]
    });
  }
  
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white shadow-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Component to center map
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapWrapperProps {
  center: [number, number];
  user?: User;
  location: {
    latitude: number;
    longitude: number;
    locationName?: string;
    city?: string;
    country?: string;
    profileImage?: string;
  } | null;
}

export default function MapWrapper({ center, user, location }: MapWrapperProps) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full"
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <ChangeView center={center} zoom={12} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker 
        position={center} 
        icon={createUserIcon(location?.profileImage || user?.profileImage)}
      >
        <Popup>
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {location?.locationName || "Current location"}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Latitude:</span>
                  <p className="font-mono">{location?.latitude?.toFixed(6)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Longitude:</span>
                  <p className="font-mono">{location?.longitude?.toFixed(6)}</p>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}