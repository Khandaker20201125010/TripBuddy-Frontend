// frontend/components/location/LocationInfoFooter.tsx

interface LocationInfoFooterProps {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  accuracy: 'exact' | 'approximate' | 'unknown';
}

export default function LocationInfoFooter({
  city,
  country,
  latitude,
  longitude,
  accuracy
}: LocationInfoFooterProps) {
  const getSourceInfo = () => {
    switch (accuracy) {
      case 'exact':
        return { label: 'GPS', color: 'bg-green-500' };
      case 'approximate':
        return { label: 'IP-Based', color: 'bg-amber-500' };
      default:
        return { label: 'Manual', color: 'bg-gray-400' };
    }
  };

  const sourceInfo = getSourceInfo();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm p-4 border-t border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600 text-xs uppercase tracking-wider">City</p>
          <p className="font-medium">{city || "Unknown"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs uppercase tracking-wider">Country</p>
          <p className="font-medium">{country || "Unknown"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs uppercase tracking-wider">Coordinates</p>
          <p className="font-medium font-mono text-xs">
            {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-xs uppercase tracking-wider">Source</p>
          <p className="font-medium">
            <span className="inline-flex items-center gap-1">
              <span className={`w-2 h-2 ${sourceInfo.color} rounded-full ${accuracy === 'exact' ? 'animate-pulse' : ''}`}></span>
              {sourceInfo.label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}