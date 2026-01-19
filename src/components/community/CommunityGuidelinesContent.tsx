'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Shield, 
  Flag, 
  Star,
  ThumbsUp,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown
} from 'lucide-react'

const guidelines = [
  {
    category: 'Respect & Kindness',
    icon: <Heart className="h-6 w-6" />,
    rules: [
      'Treat all members with respect and dignity',
      'No hate speech, discrimination, or harassment',
      'Be constructive in feedback and discussions',
      'Respect cultural differences and perspectives',
      'No personal attacks or inflammatory comments'
    ],
    examples: {
      good: [
        'Sharing travel experiences respectfully',
        'Offering helpful advice politely',
        'Celebrating cultural diversity'
      ],
      bad: [
        'Derogatory comments about cultures',
        'Personal insults or name-calling',
        'Discriminatory language'
      ]
    }
  },
  {
    category: 'Authenticity & Honesty',
    icon: <Star className="h-6 w-6" />,
    rules: [
      'Use your real identity and accurate information',
      'No fake profiles or impersonation',
      'Be truthful in your travel plans and intentions',
      'Provide honest reviews and feedback',
      'No misleading or deceptive content'
    ],
    examples: {
      good: [
        'Accurate profile information',
        'Honest trip descriptions',
        'Genuine connection requests'
      ],
      bad: [
        'Fake profile photos',
        'Misleading travel dates',
        'Exaggerated experiences'
      ]
    }
  },
  {
    category: 'Safety First',
    icon: <Shield className="h-6 w-6" />,
    rules: [
      'Prioritize safety in all interactions',
      'Report suspicious behavior immediately',
      'No sharing of private personal information',
      'Follow safety guidelines for meetings',
      'Respect others\' privacy and boundaries'
    ],
    examples: {
      good: [
        'Meeting in public places first',
        'Reporting safety concerns',
        'Respecting privacy settings'
      ],
      bad: [
        'Sharing financial information',
        'Pressuring for private meetings',
        'Ignoring safety reports'
      ]
    }
  },
  {
    category: 'Quality Content',
    icon: <MessageSquare className="h-6 w-6" />,
    rules: [
      'Share valuable and relevant travel content',
      'No spam, advertising, or self-promotion',
      'Keep discussions travel-related',
      'Use appropriate language and imagery',
      'No duplicate or low-effort posts'
    ],
    examples: {
      good: [
        'Helpful travel tips and guides',
        'Beautiful travel photography',
        'Meaningful trip discussions'
      ],
      bad: [
        'Commercial advertisements',
        'Off-topic political debates',
        'Low-quality or irrelevant content'
      ]
    }
  }
]

const enforcement = [
  {
    level: 'Warning',
    action: 'First-time minor violations',
    result: 'Content removal and warning message',
    icon: <Eye className="h-5 w-5" />
  },
  {
    level: 'Temporary Restriction',
    action: 'Repeated violations or moderate offenses',
    result: 'Limited platform access for 7-30 days',
    icon: <AlertCircle className="h-5 w-5" />
  },
  {
    level: 'Account Suspension',
    action: 'Serious or repeated violations',
    result: 'Account suspension for 30-90 days',
    icon: <XCircle className="h-5 w-5" />
  },
  {
    level: 'Permanent Ban',
    action: 'Severe violations or illegal activities',
    result: 'Permanent removal from platform',
    icon: <Flag className="h-5 w-5" />
  }
]

