'use client'
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UsersIcon,  MapPinIcon, CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAllTravelPlans } from '@/hooks/travelshooks/useAllTravelPlans'
import { Button } from '@/components/ui/button'
import { getImageSrc } from '@/helpers/getImageSrc '


export function Destinations() {
  const { plans, loading } = useAllTravelPlans();
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  // Get only the 6 most recent plans
  const recentPlans = plans.slice(0, 6);

  return (
    <section ref={ref} className="py-24 bg-(--color-sand)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white text-(--color-blue) text-sm font-medium mb-4">
            Recent Trips
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-4">
            Where Travelers Are Heading
          </h2>
          <p className="text-xl text-(--color-charcoal)/60 max-w-2xl mx-auto">
            Discover the latest travel plans and find companions for your next adventure.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-teal)"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Link href={`/my-travel-plans/${plan.id}`}>
                  <div className="aspect-4/3 relative">
                    <Image
                      width={600}
                      height={400}
                      
                       src={getImageSrc(plan.image)}
                      alt={plan.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge for Travel Type */}
                    <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-(--color-sunset) text-white text-xs font-medium">
                      <MapPinIcon className="w-3 h-3" />
                      {plan.travelType}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.destination}
                      </h3>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <UsersIcon className="w-4 h-4 text-orange-400" />
                          <span>By {plan.user?.name || 'Explorer'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/my-travel-plans">
            <Button variant={"gradient"} className="px-8 py-4 bg-(--color-teal) text-white font-semibold rounded-full hover:bg-(--color-blue) transition-colors duration-300">
              Explore All Destinations
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}