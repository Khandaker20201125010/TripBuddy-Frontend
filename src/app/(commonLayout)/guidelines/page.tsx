import { CommunityGuidelinesContent } from '@/components/community/CommunityGuidelinesContent'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Community Guidelines | Travel Buddy',
  description: 'Rules and guidelines for our travel community',
}

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Community Guidelines</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            These guidelines help us maintain a respectful, safe, and 
            inclusive community for all travelers.
          </p>
        </div>

        <CommunityGuidelinesContent />
      </div>
    </div>
  )
}