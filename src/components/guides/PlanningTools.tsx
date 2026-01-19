'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Calendar, 
  ListChecks, 
  Download, 
  Share2,
  Printer,
  Cloud,
  Smartphone,
  CheckCircle,
  Clock,
  Users,
  Map
} from 'lucide-react'

const planningTools = [
  {
    icon: <Calculator className="h-8 w-8" />,
    title: 'Budget Calculator',
    description: 'Plan your trip expenses with our interactive calculator',
    features: ['Daily budget planning', 'Currency conversion', 'Expense tracking'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: 'Trip Planner',
    description: 'Create and manage your complete travel itinerary',
    features: ['Day-by-day planning', 'Activity scheduling', 'Booking reminders'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <ListChecks className="h-8 w-8" />,
    title: 'Packing List Generator',
    description: 'Never forget essential items with smart packing lists',
    features: ['Destination-specific items', 'Weather-based suggestions', 'Custom categories'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: 'Route Optimizer',
    description: 'Plan the most efficient travel routes between destinations',
    features: ['Multi-stop optimization', 'Travel time estimates', 'Transport options'],
    color: 'from-orange-500 to-amber-500'
  }
]

const checklists = [
  {
    title: 'Pre-Trip Checklist',
    items: [
      'Book flights & accommodation',
      'Check passport validity',
      'Purchase travel insurance',
      'Notify bank of travel',
      'Download offline maps',
      'Pack medications'
    ]
  },
  {
    title: 'Safety Checklist',
    items: [
      'Share itinerary with family',
      'Save emergency contacts',
      'Register with embassy',
      'Copy important documents',
      'Install safety apps',
      'Know local emergency numbers'
    ]
  },
  {
    title: 'Digital Checklist',
    items: [
      'Backup photos to cloud',
      'Download entertainment',
      'Install translation app',
      'Set up VPN',
      'Charge power banks',
      'Update travel apps'
    ]
  }
]

export function PlanningTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Travel Planning Tools
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Free tools to help you plan the perfect trip
        </p>
      </div>

      {/* Planning Tools */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {planningTools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tool.color} mb-6`}>
              <div className="text-white">
                {tool.icon}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-stone-900 mb-3">
              {tool.title}
            </h3>
            
            <p className="text-stone-600 mb-6">
              {tool.description}
            </p>
            
            <ul className="space-y-2 mb-8">
              {tool.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-stone-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => setSelectedTool(tool.title)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Open Tool
            </button>
          </motion.div>
        ))}
      </div>

      {/* Checklists */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          Essential Checklists
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {checklists.map((checklist, index) => (
            <motion.div
              key={checklist.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-stone-900">{checklist.title}</h4>
                <Clock className="h-5 w-5 text-stone-400" />
              </div>
              
              <ul className="space-y-3 mb-6">
                {checklist.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`checklist-${index}-${idx}`}
                      className="mt-1 h-5 w-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label
                      htmlFor={`checklist-${index}-${idx}`}
                      className="text-stone-700 cursor-pointer select-none"
                    >
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                <button className="text-sm text-stone-600 hover:text-orange-600 flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button className="text-sm text-stone-600 hover:text-orange-600 flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile App CTA */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Smartphone className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Mobile App
                </span>
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-4">
                Plan on the Go
              </h3>
              
              <p className="text-xl text-stone-300 mb-6">
                Download our mobile app to access all planning tools, 
                checklists, and your itineraries wherever you travel.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-stone-900 font-semibold rounded-xl hover:bg-stone-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">→</div>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-lg">App Store</div>
                    </div>
                  </div>
                </button>
                
                <button className="px-6 py-3 bg-white text-stone-900 font-semibold rounded-xl hover:bg-stone-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">→</div>
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="text-lg">Google Play</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl">
                <div className="relative">
                  <Smartphone className="h-48 w-48 text-white/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">📱</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-12 text-center">
        <h4 className="text-2xl font-bold text-stone-900 mb-6">Export & Share</h4>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Print Itinerary
          </button>
          <button className="px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download PDF
          </button>
          <button className="px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Save to Cloud
          </button>
          <button className="px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share with Buddies
          </button>
        </div>
      </div>
    </div>
  )
}