export function CommunityGuidelinesContent() {
  const [openGuideline, setOpenGuideline] = useState<number | null>(0)
  const [reportReason, setReportReason] = useState('')

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the report
    alert('Report submitted. Thank you for helping keep our community safe!')
    setReportReason('')
  }

  return (
    <div>
      {/* Introduction */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-stone-900">Community Guidelines</h2>
        </div>
        
        <p className="text-stone-600 mb-6">
          These guidelines help us maintain a respectful, safe, and inclusive community 
          for all travelers. By using Travel Buddy, you agree to follow these guidelines 
          and contribute positively to our global travel community.
        </p>
        
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <ThumbsUp className="h-6 w-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Our Community Values
              </h3>
              <p className="text-stone-700">
                We believe travel brings people together. Our community thrives on 
                mutual respect, authentic connections, and shared adventures. 
                These guidelines reflect our commitment to creating a positive environment 
                for all travelers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="space-y-6 mb-12">
        {guidelines.map((guideline, index) => (
          <motion.div
            key={guideline.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenGuideline(openGuideline === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10">
                  <div className="text-orange-600">
                    {guideline.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {guideline.category}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    {guideline.rules.length} guidelines
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-stone-400 transition-transform duration-300 ${
                  openGuideline === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {openGuideline === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 pt-2">
                    {/* Rules */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-stone-900 mb-3">Rules:</h4>
                      <ul className="space-y-2">
                        {guideline.rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-stone-700">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Examples */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <h5 className="font-semibold text-green-800">Good Examples</h5>
                        </div>
                        <ul className="space-y-2">
                          {guideline.examples.good.map((example, idx) => (
                            <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <h5 className="font-semibold text-red-800">Bad Examples</h5>
                        </div>
                        <ul className="space-y-2">
                          {guideline.examples.bad.map((example, idx) => (
                            <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Enforcement */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-6">Enforcement</h3>
        
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl p-6">
          <p className="text-stone-600 mb-6">
            We take violations of these guidelines seriously. Our enforcement actions 
            are designed to be fair, transparent, and proportional to the violation.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {enforcement.map((item, index) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-stone-200 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-stone-100">
                    <div className="text-stone-600">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-stone-900">{item.level}</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-stone-500">Action For</div>
                    <div className="text-sm text-stone-700">{item.action}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-500">Result</div>
                    <div className="text-sm text-stone-700">{item.result}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-stone-200">
            <h4 className="font-semibold text-stone-900 mb-2">Appeals Process</h4>
            <p className="text-sm text-stone-600">
              If you believe an enforcement action was taken in error, you may appeal 
              the decision within 30 days by contacting our community team. Appeals 
              are reviewed by a human moderator and typically resolved within 7 days.
            </p>
          </div>
        </div>
      </div>

      {/* Reporting */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-6">Report Violations</h3>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <p className="text-stone-600 mb-6">
            Help us keep the community safe by reporting violations of these guidelines. 
            All reports are confidential and reviewed by our moderation team.
          </p>
          
          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                What would you like to report?
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the guideline violation you've observed..."
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Type of Violation
              </label>
              <select className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Select violation type</option>
                <option>Harassment or abuse</option>
                <option>Hate speech or discrimination</option>
                <option>Safety concern</option>
                <option>Fake profile or impersonation</option>
                <option>Spam or advertising</option>
                <option>Inappropriate content</option>
                <option>Other violation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center">
                <p className="text-stone-500 mb-2">Screenshots or supporting evidence</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm"
                >
                  Upload Files
                </button>
                <p className="text-xs text-stone-400 mt-2">Maximum file size: 10MB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                Submit Report
              </button>
              <a
                href="/safety"
                className="text-sm text-stone-600 hover:text-orange-600 hover:underline"
              >
                View safety resources instead
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Community Commitment */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Together We Travel Better</h3>
          <p className="text-stone-300 mb-6">
            By following these guidelines, we create a community where everyone 
            feels welcome, safe, and inspired to explore the world together. 
            Thank you for being a responsible member of our travel community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-colors">
              I Agree to These Guidelines
            </button>
            <a
              href="/community"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Community
            </a>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-8 text-center text-sm text-stone-500">
        <p>
          These Community Guidelines were last updated on{' '}
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}.
        </p>
        <p className="mt-2">
          For questions about these guidelines, contact{' '}
          <a href="mailto:community@travelbuddy.com" className="text-orange-600 hover:underline">
            community@travelbuddy.com
          </a>
        </p>
      </div>
    </div>
  )
}