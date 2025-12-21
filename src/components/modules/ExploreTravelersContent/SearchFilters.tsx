'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Compass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TravelerFilters {
  searchTerm?: string;
  destination?: string;
  travelType?: string; 
}

export function SearchFilters({ onChange }: { onChange: (filters: TravelerFilters) => void }) {
  const [localFilters, setLocalFilters] = useState<TravelerFilters>({
    searchTerm: '',
    destination: '',
    travelType: '',
  });

  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localFilters);
    }, 500);
    return () => clearTimeout(timer);
  }, [localFilters, onChange]);

  const toggleTag = (tag: string) => {
    const updatedTags = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];

    setActiveTags(updatedTags);
    setLocalFilters(prev => ({ ...prev, travelType: updatedTags.join(',') }));
  };

  const clearFilters = () => {
  const reset = { searchTerm: '', destination: '', travelType: '' };
  setLocalFilters(reset);
  setActiveTags([]);
  onChange(reset); // Force immediate update on reset
};

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search by name, email or bio..."
            className="h-12 text-base shadow-sm border-stone-200 pl-11"
            value={localFilters.searchTerm}
            onChange={(e) => setLocalFilters(p => ({...p, searchTerm: e.target.value}))}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:w-48">
             <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
             <Input 
                placeholder="Destination"
                className="h-12 pl-10"
                value={localFilters.destination}
                onChange={(e) => setLocalFilters(p => ({...p, destination: e.target.value}))}
             />
          </div>
          <Button variant="ghost" onClick={clearFilters} className="h-12">Reset</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-stone-500 flex items-center gap-1">
            <Compass className="h-4 w-4" /> Interests:
        </span>

        {['Solo', 'Family', 'Group', 'Couples', 'Adventure'].map((tag) => (
          <Badge
            key={tag}
            variant={activeTags.includes(tag) ? 'destructive' : 'secondary'}
            className="cursor-pointer transition-all px-3 py-1 hover:scale-105"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}