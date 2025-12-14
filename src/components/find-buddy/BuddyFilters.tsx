/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export function BuddyFilters({ onChange }: { onChange: (v: any) => void }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-4">
      <input
        placeholder="Destination"
        className="border p-2 rounded"
        onChange={e => onChange((p: any) => ({ ...p, destination: e.target.value }))}
      />
      <input type="date" className="border p-2 rounded"
        onChange={e => onChange((p: any) => ({ ...p, startDate: e.target.value }))} />
      <select
        className="border p-2 rounded"
        onChange={e => onChange((p: any) => ({ ...p, travelType: e.target.value }))}
      >
        <option value="">Travel Type</option>
        <option value="Solo">Solo</option>
        <option value="Friends">Friends</option>
        <option value="Family">Family</option>
        <option value="Beach">Beach</option>
      </select>
      <button className="bg-orange-600 text-white rounded px-4">
        Match
      </button>
    </div>
  );
}
