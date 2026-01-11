// frontend/components/location/LoadingState.tsx
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="h-96 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading location...</p>
      </div>
    </div>
  );
}