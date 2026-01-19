/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Map, 
  Camera, 
  Utensils, 
  Heart, 
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  Calendar,
  Compass,
  Home
} from 'lucide-react'

const guideTypes = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: 'Planning Guides',
    description: 'Step-by-step trip planning resources',
    count: 18,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: 'Itineraries',
    description: 'Pre-made travel routes and schedules',
    count: 24,
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Camera className="h-8 w-8" />,
    title: 'Photo Spots',
    description: 'Best locations for travel photography',
    count: 15,
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <Utensils className="h-8 w-8" />,
    title: 'Food Guides',
    description: 'Local cuisine and restaurant recommendations',
    count: 12,
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Wellness Travel',
    description: 'Health-focused travel experiences',
    count: 8,
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Trending Destinations',
    description: 'Currently popular travel spots',
    count: 10,
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Travel Safety',
    description: 'Security tips and safe travel practices',
    count: 14,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: 'Budget Planning',
    description: 'Cost breakdowns and money-saving tips',
    count: 16,
    color: 'from-yellow-500 to-amber-500'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Group Travel',
    description: 'Guides for traveling with companions',
    count: 9,
    color: 'from-teal-500 to-green-500'
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: 'Seasonal Guides',
    description: 'Best times to visit each destination',
    count: 11,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: <Compass className="h-8 w-8" />,
    title: 'Adventure Travel',
    description: 'Extreme sports and outdoor activities',
    count: 13,
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: <Home className="h-8 w-8" />,
    title: 'Accommodation',
    description: 'Where to stay in each destination',
    count: 17,
    color: 'from-violet-500 to-purple-500'
  }
]

export function GuideCategories() {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Specialized Guides
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Explore travel resources by category
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {guideTypes.map((guide, index) => (
          <motion.div
            key={guide.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${guide.color} mb-4`}>
              <div className="text-white">
                {guide.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
              {guide.title}
            </h3>
            
            <p className="text-stone-600 text-sm mb-4">
              {guide.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">
                {guide.count} guides
              </span>
              <span className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Collections */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-stone-900 mb-2">Beginner's Collection</h4>
          <p className="text-stone-600 text-sm mb-4">Perfect for first-time travelers</p>
          <div className="flex items-center gap-2">
            {['Planning 101', 'Packing Tips', 'First Trip'].map((tag) => (
              <span key={tag} className="px-2 py-1 bg-white text-orange-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-stone-900 mb-2">Digital Nomad Hub</h4>
          <p className="text-stone-600 text-sm mb-4">Work and travel seamlessly</p>
          <div className="flex items-center gap-2">
            {['WiFi Guides', 'Coworking', 'Visa Tips'].map((tag) => (
              <span key={tag} className="px-2 py-1 bg-white text-blue-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-stone-900 mb-2">Sustainable Travel</h4>
          <p className="text-stone-600 text-sm mb-4">Eco-friendly travel practices</p>
          <div className="flex items-center gap-2">
            {['Eco Stays', 'Carbon Offset', 'Local Support'].map((tag) => (
              <span key={tag} className="px-2 py-1 bg-white text-green-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}