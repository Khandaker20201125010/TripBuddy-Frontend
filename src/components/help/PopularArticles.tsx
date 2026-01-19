'use client'
import { motion } from 'framer-motion'
import { Star, TrendingUp, Clock, Eye, ThumbsUp, MessageSquare, BookOpen, ArrowRight } from 'lucide-react'

const popularArticles = [
  {
    id: 1,
    title: 'How to Create Your First Travel Plan',
    category: 'Getting Started',
    views: '12.4k',
    helpful: '98%',
    readTime: '5 min',
    rating: 4.9,
    featured: true
  },
  {
    id: 2,
    title: 'Safety Tips for Meeting Travel Buddies',
    category: 'Safety & Security',
    views: '8.7k',
    helpful: '96%',
    readTime: '7 min',
    rating: 4.8,
    featured: true
  },
  {
    id: 3,
    title: 'Understanding Subscription Plans',
    category: 'Payments',
    views: '6.3k',
    helpful: '95%',
    readTime: '4 min',
    rating: 4.7,
    featured: false
  },
  {
    id: 4,
    title: 'Complete Profile Setup Guide',
    category: 'Account',
    views: '5.8k',
    helpful: '97%',
    readTime: '6 min',
    rating: 4.9,
    featured: false
  },
  {
    id: 5,
    title: 'How to Find Compatible Travel Buddies',
    category: 'Connections',
    views: '9.2k',
    helpful: '94%',
    readTime: '8 min',
    rating: 4.6,
    featured: false
  },
  {
    id: 6,
    title: 'Troubleshooting Common App Issues',
    category: 'Technical',
    views: '4.5k',
    helpful: '92%',
    readTime: '10 min',
    rating: 4.5,
    featured: false
  },
  {
    id: 7,
    title: 'Managing Notifications and Alerts',
    category: 'Notifications',
    views: '3.9k',
    helpful: '91%',
    readTime: '3 min',
    rating: 4.4,
    featured: false
  },
  {
    id: 8,
    title: 'Privacy Settings Explained',
    category: 'Account',
    views: '5.1k',
    helpful: '97%',
    readTime: '5 min',
    rating: 4.8,
    featured: false
  }
]

export function PopularArticles() {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-stone-900 mb-2">Most Helpful Articles</h2>
          <p className="text-stone-600">Based on user ratings and helpfulness</p>
        </div>
        <div className="flex items-center gap-2 text-orange-600">
          <TrendingUp className="h-5 w-5" />
          <span className="font-medium">Trending</span>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {popularArticles
          .filter(article => article.featured)
          .map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-white text-orange-700 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm font-medium">{article.rating}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                {article.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Views</div>
                    <div className="text-sm font-medium">{article.views}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Helpful</div>
                    <div className="text-sm font-medium">{article.helpful}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Read Time</div>
                    <div className="text-sm font-medium">{article.readTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500">Comments</div>
                    <div className="text-sm font-medium">42</div>
                  </div>
                </div>
              </div>
              
              <a
                href={`/help/article/${article.id}`}
                className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
      </div>

      {/* All Popular Articles */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h3 className="text-2xl font-bold text-stone-900">All Popular Articles</h3>
        </div>
        
        <div className="divide-y divide-stone-100">
          {popularArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                      <span className="text-xs font-medium">{article.rating}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-stone-900 mb-2">
                    {article.title}
                  </h4>
                  
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{article.helpful} helpful</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime} read</span>
                    </div>
                  </div>
                </div>
                
                <a
                  href={`/help/article/${article.id}`}
                  className="ml-4 text-orange-600 hover:text-orange-700"
                >
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reading Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 text-center">
          <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-700 mb-1">142</div>
          <div className="text-sm text-blue-600">Articles Available</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
          <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-700 mb-1">95%</div>
          <div className="text-sm text-green-600">Average Helpfulness</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 text-center">
          <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-orange-700 mb-1">6 min</div>
          <div className="text-sm text-orange-600">Avg. Read Time</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 text-center">
          <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-purple-700 mb-1">2.1k</div>
          <div className="text-sm text-purple-600">User Comments</div>
        </div>
      </div>
    </div>
  )
}