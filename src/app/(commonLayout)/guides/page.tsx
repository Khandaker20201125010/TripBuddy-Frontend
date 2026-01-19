import { DestinationGuides } from '@/components/guides/DestinationGuides'
import { GuideCategories } from '@/components/guides/GuideCategories'
import { PlanningTools } from '@/components/guides/PlanningTools'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Travel Guides | Travel Buddy',
  description: 'Comprehensive travel guides and planning resources',
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6">
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Travel Planning Resources
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Travel Guides</span>
            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              & Resources
            </span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Everything you need to plan your perfect trip, from destination guides 
            to budgeting tips and safety advice.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DestinationGuides />
        <GuideCategories />
        <PlanningTools />
      </div>
    </div>
  )
}