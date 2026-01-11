// frontend/components/location/NoLocationState.tsx
import { Globe, MapPin, Target } from "lucide-react";

interface NoLocationStateProps {
  isCurrentUser: boolean;
  isUpdating: boolean;
  onSetManual: () => void;
  onUseGPS: () => void;
}

export default function NoLocationState({
  isCurrentUser,
  isUpdating,
  onSetManual,
  onUseGPS
}: NoLocationStateProps) {
  return (
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
        <div className="flex gap-4">
          <button
            onClick={onSetManual}
            disabled={isUpdating}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Set Location
          </button>
          <button
            onClick={onUseGPS}
            disabled={isUpdating}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center gap-2"
          >
            <Target className="w-5 h-5" />
            Use GPS
          </button>
        </div>
      )}
    </div>
  );
}