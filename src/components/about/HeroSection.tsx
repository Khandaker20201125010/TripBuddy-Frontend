/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import { Users, Globe, Heart, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Our Story
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Connecting Travelers,</span>
            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Creating Memories
            </span>
          </h1>

          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-12">
            Travel Buddy was born from a simple idea: travel is better shared. 
            We're building a global community where wanderers find companions, 
            share adventures, and create lifelong friendships.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-stone-900">50,000+</div>
              <div className="text-sm text-stone-600">Travelers Connected</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-stone-900">150+</div>
              <div className="text-sm text-stone-600">Countries</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-stone-900">94%</div>
              <div className="text-sm text-stone-600">Satisfaction Rate</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-stone-900">5M+</div>
              <div className="text-sm text-stone-600">Memories Made</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}