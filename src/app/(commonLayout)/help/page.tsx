import { Metadata } from 'next'
import { HelpSearch } from '@/components/help/HelpSearch'
import { HelpCategories } from '@/components/help/HelpCategories'
import { PopularArticles } from '@/components/help/PopularArticles'
import { ContactSupport } from '@/components/help/ContactSupport'

export const metadata: Metadata = {
  title: 'Help Center | Travel Buddy',
  description: 'Get help with your Travel Buddy account and travel planning',
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">How can we</span>
            <span className="block mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              help you today?
            </span>
          </h1>
          
          <p className="text-xl text-stone-600 mb-8">
            Search our help articles or browse by category to find answers to your questions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <HelpSearch />
        <HelpCategories />
        <PopularArticles />
        <ContactSupport />
      </div>
    </div>
  )
}