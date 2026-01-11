// frontend/components/location/MapHeader.tsx
import { MapPin, RefreshCw, Settings, Target } from "lucide-react";

interface MapHeaderProps {
  locationName: string;
  isCurrentUser: boolean;
  isUpdating: boolean;
  onRefresh: () => void;
  onSetManual: () => void;
  onUseGPS: () => void;
}

export default function MapHeader({
  locationName,
  isCurrentUser,
  isUpdating,
  onRefresh,
  onSetManual,
  onUseGPS
}: MapHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-sm p-4 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Location Map</h3>
            <p className="text-sm text-blue-100">
              {locationName || "Location not available"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {isCurrentUser && (
            <>
              <button
                onClick={onSetManual}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm disabled:opacity-50"
              >
                <Settings className="w-4 h-4" />
                Set Location
              </button>
              
              <button
                onClick={onUseGPS}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Target className="w-4 h-4" />
                Use GPS
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}