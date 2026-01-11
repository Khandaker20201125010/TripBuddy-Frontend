// frontend/components/location/ErrorDisplay.tsx
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="absolute top-24 left-4 right-4 z-10 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
}