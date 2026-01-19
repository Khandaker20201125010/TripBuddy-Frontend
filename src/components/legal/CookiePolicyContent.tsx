/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cookie, Settings, Shield, Eye, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react'

const cookieCategories = [
  {
    name: 'Essential Cookies',
    description: 'Required for basic website functionality',
    required: true,
    cookies: ['session_id', 'csrf_token', 'language'],
    purpose: 'Enable core features like page navigation and access to secure areas'
  },
  {
    name: 'Performance Cookies',
    description: 'Help us understand how visitors interact',
    required: false,
    cookies: ['_ga', '_gid', 'amplitude_id'],
    purpose: 'Collect information about website usage to improve user experience'
  },
  {
    name: 'Functional Cookies',
    description: 'Enable enhanced functionality',
    required: false,
    cookies: ['theme_preference', 'font_size', 'sidebar_state'],
    purpose: 'Remember your preferences and settings for a better experience'
  },
  {
    name: 'Targeting Cookies',
    description: 'Used to deliver relevant advertisements',
    required: false,
    cookies: ['_fbp', 'fr', 'personalization_id'],
    purpose: 'Track your browsing habits to show personalized content and ads'
  }
]

const cookieDetails = [
  {
    name: 'session_id',
    category: 'Essential',
    duration: 'Session',
    purpose: 'Maintains your login session',
    provider: 'Travel Buddy'
  },
  {
    name: '_ga',
    category: 'Performance',
    duration: '2 years',
    purpose: 'Google Analytics tracking',
    provider: 'Google'
  },
  {
    name: 'theme_preference',
    category: 'Functional',
    duration: '1 year',
    purpose: 'Remembers your theme preference',
    provider: 'Travel Buddy'
  },
  {
    name: '_fbp',
    category: 'Targeting',
    duration: '3 months',
    purpose: 'Facebook pixel tracking',
    provider: 'Meta'
  },
  {
    name: 'amplitude_id',
    category: 'Performance',
    duration: '10 years',
    purpose: 'User behavior analytics',
    provider: 'Amplitude'
  },
  {
    name: 'language',
    category: 'Essential',
    duration: '1 year',
    purpose: 'Remembers your language preference',
    provider: 'Travel Buddy'
  }
]

export function CookiePolicyContent() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    performance: false,
    functional: false,
    targeting: false
  })

  const handleToggle = (category: keyof typeof cookiePreferences) => {
    if (category === 'essential') return // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      performance: true,
      functional: true,
      targeting: true
    })
  }

  const handleRejectAll = () => {
    setCookiePreferences({
      essential: true,
      performance: false,
      functional: false,
      targeting: false
    })
  }

  const handleSavePreferences = () => {
    // In a real app, this would save preferences to localStorage or send to server
    alert('Cookie preferences saved!')
  }

  return (
    <div>
      {/* Introduction */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Cookie className="h-8 w-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-stone-900">Cookie Policy</h2>
        </div>
        
        <p className="text-stone-600 mb-6">
          This Cookie Policy explains how Travel Buddy uses cookies and similar technologies 
          to recognize you when you visit our platform. It explains what these technologies 
          are and why we use them, as well as your rights to control our use of them.
        </p>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Eye className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                What Are Cookies?
              </h3>
              <p className="text-stone-700">
                Cookies are small data files that are placed on your computer or mobile device 
                when you visit a website. Cookies are widely used by website owners to make their 
                websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Categories */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-6">Types of Cookies We Use</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {cookieCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    category.required 
                      ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10'
                      : 'bg-stone-100'
                  }`}>
                    {category.required ? (
                      <Shield className="h-5 w-5 text-orange-600" />
                    ) : (
                      <Settings className="h-5 w-5 text-stone-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{category.name}</h4>
                    <p className="text-sm text-stone-500">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {category.required ? (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      Required
                    </span>
                  ) : (
                    <button
                      onClick={() => handleToggle(category.name.toLowerCase().split(' ')[0] as keyof typeof cookiePreferences)}
                      className="relative"
                    >
                      <div className="w-12 h-6 rounded-full bg-stone-300 transition-colors">
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          cookiePreferences[category.name.toLowerCase().split(' ')[0] as keyof typeof cookiePreferences]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`} />
                      </div>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-stone-700 mb-2">Purpose:</h5>
                <p className="text-sm text-stone-600">{category.purpose}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-stone-700 mb-2">Example Cookies:</h5>
                <div className="flex flex-wrap gap-2">
                  {category.cookies.map((cookie) => (
                    <span
                      key={cookie}
                      className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs font-mono"
                    >
                      {cookie}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cookie Details Table */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-6">Detailed Cookie Information</h3>
        
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Cookie Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Provider
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {cookieDetails.map((cookie, index) => (
                  <motion.tr
                    key={cookie.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-stone-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-stone-900">{cookie.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cookie.category === 'Essential'
                          ? 'bg-orange-100 text-orange-700'
                          : cookie.category === 'Performance'
                          ? 'bg-blue-100 text-blue-700'
                          : cookie.category === 'Functional'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {cookie.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">{cookie.duration}</td>
                    <td className="px-6 py-4 text-sm text-stone-600">{cookie.purpose}</td>
                    <td className="px-6 py-4 text-sm text-stone-600">{cookie.provider}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cookie Management */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-6">Manage Your Preferences</h3>
        
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-stone-900 mb-4">Current Preferences</h4>
              
              <div className="space-y-4">
                {Object.entries(cookiePreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-stone-900 capitalize">{key}</div>
                      <div className="text-sm text-stone-500">
                        {key === 'essential' ? 'Required for site functionality' : 'Optional cookies'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {key === 'essential' ? (
                        <span className="px-3 py-1 bg-stone-200 text-stone-700 rounded-full text-sm">
                          Always On
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {value ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                          )}
                          <span className="text-sm text-stone-600">
                            {value ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleSavePreferences}
                className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                Save Preferences
              </button>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-stone-900 mb-4">Quick Actions</h4>
              
              <div className="space-y-4">
                <button
                  onClick={handleAcceptAll}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span>Accept All Cookies</span>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    Enable all cookies for the best experience
                  </p>
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="w-full px-6 py-4 bg-gradient-to-r from-stone-700 to-stone-800 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-stone-500/30 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span>Reject Optional Cookies</span>
                    <div className="w-5 h-5 rounded-full border-2 border-white" />
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    Only use essential cookies
                  </p>
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-stone-200">
                <h5 className="font-semibold text-stone-900 mb-2">Browser Controls</h5>
                <p className="text-sm text-stone-600">
                  You can also manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                  <li>• See what cookies are stored</li>
                  <li>• Delete individual cookies</li>
                  <li>• Block cookies from specific sites</li>
                  <li>• Block all cookies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-stone-900 mb-3">Third-Party Cookies</h4>
          <p className="text-stone-600 text-sm">
            Some cookies are placed by third-party services that appear on our pages. 
            We have no control over these cookies and you should check the relevant 
            third-party's cookie policy for more information.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-stone-900 mb-3">Updates to This Policy</h4>
          <p className="text-stone-600 text-sm">
            We may update this Cookie Policy from time to time to reflect changes 
            in our practices or for other operational, legal, or regulatory reasons.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 text-center text-sm text-stone-500">
        <p>
          Last updated: {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
        <p className="mt-2">
          For questions about this Cookie Policy, contact us at{' '}
          <a href="mailto:privacy@travelbuddy.com" className="text-orange-600 hover:underline">
            privacy@travelbuddy.com
          </a>
        </p>
      </div>
    </div>
  )
}