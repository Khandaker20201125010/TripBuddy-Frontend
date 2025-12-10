import React from 'react'
import { Globe } from 'lucide-react'
import Image from 'next/image'
const regions = [
    {
        name: 'Europe',
        count: '1.2k',
        image:
            'https://images.unsplash.com/photo-1471306224500-6d0d218be372?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
        name: 'Asia',
        count: '850',
        image:
            'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
        name: 'Americas',
        count: '2.1k',
        image:
            'https://images.unsplash.com/photo-1518182170546-0766aa6f1a26?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
        name: 'Africa',
        count: '420',
        image:
            'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=300&h=200',
    },
]
export function BrowseByRegion() {
    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-stone-400" />
                <h3 className="font-bold text-stone-900">Browse by Region</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {regions.map((region) => (
                    <div
                        key={region.name}
                        className="group relative h-24 rounded-lg overflow-hidden cursor-pointer"
                    >
                        <Image
                            width={300}
                            height={200}
                            src={region.image}
                            alt={region.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="font-bold text-lg">{region.name}</span>
                            <span className="text-xs opacity-80">
                                {region.count} travelers
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
