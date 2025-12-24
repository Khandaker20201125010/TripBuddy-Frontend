/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Compass, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    }, 300); // Reduced debounce time
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
    onChange(reset);
  };

  const travelTypes = [
    { label: 'Solo', emoji: '👤' },
    { label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { label: 'Group', emoji: '👥' },
    { label: 'Couples', emoji: '💑' },
    { label: 'Adventure', emoji: '🏔️' },
    { label: 'Luxury', emoji: '✨' },
    { label: 'Backpacking', emoji: '🎒' },
    { label: 'Business', emoji: '💼' },
  ];

  const hasActiveFilters = activeTags.length > 0 || localFilters.searchTerm || localFilters.destination;

  return (
    <div className="space-y-6 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-stone-200/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-stone-600" />
          <h3 className="text-lg font-semibold text-stone-800">Find Travelers</h3>
          {hasActiveFilters && (
            <Badge variant="outline" className="ml-2 bg-stone-50">
              {activeTags.length} filter{activeTags.length !== 1 ? 's' : ''} active
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-stone-500 hover:text-stone-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search by name/email/bio */}
        <div className="relative group">
          <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
          <Input
            placeholder="Name, email, or bio..."
            className="h-12 text-base pl-11 border-stone-200 bg-white/80 focus:border-stone-300 focus:ring-2 focus:ring-stone-100 transition-all"
            value={localFilters.searchTerm}
            onChange={(e) => setLocalFilters(p => ({ ...p, searchTerm: e.target.value }))}
          />
          {localFilters.searchTerm && (
            <button
              onClick={() => setLocalFilters(p => ({ ...p, searchTerm: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Destination */}
        <div className="relative group">
          <MapPin className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
          <Input
            placeholder="Destination or location..."
            className="h-12 text-base pl-11 border-stone-200 bg-white/80 focus:border-stone-300 focus:ring-2 focus:ring-stone-100 transition-all"
            value={localFilters.destination}
            onChange={(e) => setLocalFilters(p => ({ ...p, destination: e.target.value }))}
          />
          {localFilters.destination && (
            <button
              onClick={() => setLocalFilters(p => ({ ...p, destination: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-12 flex-1 border-stone-200 hover:bg-stone-50"
          >
            Reset
          </Button>
          <Button
            variant="gradient"
            className="h-12 flex-1 shadow-md hover:shadow-lg transition-shadow"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Travel Types */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
          <Compass className="h-4 w-4" />
          Travel Interests
        </div>
        
        <div className="flex flex-wrap gap-2">
          {travelTypes.map(({ label, emoji }) => {
            const isActive = activeTags.includes(label);
            return (
              <Badge
                key={label}
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  "cursor-pointer transition-all px-4 py-2.5 rounded-lg font-medium border",
                  isActive
                    ? "bg-linear-to-r from-orange-300 to-orange-500 text-white shadow-sm hover:from-orange-600 hover:to-orange-500"
                    : "bg-white/80 border-orange-200 text-stone-700 hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm"
                )}
                onClick={() => toggleTag(label)}
              >
                <span className="mr-2">{emoji}</span>
                {label}
                {isActive && (
                  <X className="h-3 w-3 ml-2 inline" />
                )}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Active Filters Preview */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-stone-100">
          <div className="flex flex-wrap gap-2">
            {localFilters.searchTerm && (
              <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                Search: "{localFilters.searchTerm}"
                <button
                  onClick={() => setLocalFilters(p => ({ ...p, searchTerm: '' }))}
                  className="ml-2 hover:bg-stone-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {localFilters.destination && (
              <Badge variant="secondary" className="pl-3 pr-2 py-1.5">
                <MapPin className="h-3 w-3 mr-1 inline" />
                {localFilters.destination}
                <button
                  onClick={() => setLocalFilters(p => ({ ...p, destination: '' }))}
                  className="ml-2 hover:bg-stone-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {activeTags.map(tag => (
              <Badge key={tag} variant="secondary" className="pl-3 pr-2 py-1.5">
                {travelTypes.find(t => t.label === tag)?.emoji} {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-2 hover:bg-stone-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}