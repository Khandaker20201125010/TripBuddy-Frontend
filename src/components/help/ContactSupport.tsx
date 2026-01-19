/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Send,
  HelpCircle,
  FileText,
  Video
} from 'lucide-react'

const contactMethods = [
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: 'Live Chat',
    description: 'Instant support from our team',
    responseTime: 'Within 5 minutes',
    availability: '24/7',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Mail className="h-8 w-8" />,
    title: 'Email Support',
    description: 'Detailed assistance via email',
    responseTime: 'Within 24 hours',
    availability: '24/7',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <HelpCircle className="h-8 w-8" />,
    title: 'Help Desk',
    description: 'Submit and track support tickets',
    responseTime: 'Within 12 hours',
    availability: 'Business Hours',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: 'Video Call',
    description: 'One-on-one screen sharing support',
    responseTime: 'Schedule appointment',
    availability: 'By Appointment',
    color: 'from-purple-500 to-pink-500'
  }
]

const commonIssues = [
  'Account access problems',
  'Payment and billing issues',
  'Travel plan creation errors',
  'Connection and messaging problems',
  'App crashes or bugs',
  'Privacy and security concerns',
  'Feature requests',
  'General feedback'
]

export function ContactSupport() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', issueType: '', description: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Contact Support
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Choose the best way to get help from our support team
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactMethods.map((method, index) => (
          <motion.button
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedMethod(method.title)}
            className={`bg-white rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
              selectedMethod === method.title
                ? 'border-orange-500 shadow-lg'
                : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
            }`}
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${method.color} mb-4`}>
              <div className="text-white">
                {method.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              {method.title}
            </h3>
            
            <p className="text-stone-600 text-sm mb-4">
              {method.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Clock className="h-4 w-4" />
                <span>{method.responseTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <CheckCircle className="h-4 w-4" />
                <span>{method.availability}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Support Form */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-8 border-b border-stone-100">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-6 w-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-stone-900">
              {selectedMethod ? `Contact via ${selectedMethod}` : 'Submit Support Request'}
            </h3>
          </div>
          <p className="text-stone-600">
            Fill out the form below and we'll get back to you as soon as possible
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-stone-900 mb-2">Request Submitted!</h4>
            <p className="text-stone-600 mb-6">
              We've received your support request and will respond based on your selected method.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-xl hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Submit Another Request
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Issue Type *
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select an issue type</option>
                {commonIssues.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Common Issues (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {commonIssues.slice(0, 4).map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, issueType: issue }))}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors text-sm"
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Clock className="h-4 w-4" />
                <span>Average response time: 2-4 hours</span>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Additional Resources */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-6 w-6 text-blue-600" />
            <h4 className="text-lg font-bold text-stone-900">Emergency Contact</h4>
          </div>
          <p className="text-stone-600 text-sm mb-4">
            For urgent safety concerns or emergencies while traveling
          </p>
          <div className="text-blue-700 font-medium">+1 (555) 123-4567</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-green-600" />
            <h4 className="text-lg font-bold text-stone-900">Documentation</h4>
          </div>
          <p className="text-stone-600 text-sm mb-4">
            Browse our complete documentation and API references
          </p>
          <a href="/docs" className="text-green-700 font-medium hover:underline">
            View Documentation →
          </a>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-6 w-6 text-orange-600" />
            <h4 className="text-lg font-bold text-stone-900">Community Forum</h4>
          </div>
          <p className="text-stone-600 text-sm mb-4">
            Get help from fellow travelers and community experts
          </p>
          <a href="/community/forum" className="text-orange-700 font-medium hover:underline">
            Visit Forum →
          </a>
        </div>
      </div>
    </div>
  )
}