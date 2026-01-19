'use client'
import { motion } from 'framer-motion'
import { 
  UserCircle, 
  MapPin, 
  Users, 
  Shield, 
  CreditCard, 
  MessageSquare,
  Settings,
  HelpCircle,
  Bell,
  Globe,
  FileText,
  Smartphone
} from 'lucide-react'

const categories = [
  {
    icon: <UserCircle className="h-8 w-8" />,
    title: 'Account & Profile',
    description: 'Manage your account, profile settings, and preferences',
    articles: 12,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: 'Travel Plans',
    description: 'Create, edit, and manage your travel plans',
    articles: 8,
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Connections',
    description: 'Find, connect, and chat with travel buddies',
    articles: 15,
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Safety & Security',
    description: 'Stay safe and secure while traveling',
    articles: 10,
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: 'Payments & Subscriptions',
    description: 'Manage payments, subscriptions, and billing',
    articles: 6,
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: 'Communication',
    description: 'Messaging, notifications, and chat features',
    articles: 9,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: 'Technical Support',
    description: 'App issues, troubleshooting, and technical help',
    articles: 14,
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: 'Notifications',
    description: 'Manage notifications and alerts',
    articles: 5,
    color: 'from-yellow-500 to-amber-500'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Platform Features',
    description: 'Learn about all Travel Buddy features',
    articles: 11,
    color: 'from-teal-500 to-green-500'
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Policies & Guidelines',
    description: 'Terms, privacy, and community guidelines',
    articles: 7,
    color: 'from-gray-500 to-stone-500'
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: 'Mobile App',
    description: 'Using Travel Buddy on mobile devices',
    articles: 8,
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: <HelpCircle className="h-8 w-8" />,
    title: 'Getting Started',
    description: 'Beginner guides and first steps',
    articles: 13,
    color: 'from-cyan-500 to-blue-500'
  }
]

export function HelpCategories() {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Browse by Category
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Find help articles organized by topic
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.a
            key={category.title}
            href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.color} mb-4`}>
              <div className="text-white">
                {category.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
              {category.title}
            </h3>
            
            <p className="text-stone-600 text-sm mb-4">
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">
                {category.articles} articles
              </span>
              <span className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">142</div>
          <div className="text-sm text-blue-700 font-medium">Help Articles</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
          <div className="text-sm text-green-700 font-medium">Satisfaction Rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">15min</div>
          <div className="text-sm text-orange-700 font-medium">Avg. Response Time</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-sm text-purple-700 font-medium">Support Available</div>
        </div>
      </div>
    </div>
  )
}