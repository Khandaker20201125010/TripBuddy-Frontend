/* eslint-disable react/no-unescaped-entities */
'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { 
  Mountain, 
  Umbrella, 
  Castle, 
  Camera, 
  Coffee, 
  Tent,
  Compass,
  Palette
} from 'lucide-react'
import Link from 'next/link'

const travelTypes = [
  {
    icon: Mountain,
    title: 'Adventure & Trekking',
    description: 'Hiking, mountain climbing, and outdoor expeditions',
    color: 'var(--color-teal)',
    count: '2.3K+ trips',
  },
  {
    icon: Umbrella,
    title: 'Beach & Relaxation',
    description: 'Tropical getaways, island hopping, beach vacations',
    color: 'var(--color-coral)',
    count: '1.8K+ trips',
  },
  {
    icon: Castle,
    title: 'Cultural Exploration',
    description: 'Historical sites, museums, and cultural immersion',
    color: 'var(--color-blue)',
    count: '1.5K+ trips',
  },
  {
    icon: Camera,
    title: 'Photography Tours',
    description: 'Landscape, wildlife, and urban photography journeys',
    color: 'var(--color-sunset)',
    count: '890+ trips',
  },
  {
    icon: Coffee,
    title: 'Food & Culinary',
    description: 'Food tours, cooking classes, and wine tasting',
    color: 'var(--color-coral)',
    count: '1.2K+ trips',
  },
  {
    icon: Tent,
    title: 'Camping & Backpacking',
    description: 'Wild camping, backpacking routes, and wilderness trips',
    color: 'var(--color-teal)',
    count: '1.1K+ trips',
  },
  {
    icon: Compass,
    title: 'Road Trips',
    description: 'Cross-country drives, scenic routes, and exploration',
    color: 'var(--color-blue)',
    count: '950+ trips',
  },
  {
    icon: Palette,
    title: 'Art & Music Festivals',
    description: 'Concerts, art exhibitions, and cultural festivals',
    color: 'var(--color-sunset)',
    count: '670+ trips',
  },
]

export function TravelTypes() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-(--color-sand) to-(--color-warm-white)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white text-(--color-charcoal) text-sm font-medium mb-4">
            Find Your Travel Style
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-4">
            Explore By Travel Type
          </h2>
          <p className="text-xl text-(--color-charcoal)/60 max-w-2xl mx-auto">
            Whatever your travel style, find companions who share your passion for adventure.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {travelTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link href={`/my-travel-plans?type=${encodeURIComponent(type.title)}`}>
                <div className="group h-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-(--color-sand)/50 hover:border-(--color-sand-dark)">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: `${type.color}15`,
                      }}
                    >
                      <type.icon 
                        className="w-8 h-8"
                        style={{ color: type.color }}
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-(--color-charcoal) mb-2">
                      {type.title}
                    </h3>
                    
                    <p className="text-sm text-(--color-charcoal)/60 mb-3 leading-relaxed">
                      {type.description}
                    </p>
                    
                    <div className="text-xs font-medium px-3 py-1 rounded-full bg-(--color-sand) text-(--color-charcoal)/70">
                      {type.count}
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-transparent via-[var(--color-coral)] to-transparent" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 pt-8 border-t border-(--color-sand-dark)"
        >
          <p className="text-(--color-charcoal)/60 mb-6">
            Don't see your specific travel style? Create a custom trip and find like-minded adventurers!
          </p>
          <Link href="/my-travel-plans/create">
            <button className="inline-flex items-center gap-2 px-8 py-4 gradient-sunset text-white font-semibold rounded-full shadow-lg shadow-(--color-coral)/30 hover:shadow-xl hover:shadow-(--color-coral)/40 transition-all duration-300">
              Create Custom Trip
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}