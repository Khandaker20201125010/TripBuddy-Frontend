/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export function BuddyFilters({ onChange }: { onChange: (v: any) => void }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6 grid md:grid-cols-5 gap-4">
      <input
        placeholder="Where to?"
        className="border p-2 rounded text-sm"
        onChange={e => onChange((p: any) => ({ ...p, destination: e.target.value }))}
      />
      
      <div className="flex flex-col">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Start Date</label>
        <input 
          type="date" 
          className="border p-1 rounded text-sm"
          onChange={e => onChange((p: any) => ({ ...p, startDate: e.target.value }))} 
        />
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] text-gray-400 uppercase font-bold">End Date</label>
        <input 
          type="date" 
          className="border p-1 rounded text-sm"
          onChange={e => onChange((p: any) => ({ ...p, endDate: e.target.value }))} 
        />
      </div>

      <select
        className="border p-2 rounded text-sm"
        onChange={e => onChange((p: any) => ({ ...p, travelType: e.target.value }))}
      >
        <option value="">Any Vibe</option>
        <option value="Solo">Solo</option>
        <option value="Family">Family</option>
        <option value="Group">Group</option>
        <option value="Adventure">Adventure</option>
      </select>
      
      <button className="bg-orange-600 text-white rounded font-bold hover:bg-orange-700 transition-colors">
        Search
      </button>
    </div>
  );
}