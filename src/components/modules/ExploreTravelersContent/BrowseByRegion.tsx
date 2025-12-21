'use client'
import React from 'react'
import { Globe, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRegionStats } from '@/hooks/travelshooks/useRegionStats';

export function BrowseByRegion() { // Removed onSelectRegion prop
    const { regions, loading } = useRegionStats();

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-stone-400" />
                <h3 className="font-bold text-stone-900">Travelers by Region</h3>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-stone-300" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {regions.map((region) => (
                        <div
                            key={region.name}
                            // Removed onClick and cursor-pointer
                            className="relative h-24 rounded-lg overflow-hidden"
                        >
                            <Image
                                fill
                                src={region.image}
                                alt={region.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Overlay stays static */}
                            <div className="absolute inset-0 bg-black/50" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                                <span className="font-bold text-lg">{region.name}</span>
                                <span className="text-xs opacity-90 text-center">
                                    {region.count} Experts
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}