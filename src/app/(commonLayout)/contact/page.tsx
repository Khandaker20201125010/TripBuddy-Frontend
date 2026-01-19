/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      value: 'hello@travelbuddy.com',
      desc: 'We\'ll respond within 24 hours'
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      desc: 'Mon-Fri, 9am-6pm EST'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Location',
      value: 'San Francisco, CA',
      desc: 'Based in California'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Response Time',
      value: 'Within 24 hours',
      desc: 'For all inquiries'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6"
          >
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Let's Connect</span>
            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              We're Here to Help
            </span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Have questions about finding travel buddies? Need help with your account? 
            Reach out to our friendly support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900">{info.title}</h4>
                      <p className="text-lg text-stone-700">{info.value}</p>
                      <p className="text-sm text-stone-500 mt-1">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-stone-900 mb-4">Common Questions</h4>
              <ul className="space-y-3">
                {[
                  'How do I find travel buddies?',
                  'Is Travel Buddy free to use?',
                  'How do I create a travel plan?',
                  'What safety measures are in place?'
                ].map((question, idx) => (
                  <li key={idx}>
                    <a href="/faq" className="text-stone-600 hover:text-orange-600 transition-colors text-sm">
                      • {question}
                    </a>
                  </li>
                ))}
              </ul>
              <a 
                href="/faq" 
                className="inline-flex items-center gap-2 text-orange-600 font-medium mt-6 hover:gap-3 transition-all"
              >
                View all FAQs
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Send us a message</h3>
              <p className="text-stone-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-stone-900 mb-2">Message Sent!</h4>
                  <p className="text-stone-600">We've received your message and will respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full py-4 gradient-sunset text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-stone-500 text-center">
                    By submitting this form, you agree to our{' '}
                    <a href="/privacy-policy" className="text-orange-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { name: 'Twitter', url: 'https://twitter.com', color: 'bg-blue-500' },
                { name: 'Instagram', url: 'https://instagram.com', color: 'bg-pink-500' },
                { name: 'Facebook', url: 'https://facebook.com', color: 'bg-blue-600' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} text-white rounded-xl p-4 text-center hover:opacity-90 transition-opacity`}
                >
                  <div className="text-sm font-medium">{social.name}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}