'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Compass, 
  MapPin, 
  Users, 
  DollarSign, 
  Shield, 
  Camera,
  Heart,
  Lightbulb
} from 'lucide-react'

const categories = [
  {
    name: 'Destination Guides',
    icon: <Compass className="h-6 w-6" />,
    count: 42,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Travel Tips',
    icon: <Lightbulb className="h-6 w-6" />,
    count: 28,
    color: 'from-orange-500 to-amber-500'
  },
  {
    name: 'Buddy Stories',
    icon: <Users className="h-6 w-6" />,
    count: 35,
    color: 'from-pink-500 to-rose-500'
  },
  {
    name: 'Budget Travel',
    icon: <DollarSign className="h-6 w-6" />,
    count: 19,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Safety First',
    icon: <Shield className="h-6 w-6" />,
    count: 15,
    color: 'from-purple-500 to-violet-500'
  },
  {
    name: 'Travel Photography',
    icon: <Camera className="h-6 w-6" />,
    count: 23,
    color: 'from-red-500 to-pink-500'
  },
  {
    name: 'Solo Travel',
    icon: <Heart className="h-6 w-6" />,
    count: 17,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    name: 'Hidden Gems',
    icon: <MapPin className="h-6 w-6" />,
    count: 31,
    color: 'from-teal-500 to-green-500'
  }
]

export function BlogCategories() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeCategory === 'All'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Posts
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
              activeCategory === category.name
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {category.icon}
            {category.name}
            <span className="text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white cursor-pointer`}
            onClick={() => setActiveCategory(category.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                {category.icon}
              </div>
              <span className="text-2xl font-bold">{category.count}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-white/80 text-sm">Read articles</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}