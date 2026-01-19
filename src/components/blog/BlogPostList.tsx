'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, User, Clock, Heart, MessageCircle, Eye, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'How I Found My Perfect Travel Buddy in Bali',
    excerpt: 'The story of how two strangers from different continents became lifelong friends while exploring Bali.',
    category: 'Buddy Stories',
    author: 'Sarah Johnson',
    date: 'Mar 15, 2024',
    readTime: '6 min read',
    likes: 245,
    comments: 42,
    views: '2.4k',
    image: '/blog/bali.jpg'
  },
  {
    id: 2,
    title: '10 Essential Safety Tips for Solo Female Travelers',
    excerpt: 'Practical advice from experienced solo travelers to ensure your safety and peace of mind.',
    category: 'Safety First',
    author: 'Maria Rodriguez',
    date: 'Mar 10, 2024',
    readTime: '8 min read',
    likes: 189,
    comments: 38,
    views: '1.8k',
    image: '/blog/safety.jpg'
  },
  {
    id: 3,
    title: 'Japan on a Budget: 7-Day Itinerary Under $1000',
    excerpt: 'Experience the beauty of Japan without breaking the bank with this comprehensive budget guide.',
    category: 'Budget Travel',
    author: 'David Chen',
    date: 'Mar 5, 2024',
    readTime: '10 min read',
    likes: 312,
    comments: 56,
    views: '3.1k',
    image: '/blog/japan.jpg'
  },
  {
    id: 4,
    title: 'Photography Guide: Capturing Authentic Travel Moments',
    excerpt: 'Learn how to take stunning travel photos that tell stories, not just snapshots.',
    category: 'Travel Photography',
    author: 'Lisa Wang',
    date: 'Feb 28, 2024',
    readTime: '7 min read',
    likes: 156,
    comments: 29,
    views: '1.5k',
    image: '/blog/photography.jpg'
  },
  {
    id: 5,
    title: 'Hidden Gems of Eastern Europe Most Tourists Miss',
    excerpt: 'Discover breathtaking destinations in Eastern Europe that are still under the radar.',
    category: 'Hidden Gems',
    author: 'Alex Petrov',
    date: 'Feb 22, 2024',
    readTime: '9 min read',
    likes: 278,
    comments: 47,
    views: '2.7k',
    image: '/blog/europe.jpg'
  },
  {
    id: 6,
    title: 'From Solo to Social: Overcoming Travel Anxiety',
    excerpt: 'How joining travel buddy groups transformed one traveler\'s experience and built confidence.',
    category: 'Travel Tips',
    author: 'Michael Torres',
    date: 'Feb 18, 2024',
    readTime: '5 min read',
    likes: 201,
    comments: 33,
    views: '1.9k',
    image: '/blog/anxiety.jpg'
  }
]

export function BlogPostList() {
  return (
    <div className="mb-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            {/* Featured Image */}
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-orange-600/20">
                  {post.category.charAt(0)}
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-orange-600">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-stone-600 mb-4">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-stone-500 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-stone-600">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{post.views}</span>
                  </div>
                </div>

                <a
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1 text-orange-600 font-medium hover:gap-2 transition-all"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors">
            ←
          </button>
          <button className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center">
            1
          </button>
          <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors">
            3
          </button>
          <span className="px-2 text-stone-500">...</span>
          <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors">
            8
          </button>
          <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors">
            →
          </button>
        </div>
      </div>
    </div>
  )
}