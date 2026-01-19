'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Plane, Calendar, Star, MessageCircle, Users } from 'lucide-react'

const stats = [
  {
    icon: <Users className="h-6 w-6" />,
    value: '50,000+',
    label: 'Active Travelers',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    value: '150+',
    label: 'Countries Covered',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: <Plane className="h-6 w-6" />,
    value: '25,000+',
    label: 'Trips Planned',
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    value: '1M+',
    label: 'Messages Exchanged',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: <Star className="h-6 w-6" />,
    value: '4.8/5',
    label: 'Average Rating',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    value: '24/7',
    label: 'Support Available',
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  }
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl overflow-hidden my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            By The Numbers
          </h2>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto">
            Our impact in the travel community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-stone-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}