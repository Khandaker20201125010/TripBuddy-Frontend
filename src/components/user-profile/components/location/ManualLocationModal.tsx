// frontend/components/location/ManualLocationModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";

interface ManualLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { country: string; city: string; latitude?: number; longitude?: number }) => void;
}

export default function ManualLocationModal({ isOpen, onClose, onSave }: ManualLocationModalProps) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [useGPS, setUseGPS] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSave({
          country,
          city,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGpsLoading(false);
        onClose();
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get current location. Please enter manually.");
        setGpsLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (useGPS) {
        getCurrentLocation();
      } else {
        await onSave({ country, city });
        onClose();
      }
    } catch (error) {
      console.error("Failed to save location:", error);
      alert("Failed to save location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Set Your Location</h3>
            <p className="text-sm text-gray-600">Help us show your accurate location</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Bangladesh"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Dhaka"
              required
            />
          </div>

          <div className="flex items-center gap-3 py-3">
            <input
              type="checkbox"
              id="useGPS"
              checked={useGPS}
              onChange={(e) => setUseGPS(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="useGPS" className="text-sm text-gray-700">
              Use my current GPS location for exact coordinates
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || gpsLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading || gpsLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {gpsLoading ? "Getting location..." : "Saving..."}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Location
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}