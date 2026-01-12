// frontend/components/location/CompactMapHeader.tsx
import { MapPin, RefreshCw, Settings, Target, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface CompactMapHeaderProps {
  locationName: string;
  isCurrentUser: boolean;
  isUpdating: boolean;
  onRefresh: () => void;
  onSetManual: () => void;
  onUseGPS: () => void;
}

export default function CompactMapHeader({
  locationName,
  isCurrentUser,
  isUpdating,
  onRefresh,
  onSetManual,
  onUseGPS
}: CompactMapHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-lg p-3 text-gray-800 shadow-lg border-b border-gray-200/50">
      <div className="flex items-center justify-between">
        {/* Location Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 p-1.5 gradient-sunset rounded-lg text-white">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{locationName || "Unknown location"}</p>
            <p className="text-xs text-gray-500">Live location tracking</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRefresh}
            disabled={isUpdating}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh location"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          </motion.button>

          {isCurrentUser && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSetManual}
                disabled={isUpdating}
                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                title="Set manual location"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onUseGPS}
                disabled={isUpdating}
                className="cursor-pointer p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-shadow disabled:opacity-50 flex items-center gap-1"
                title="Use current GPS location"
              >
                <Navigation className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">GPS</span>
              </motion.button>
            </>
          )}
        </div>
      </div>
      
      {/* Progress bar for updates */}
      {isUpdating && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
            className="h-full w-1/4 bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      )}
    </div>
  );
}