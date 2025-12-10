'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Compass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TravelerFilters {
  searchTerm?: string;
  destination?: string;
  travelType?: string; // supports multiple comma-separated tags
  startDate?: string;
  endDate?: string;
}

interface Props {
  onChange: (filters: TravelerFilters) => void;
}

export function SearchFilters({ onChange }: Props) {
  const [localFilters, setLocalFilters] = useState<TravelerFilters>({
    searchTerm: '',
    destination: '',
    travelType: '',
  });

  const [activeTags, setActiveTags] = useState<string[]>([]); // Track active tags

  // UI → backend mapping
  const updateFilter = (uiKey: string, value: string) => {
    let backendKey: keyof TravelerFilters;

    switch (uiKey) {
      case 'search':
        backendKey = 'searchTerm';
        break;
      case 'interest':
        backendKey = 'travelType';
        break;
      case 'destination':
        backendKey = 'destination';
        break;
      default:
        backendKey = uiKey as keyof TravelerFilters;
    }

    const updated = { ...localFilters, [backendKey]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    let updatedTags: string[];

    if (activeTags.includes(tag)) {
      // Remove tag
      updatedTags = activeTags.filter(t => t !== tag);
    } else {
      // Add tag
      updatedTags = [...activeTags, tag];
    }

    setActiveTags(updatedTags);

    // Update backend travelType as comma-separated string
    updateFilter('interest', updatedTags.join(','));
  };

  return (
    <div className="space-y-6">
      {/* Search + Quick Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search destinations, travel types, interests..."
            className="h-12 text-base shadow-sm border-stone-200 pl-11"
            value={localFilters.searchTerm || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Button
            variant={localFilters.destination === 'Japan' ? 'destructive' : 'outline'}
            className="rounded-full border-stone-200 text-stone-600"
            onClick={() =>
              updateFilter('destination', localFilters.destination === 'Japan' ? '' : 'Japan')
            }
          >
            <MapPin className="h-4 w-4 mr-2" /> Destination
          </Button>

          <Button
            variant={activeTags.includes('Adventure') ? 'destructive' : 'outline'}
            className="rounded-full border-stone-200 text-stone-600"
            onClick={() => toggleTag('Adventure')}
          >
            <Compass className="h-4 w-4 mr-2" /> Interests
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-stone-500 mr-2">Popular:</span>

        {['Photography', 'Solo Travel', 'Foodie', 'Culture', 'Hiking'].map(
          (tag) => (
            <Badge
              key={tag}
              variant={activeTags.includes(tag) ? 'destructive' : 'secondary'}
              className="cursor-pointer transition-colors px-3 py-1"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          )
        )}
      </div>
    </div>
  );
}
