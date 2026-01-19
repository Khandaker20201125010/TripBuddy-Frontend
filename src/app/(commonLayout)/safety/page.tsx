import { Metadata } from 'next'
import { SafetyGuidelinesContent } from '@/components/safety/SafetyGuidelinesContent'
import { SafetyResources } from '@/components/safety/SafetyResources'

export const metadata: Metadata = {
  title: 'Safety Guidelines | Travel Buddy',
  description: 'Stay safe while connecting with travel buddies around the world',
}

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6">
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Your Safety Matters
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Safety Guidelines</span>
            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Travel Smart, Stay Safe
            </span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Your safety is our top priority. Follow these guidelines to ensure 
            secure and enjoyable travel experiences with new companions.
          </p>
        </div>

        <SafetyGuidelinesContent />
        <SafetyResources />
      </div>
    </div>
  )
}