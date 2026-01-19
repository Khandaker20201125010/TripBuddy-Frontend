/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertCircle, 
  Users, 
  MessageSquare, 
  MapPin, 
  Smartphone,
  CreditCard,
  Heart,
  Globe,
  FileText,
  Bell,
  Target
} from 'lucide-react'

const safetyGuidelines = [
  {
    category: 'Before Meeting',
    icon: <Shield className="h-8 w-8" />,
    guidelines: [
      'Verify profiles thoroughly',
      'Check reviews and ratings',
      'Communicate via Travel Buddy app',
      'Share your plans with friends/family',
      'Research meeting location',
      'Plan your transportation'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    category: 'First Meeting',
    icon: <Users className="h-8 w-8" />,
    guidelines: [
      'Always meet in public places',
      'Choose daylight hours for first meetings',
      'Arrange your own transportation',
      'Keep personal items secure',
      'Stay sober and alert',
      'Trust your instincts'
    ],
    color: 'from-green-500 to-emerald-500'
  },
  {
    category: 'Communication',
    icon: <MessageSquare className="h-8 w-8" />,
    guidelines: [
      'Use Travel Buddy messaging system',
      'Don\'t share personal contact too soon',
      'Avoid sharing financial information',
      'Be clear about expectations',
      'Report suspicious behavior',
      'Keep conversations appropriate'
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    category: 'Travel Safety',
    icon: <Globe className="h-8 w-8" />,
    guidelines: [
      'Purchase travel insurance',
      'Know local emergency numbers',
      'Register with your embassy',
      'Keep copies of important documents',
      'Stay aware of local customs',
      'Use trusted transportation'
    ],
    color: 'from-orange-500 to-amber-500'
  },
  {
    category: 'Digital Safety',
    icon: <Smartphone className="h-8 w-8" />,
    guidelines: [
      'Use strong, unique passwords',
      'Enable two-factor authentication',
      'Be cautious with public WiFi',
      'Keep app updated',
      'Log out of shared devices',
      'Report technical issues'
    ],
    color: 'from-indigo-500 to-blue-500'
  },
  {
    category: 'Financial Safety',
    icon: <CreditCard className="h-8 w-8" />,
    guidelines: [
      'Never send money to other users',
      'Use secure payment methods',
      'Keep financial information private',
      'Monitor your accounts',
      'Report suspicious requests',
      'Use Travel Buddy payment system'
    ],
    color: 'from-red-500 to-pink-500'
  }
]

const emergencyContacts = [
  {
    country: 'United States',
    emergency: '911',
    embassy: '+1-202-501-4444'
  },
  {
    country: 'United Kingdom',
    emergency: '999',
    embassy: '+44-20-7499-9000'
  },
  {
    country: 'Australia',
    emergency: '000',
    embassy: '+61-2-6214-6000'
  },
  {
    country: 'Canada',
    emergency: '911',
    embassy: '+1-613-996-8885'
  },
  {
    country: 'European Union',
    emergency: '112',
    embassy: 'Varies by country'
  }
]

export function SafetyGuidelinesContent() {
  return (
    <div className="mb-16">
      {/* Safety Priority Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white mb-12">
        <div className="flex items-center gap-4 mb-4">
          <AlertCircle className="h-10 w-10" />
          <div>
            <h3 className="text-2xl font-bold">Safety is Our Priority</h3>
            <p className="text-white/90">
              Your well-being comes first. Follow these guidelines for secure travel experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Guidelines Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {safetyGuidelines.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`bg-gradient-to-r ${category.color} p-6`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {category.category}
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3">
                {category.guidelines.map((guideline, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    </div>
                    <span className="text-stone-700">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Emergency Information */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-stone-900 mb-6 text-center">
          Emergency Information
        </h3>
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <h4 className="text-xl font-bold text-stone-900">Emergency Contacts</h4>
              </div>
              
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.country} className="bg-white rounded-xl p-4">
                    <div className="font-semibold text-stone-900 mb-2">{contact.country}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-stone-500">Emergency</div>
                        <div className="font-medium text-red-600">{contact.emergency}</div>
                      </div>
                      <div>
                        <div className="text-stone-500">Embassy</div>
                        <div className="font-medium text-stone-700">{contact.embassy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-8 w-8 text-orange-600" />
                <h4 className="text-xl font-bold text-stone-900">Safety Checklist</h4>
              </div>
              
              <div className="space-y-3">
                {[
                  'Share your live location with trusted contacts',
                  'Save emergency contacts in your phone',
                  'Know the nearest hospital location',
                  'Keep a physical map as backup',
                  'Have local currency for emergencies',
                  'Learn basic local emergency phrases'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`safety-${idx}`}
                      className="mt-1 h-5 w-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label
                      htmlFor={`safety-${idx}`}
                      className="text-stone-700 cursor-pointer select-none"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                Download Safety Checklist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          Travel Buddy Safety Features
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Target className="h-8 w-8" />,
              title: 'Verified Profiles',
              description: 'Identity verification for added trust'
            },
            {
              icon: <Heart className="h-8 w-8" />,
              title: 'Review System',
              description: 'Real feedback from other travelers'
            },
            {
              icon: <MapPin className="h-8 w-8" />,
              title: 'Location Check-ins',
              description: 'Optional location sharing with trusted contacts'
            },
            {
              icon: <FileText className="h-8 w-8" />,
              title: 'Safety Reports',
              description: 'Easy reporting of safety concerns'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 mb-4">
                <div className="text-orange-600">
                  {feature.icon}
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h4>
              <p className="text-stone-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Safety Commitment */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Our Commitment to Your Safety</h3>
          <p className="text-stone-300 mb-6">
            At Travel Buddy, we continuously work to improve safety features, 
            educate our community, and respond quickly to safety concerns. 
            Your safety is our top priority, and we're committed to creating 
            a secure environment for all travelers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-colors">
              Report a Safety Concern
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
              Safety Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}