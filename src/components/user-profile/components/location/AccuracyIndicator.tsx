// frontend/components/location/AccuracyIndicator.tsx
import { AlertCircle } from "lucide-react";

interface AccuracyIndicatorProps {
  accuracy: 'exact' | 'approximate' | 'unknown';
}

export default function AccuracyIndicator({ accuracy }: AccuracyIndicatorProps) {
  if (accuracy !== 'approximate') return null;

  return (
    <div className="absolute top-20 left-4 right-4 z-10 bg-amber-50 border border-amber-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-medium">Approximate Location</p>
          <p className="text-amber-700 text-sm">
            This location is based on your IP address. For exact location, 
            enable GPS or set your location manually.
          </p>
        </div>
      </div>
    </div>
  );
}