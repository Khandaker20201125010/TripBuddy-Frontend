/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Send } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubscribed(true)
    setEmail('')
    
    // Reset subscription status after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000)
  }

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Mail className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Stay Updated
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Travel Insights
          </h2>
          
          <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for weekly travel tips, destination guides, 
            and inspiring stories from our community.
          </p>
        </div>

        {isSubscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're Subscribed!</h3>
            <p className="text-stone-300">
              Welcome to our travel community. Check your inbox for our welcome email.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Subscribe
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-stone-400">
                By subscribing, you agree to our{' '}
                <a href="/privacy-policy" className="text-orange-300 hover:text-orange-400 underline">
                  Privacy Policy
                </a>
                . No spam, ever.
              </p>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10,000+</div>
            <div className="text-sm text-stone-400">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">98%</div>
            <div className="text-sm text-stone-400">Open Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">Weekly</div>
            <div className="text-sm text-stone-400">Updates</div>
          </div>
        </div>
      </div>
    </div>
  )
}