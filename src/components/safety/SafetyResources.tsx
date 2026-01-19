/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import { 
  Download, 
  ExternalLink, 
  BookOpen, 
  Video, 
  Headphones,
  Users,
  Shield,
  AlertTriangle,
  Globe,
  FileText,
  Smartphone,
  Heart
} from 'lucide-react'

const resources = [
  {
    category: 'Downloadable Guides',
    icon: <Download className="h-8 w-8" />,
    items: [
      {
        title: 'Complete Safety Handbook',
        description: 'Comprehensive guide to safe travel practices',
        format: 'PDF',
        size: '2.4 MB',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Emergency Contact Cards',
        description: 'Printable emergency contact templates',
        format: 'PDF',
        size: '1.1 MB',
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: 'Travel Planning Checklist',
        description: 'Step-by-step safety planning checklist',
        format: 'PDF',
        size: '1.8 MB',
        color: 'from-orange-500 to-amber-500'
      }
    ]
  },
  {
    category: 'External Resources',
    icon: <ExternalLink className="h-8 w-8" />,
    items: [
      {
        title: 'CDC Travel Health Notices',
        description: 'Latest health advisories for travelers',
        link: 'https://www.cdc.gov/travel',
        type: 'Government',
        color: 'from-purple-500 to-pink-500'
      },
      {
        title: 'Smart Traveler Enrollment',
        description: 'Register travel with U.S. Department of State',
        link: 'https://step.state.gov',
        type: 'Government',
        color: 'from-red-500 to-orange-500'
      },
      {
        title: 'International SOS',
        description: 'Global medical and security assistance',
        link: 'https://www.internationalsos.com',
        type: 'Medical',
        color: 'from-indigo-500 to-blue-500'
      }
    ]
  },
  {
    category: 'Learning Materials',
    icon: <BookOpen className="h-8 w-8" />,
    items: [
      {
        title: 'Self-Defense Basics',
        description: 'Basic self-defense techniques for travelers',
        duration: '45 min',
        format: 'Video Course',
        color: 'from-teal-500 to-green-500'
      },
      {
        title: 'Cultural Sensitivity Guide',
        description: 'Understanding cultural norms worldwide',
        duration: '30 min',
        format: 'Interactive Guide',
        color: 'from-yellow-500 to-amber-500'
      },
      {
        title: 'First Aid for Travelers',
        description: 'Essential first aid knowledge',
        duration: '60 min',
        format: 'Video Course',
        color: 'from-pink-500 to-rose-500'
      }
    ]
  }
]

const apps = [
  {
    name: 'Travel Safe',
    icon: '🛡️',
    description: 'Real-time safety alerts and advisories',
    platforms: ['iOS', 'Android'],
    rating: 4.8
  },
  {
    name: 'Sitata',
    icon: '🌍',
    description: 'Travel risk management and assistance',
    platforms: ['iOS', 'Android'],
    rating: 4.6
  },
  {
    name: 'bSafe',
    icon: '👥',
    description: 'Personal safety with live tracking',
    platforms: ['iOS', 'Android'],
    rating: 4.7
  },
  {
    name: 'TripIt',
    icon: '📋',
    description: 'Travel organization and itinerary sharing',
    platforms: ['iOS', 'Android'],
    rating: 4.5
  }
]

export function SafetyResources() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Additional Resources
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Tools, guides, and external resources to enhance your travel safety
        </p>
      </div>

      {/* Resource Categories */}
      <div className="space-y-12 mb-16">
        {resources.map((category, categoryIndex) => (
          <div key={category.category}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-pink-500/10">
                <div className="text-orange-600">
                  {category.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900">{category.category}</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (categoryIndex * 0.3) + (itemIndex * 0.1) }}
                  className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white`}
                >
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-white/90 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      {('format' in item) && (
                        <div className="font-medium">{item.format}</div>
                      )}
                      {('type' in item) && (
                        <div className="font-medium">{item.type}</div>
                      )}
                      {('duration' in item) && (
                        <div className="font-medium">{item.duration}</div>
                      )}
                    </div>
                    <div className="text-sm opacity-75">
                      {('size' in item) && item.size}
                      {('rating' in item) && `${item.rating}/5`}
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                    {category.category === 'Downloadable Guides' ? (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    ) : category.category === 'External Resources' ? (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Start Learning
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Apps */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          Recommended Safety Apps
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{app.icon}</div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">{app.name}</h4>
              <p className="text-stone-600 text-sm mb-4">{app.description}</p>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {app.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < Math.floor(app.rating)
                            ? 'bg-amber-500'
                            : 'bg-stone-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-stone-600 ml-1">{app.rating}</span>
                  </div>
                  
                  <button className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1">
                    Learn More
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Services */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-6 text-center">
          Additional Support Services
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-stone-900 mb-2">24/7 Support Hotline</h4>
            <p className="text-stone-600 text-sm">
              Dedicated support line for safety emergencies
            </p>
            <div className="mt-3 text-blue-700 font-medium">+1 (800) 555-0199</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-bold text-stone-900 mb-2">Community Forums</h4>
            <p className="text-stone-600 text-sm">
              Connect with experienced travelers for advice
            </p>
            <a href="/community" className="mt-3 text-green-700 font-medium hover:underline">
              Visit Community →
            </a>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 flex items-center justify-center">
              <Video className="h-8 w-8 text-orange-600" />
            </div>
            <h4 className="font-bold text-stone-900 mb-2">Safety Webinars</h4>
            <p className="text-stone-600 text-sm">
              Live and recorded safety training sessions
            </p>
            <a href="/webinars" className="mt-3 text-orange-700 font-medium hover:underline">
              View Schedule →
            </a>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Stay Safe, Travel Smart
          </span>
        </div>
        
        <h3 className="text-3xl font-bold text-stone-900 mb-4">
          Your Safety is Important to Us
        </h3>
        
        <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
          We're constantly working to improve safety features and provide resources 
          to help you travel confidently. Remember, being prepared is the first step 
          to having amazing travel experiences.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            Download All Resources
          </button>
          <button className="px-8 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-full hover:border-orange-500 hover:text-orange-600 transition-all">
            Contact Safety Team
          </button>
        </div>
      </div>
    </div>
  )
}