'use client'
import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

const popularSearches = [
  'How to create a travel plan?',
  'Is Travel Buddy free?',
  'How do I find travel buddies?',
  'Safety guidelines',
  'Reset password',
  'Delete account',
  'Subscription plans',
  'Contact support'
]

export function HelpSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="mb-12">
      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="How can we help you today?"
              className="w-full pl-14 pr-6 py-5 bg-white border border-stone-300 rounded-2xl shadow-lg focus:ring-3 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-lg"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Filter className="h-5 w-5 text-stone-500" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Search Help Articles
            </button>
            
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-sm text-stone-600 hover:text-orange-600 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear search
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">Filter by</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-stone-600 hover:text-orange-600"
              >
                Hide filters
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <select className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Getting Started</option>
                <option>Account Settings</option>
                <option>Travel Plans</option>
                <option>Connections</option>
                <option>Safety</option>
                <option>Payments</option>
              </select>
              
              <select className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>All Difficulty</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              
              <select className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Sort by Relevance</option>
                <option>Most Recent</option>
                <option>Most Viewed</option>
                <option>Most Helpful</option>
              </select>
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => setSearchQuery(search)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition-colors text-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}