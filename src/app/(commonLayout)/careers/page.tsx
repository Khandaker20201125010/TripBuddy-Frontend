/* eslint-disable react/no-unescaped-entities */
import { BenefitsSection } from '@/components/careers/BenefitsSection'
import { CultureSection } from '@/components/careers/CultureSection'
import { JobListings } from '@/components/careers/JobListings'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Careers | Travel Buddy',
  description: 'Join our team and help connect travelers worldwide',
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6">
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              We're Hiring
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Join Our Mission to</span>
            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Connect the World
            </span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Help us build the future of travel companionship. 
            Work with passionate people to create meaningful connections across the globe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <JobListings />
        <BenefitsSection />
        <CultureSection />
      </div>
    </div>
  )
}