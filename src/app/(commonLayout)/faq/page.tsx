/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { ChevronDown, Search, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqCategories = [
  {
    name: 'Getting Started',
    color: 'from-blue-500 to-cyan-500',
    icon: '🚀',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button on the top right of any page. You can sign up with your email address or use Google to quickly create an account.'
      },
      {
        question: 'Is Travel Buddy free to use?',
        answer: 'Yes! Creating an account and basic features are completely free. We offer premium subscriptions for additional features like unlimited travel plans and advanced matching.'
      },
      {
        question: 'How do I create my first travel plan?',
        answer: 'Go to "My Travel Plans" in your dashboard and click "Create New Plan". Fill in your destination, dates, budget, and travel preferences.'
      }
    ]
  },
  {
    name: 'Finding Travel Buddies',
    color: 'from-orange-500 to-pink-500',
    icon: '👥',
    questions: [
      {
        question: 'How do I find compatible travel buddies?',
        answer: 'Use our "Find Travel Buddy" feature to search for travelers heading to the same destination with similar dates. You can filter by interests, travel style, and age.'
      },
      {
        question: 'Is it safe to meet travel buddies?',
        answer: 'We prioritize safety with verified profiles, reviews, and in-app messaging. We recommend meeting in public places first and trusting your instincts.'
      },
      {
        question: 'Can I connect with travelers in specific age groups?',
        answer: 'Yes! Our search filters allow you to find travelers in specific age ranges that match your preferences.'
      }
    ]
  },
  {
    name: 'Account & Profile',
    color: 'from-green-500 to-emerald-500',
    icon: '👤',
    questions: [
      {
        question: 'How do I edit my profile?',
        answer: 'Go to your dashboard and click "Edit Profile". You can update your photo, bio, travel interests, and visited countries.'
      },
      {
        question: 'What happens if I forget my password?',
        answer: 'Click "Forgot Password" on the login page. We\'ll send a password reset link to your email address.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account from the settings page. Please note this action is permanent and will remove all your data.'
      }
    ]
  },
  {
    name: 'Safety & Security',
    color: 'from-purple-500 to-pink-500',
    icon: '🛡️',
    questions: [
      {
        question: 'How does Travel Buddy ensure safety?',
        answer: 'We have multiple safety measures including profile verification, user reviews, in-app messaging, and safety guidelines. We also provide tips for safe meetups.'
      },
      {
        question: 'What should I do if I encounter inappropriate behavior?',
        answer: 'Immediately report the user through their profile or contact our support team. We take all reports seriously and will investigate promptly.'
      },
      {
        question: 'Are my payment details secure?',
        answer: 'Yes, we use industry-standard encryption and never store your full payment details. All transactions are processed through secure payment gateways.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleQuestion = (questionId: string) => {
    setOpenItems(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const allQuestions = faqCategories.flatMap(category =>
    category.questions.map(q => ({
      ...q,
      category: category.name,
      categoryColor: category.color
    }))
  )

  const filteredQuestions = searchQuery
    ? allQuestions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allQuestions

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Find Answers to</span>
            <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Common Questions
            </span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Can't find what you're looking for?{' '}
            <a href="/contact" className="text-orange-600 hover:underline font-medium">
              Contact our support team
            </a>
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-stone-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {faqCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${category.color} mb-4`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">{category.name}</h3>
                <p className="text-stone-600 text-sm">
                  {category.questions.length} questions
                </p>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredQuestions.map((item, index) => (
              <motion.div
                key={`${item.category}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mb-4"
              >
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(`${item.category}-${index}`)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${item.categoryColor} bg-clip-text text-transparent border border-current`}>
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-stone-400 transition-transform duration-300 ${
                        openItems.includes(`${item.category}-${index}`) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(`${item.category}-${index}`) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-stone-100">
                          <p className="text-stone-600">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* No results */}
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                <Search className="h-10 w-10 text-stone-400" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">
                No results found
              </h3>
              <p className="text-stone-600">
                Try different keywords or{' '}
                <a href="/contact" className="text-orange-600 hover:underline font-medium">
                  contact support
                </a>
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
                Our support team is here to help you with any questions about using Travel Buddy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Contact Support
                </a>
                <a
                  href="/help"
                  className="px-8 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-full hover:border-orange-500 hover:text-orange-600 transition-all"
                >
                  Visit Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}