/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Linkedin, Twitter, Globe, Mail } from 'lucide-react'

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Former travel blogger turned entrepreneur. Passionate about connecting people through shared experiences.',
    image: '/team/alex.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  },
  {
    name: 'Maria Rodriguez',
    role: 'Head of Community',
    bio: '10+ years in community building. Believes travel breaks barriers and builds bridges between cultures.',
    image: '/team/maria.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  },
  {
    name: 'James Wilson',
    role: 'CTO',
    bio: 'Tech enthusiast with a passion for travel. Built scalable platforms for 15+ years.',
    image: '/team/james.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  },
  {
    name: 'Sarah Johnson',
    role: 'Safety Director',
    bio: 'Former safety consultant for major travel companies. Ensures secure connections for all users.',
    image: '/team/sarah.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  },
  {
    name: 'David Kim',
    role: 'Head of Product',
    bio: 'Product designer with UX expertise. Focused on creating intuitive travel experiences.',
    image: '/team/david.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  },
  {
    name: 'Lisa Wang',
    role: 'Marketing Director',
    bio: 'Digital marketing expert. Spent 8 years promoting travel brands worldwide.',
    image: '/team/lisa.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  }
]

export function TeamSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Meet Our Team
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Passionate travelers building the future of shared adventures
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            <div className="p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 p-1">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 text-center mb-2">
                {member.name}
              </h3>
              <div className="text-lg text-orange-600 font-medium text-center mb-4">
                {member.role}
              </div>

              <p className="text-stone-600 text-center mb-6">
                {member.bio}
              </p>

              <div className="flex justify-center space-x-4">
                <a
                  href={member.social.linkedin}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={member.social.twitter}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-blue-100 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={member.social.website}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-green-100 hover:text-green-600 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@travelbuddy.com`}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-stone-900 mb-4">
            Join Our Journey
          </h3>
          <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate individuals to join our mission of connecting travelers worldwide.
          </p>
          <a
            href="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            View Open Positions
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}