'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import {
  MapPinIcon,
  MailIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  Users,
  Globe,
  Compass,
  Shield,
  FileText,
} from 'lucide-react'
import Link from 'next/link'

const footerLinks: Record<string, Array<{ name: string; href: string; icon?: React.ReactNode }>> = {
  Travel: [
    { name: 'Find Travel Buddy', href: '/find-travel-buddy', icon: <Users className="w-4 h-4" /> },
    { name: 'Explore Travelers', href: '/explore-travelers', icon: <Globe className="w-4 h-4" /> },
    { name: 'Travel Plans', href: '/my-travel-plans', icon: <Compass className="w-4 h-4" /> },
    { name: 'Community', href: '/community', icon: <Users className="w-4 h-4" /> },
  ],
  Account: [
    { name: 'My Profile', href: '/dashboard/profile' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Travel Plans', href: '/my-travel-plans' },
    { name: 'Notifications', href: '/dashboard/notifications' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Safety Guidelines', href: '/safety', icon: <Shield className="w-4 h-4" /> },
  ],
  Resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'Travel Guides', href: '/guides' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Community Guidelines', href: '/guidelines', icon: <FileText className="w-4 h-4" /> },
  ],
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px',
  })

  return (
    <footer ref={ref} className="bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-100">
      {/* CTA Section */}
      <div className="border-b border-orange-800/20">
        <div className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-stone-800/50 to-stone-900/50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                Travel Buddy?
              </span>
            </h2>

            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers already connecting and exploring the world together.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300">
                  Start Your Journey Free
                </button>
              </Link>

              <Link href="/find-travel-buddy">
                <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                  Explore Travelers
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                TravelBuddy
              </span>
            </div>

            <p className="text-white/60 text-sm mb-6">
              Connecting travelers worldwide for shared adventures and unforgettable experiences.
              Find your perfect travel companion today.
            </p>

            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Dynamic Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2"
                    >
                      {link.icon && <span className="opacity-60">{link.icon}</span>}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-800/20 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} TravelBuddy. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy-policy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center gap-2 text-stone-400">
              <MailIcon className="w-4 h-4" />
              <span>hello@travelbuddy.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}