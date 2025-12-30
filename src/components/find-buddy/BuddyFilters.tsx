/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export function BuddyFilters({ onChange }: { onChange: (filters: any) => void }) {
  // 1. Store inputs locally first
  const [localFilters, setLocalFilters] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelType: ""
  });

  // 2. Update local state
  const handleInputChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 3. Pass DATA to parent only on button click
  const handleSearch = () => {
    onChange(localFilters); // <--- Passing the object, NOT a function
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6 grid md:grid-cols-5 gap-4 items-end">
      <div>
        <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Destination</label>
        <input
          placeholder="Where to?"
          className="border p-2 rounded text-sm w-full"
          value={localFilters.destination}
          onChange={(e) => handleInputChange("destination", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] text-gray-400 uppercase font-bold mb-1">Start Date</label>
        <input
          type="date"
          className="border p-2 rounded text-sm"
          value={localFilters.startDate}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] text-gray-400 uppercase font-bold mb-1">End Date</label>
        <input
          type="date"
          className="border p-2 rounded text-sm"
          value={localFilters.endDate}
          onChange={(e) => handleInputChange("endDate", e.target.value)}
        />
      </div>

      <div>
        <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Vibe</label>
        <select
          className="border p-2 rounded text-sm w-full"
          value={localFilters.travelType}
          onChange={(e) => handleInputChange("travelType", e.target.value)}
        >
          <option value="">Any Vibe</option>
          <option value="Solo">Solo</option>
          <option value="Family">Family</option>
          <option value="Group">Group</option>
          <option value="Couples">Couples</option>
          <option value="Adventure">Adventure</option>
        </select>
      </div>

      <button 
        onClick={handleSearch}
        className="bg-orange-600 text-white p-2 rounded font-bold hover:bg-orange-700 transition-colors h-[38px] w-full"
      >
        Search
      </button>
    </div>
  );
}