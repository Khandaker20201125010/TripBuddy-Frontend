'use client'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Globe, 
  Home, 
  DollarSign, 
  Calendar, 
  Users,
  Brain,
  Coffee,
  Zap
} from 'lucide-react'

const benefits = [
  {
    icon: <Home className="h-8 w-8" />,
    title: 'Remote-First',
    description: 'Work from anywhere in the world',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: 'Competitive Salary',
    description: 'Industry-leading compensation',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Health & Wellness',
    description: 'Comprehensive health coverage',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: 'Unlimited PTO',
    description: 'Take time off when you need it',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Travel Stipend',
    description: '$2,000 annual travel budget',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Learning Budget',
    description: 'Annual budget for courses & conferences',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'Mental Health Support',
    description: 'Therapy and counseling services',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: <Coffee className="h-8 w-8" />,
    title: 'Flexible Hours',
    description: 'Work when you\'re most productive',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Stock Options',
    description: 'Own a piece of the company',
    color: 'from-red-500 to-pink-500'
  }
]

export function BenefitsSection() {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Perks & Benefits
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          We take care of our team so they can do their best work
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${benefit.color} mb-4`}>
              <div className="text-white">
                {benefit.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              {benefit.title}
            </h3>
            <p className="text-stone-600">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-stone-900 mb-4">
          Annual Company Retreat
        </h3>
        <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
          Each year, the entire team gathers in an exciting destination to connect, collaborate, 
          and experience travel together - just like our users do!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-white rounded-full text-sm font-medium">
            🏝️ Bali 2023
          </div>
          <div className="px-4 py-2 bg-white rounded-full text-sm font-medium">
            🗽 New York 2022
          </div>
          <div className="px-4 py-2 bg-white rounded-full text-sm font-medium">
            🏔️ Swiss Alps 2024
          </div>
        </div>
      </div>
    </div>
  )
}