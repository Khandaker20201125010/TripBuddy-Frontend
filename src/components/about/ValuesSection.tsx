'use client'
import { motion } from 'framer-motion'
import { Shield, Users, Globe, Heart, Sparkles, Target } from 'lucide-react'

const values = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Safety First',
    description: 'Your security is our top priority. We implement multiple verification layers and safety features.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Authentic Connections',
    description: 'We believe travel creates the deepest bonds. Our platform fosters genuine relationships.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Global Community',
    description: 'Bringing together travelers from every corner of the world to share experiences.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Inclusivity',
    description: 'Everyone is welcome. We celebrate diversity in backgrounds, ages, and travel styles.',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'Adventure',
    description: 'Encouraging exploration, trying new things, and stepping out of comfort zones.',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Trust & Transparency',
    description: 'Clear communication, honest reviews, and reliable connections build trust.',
    color: 'from-indigo-500 to-blue-500'
  }
]

export function ValuesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Our Core Values
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          These principles guide everything we do at Travel Buddy
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.color} mb-6`}>
              <div className="text-white">
                {value.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3">
              {value.title}
            </h3>
            <p className="text-stone-600">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}