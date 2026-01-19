'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, DollarSign, Star, ArrowRight, Globe } from 'lucide-react'

const continents = [
  { name: 'All', count: 45 },
  { name: 'Europe', count: 12 },
  { name: 'Asia', count: 15 },
  { name: 'North America', count: 8 },
  { name: 'South America', count: 6 },
  { name: 'Africa', count: 7 },
  { name: 'Oceania', count: 5 }
]

const destinationGuides = [
  {
    id: 1,
    title: 'Bali, Indonesia',
    continent: 'Asia',
    description: 'Tropical paradise with vibrant culture, stunning beaches, and lush rice terraces.',
    bestSeason: 'Apr-Oct',
    budget: '$',
    rating: 4.8,
    features: ['Beaches', 'Culture', 'Nature', 'Food'],
    highlights: [
      'Ubud rice terraces',
      'Sacred Monkey Forest',
      'Uluwatu Temple',
      'Traditional dance shows'
    ]
  },
  {
    id: 2,
    title: 'Santorini, Greece',
    continent: 'Europe',
    description: 'Iconic white-washed buildings with blue domes overlooking the Aegean Sea.',
    bestSeason: 'May-Sep',
    budget: '$$$',
    rating: 4.7,
    features: ['Romantic', 'Beaches', 'History', 'Sunset'],
    highlights: [
      'Oia sunset views',
      'Red Beach',
      'Ancient Thera ruins',
      'Wine tasting tours'
    ]
  },
  {
    id: 3,
    title: 'Kyoto, Japan',
    continent: 'Asia',
    description: 'Ancient capital filled with temples, gardens, and traditional geisha culture.',
    bestSeason: 'Mar-May & Oct-Nov',
    budget: '$$',
    rating: 4.9,
    features: ['Culture', 'History', 'Nature', 'Food'],
    highlights: [
      'Fushimi Inari Shrine',
      'Arashiyama Bamboo Grove',
      'Kinkaku-ji Temple',
      'Gion district'
    ]
  },
  {
    id: 4,
    title: 'Patagonia, Chile',
    continent: 'South America',
    description: 'Dramatic landscapes with glaciers, mountains, and unique wildlife.',
    bestSeason: 'Nov-Mar',
    budget: '$$',
    rating: 4.6,
    features: ['Adventure', 'Nature', 'Hiking', 'Wildlife'],
    highlights: [
      'Torres del Paine',
      'Perito Moreno Glacier',
      'Penguin colonies',
      'Trekking routes'
    ]
  },
  {
    id: 5,
    title: 'Morocco',
    continent: 'Africa',
    description: 'Colorful markets, ancient medinas, and desert adventures await.',
    bestSeason: 'Mar-May & Sep-Nov',
    budget: '$',
    rating: 4.5,
    features: ['Culture', 'Desert', 'Food', 'History'],
    highlights: [
      'Marrakech souks',
      'Sahara Desert camping',
      'Chefchaouen blue city',
      'Traditional riads'
    ]
  },
  {
    id: 6,
    title: 'New Zealand',
    continent: 'Oceania',
    description: 'Adventure capital with breathtaking scenery from mountains to fjords.',
    bestSeason: 'Dec-Feb',
    budget: '$$$',
    rating: 4.8,
    features: ['Adventure', 'Nature', 'Hiking', 'Lord of the Rings'],
    highlights: [
      'Milford Sound',
      'Queenstown adventures',
      'Hobbiton movie set',
      'Glowworm caves'
    ]
  }
]

export function DestinationGuides() {
  const [selectedContinent, setSelectedContinent] = useState('All')
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null)

  const filteredGuides = selectedContinent === 'All' 
    ? destinationGuides 
    : destinationGuides.filter(guide => guide.continent === selectedContinent)

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-stone-900 mb-2">Destination Guides</h2>
          <p className="text-stone-600">Comprehensive guides to popular travel destinations</p>
        </div>
        <div className="flex items-center gap-2 text-orange-600">
          <Globe className="h-5 w-5" />
          <span className="font-medium">{destinationGuides.length} Guides</span>
        </div>
      </div>

      {/* Continent Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {continents.map((continent) => (
          <button
            key={continent.name}
            onClick={() => setSelectedContinent(continent.name)}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
              selectedContinent === continent.name
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {continent.name}
            <span className="text-xs opacity-75">({continent.count})</span>
          </button>
        ))}
      </div>

      {/* Destination Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredGuides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            {/* Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {guide.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <MapPin className="h-4 w-4" />
                    {guide.continent}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{guide.rating}</span>
                </div>
              </div>

              <p className="text-stone-600 mb-4">{guide.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Best Season</div>
                    <div className="text-sm font-medium">{guide.bestSeason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Budget Level</div>
                    <div className="text-sm font-medium">{guide.budget}</div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-stone-900">Top Highlights</h4>
                <ul className="space-y-1">
                  {guide.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stone-100 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedGuide(selectedGuide === guide.id ? null : guide.id)}
                  className="text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1"
                >
                  View Full Guide
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                  Find Buddies
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map View CTA */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8 text-center">
        <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mb-4">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-stone-900 mb-4">Interactive Travel Map</h3>
        <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
          Explore all destinations on our interactive world map. See traveler reviews, 
          current weather, and find local travel buddies.
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all">
          Open World Map
        </button>
      </div>
    </div>
  )
}