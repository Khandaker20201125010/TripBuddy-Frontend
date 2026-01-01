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
} from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  Product: ['Features', 'Pricing', 'Destinations', 'Mobile App', 'Safety'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
  Resources: [
    'Help Center',
    'Community',
    'Travel Guides',
    'Events',
    'Partners',
  ],
  Legal: [
    'Privacy Policy',
    'Terms of Service',
    'Cookie Policy',
    'Accessibility',
  ],
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px',
  })

  return (
    <footer ref={ref} className="bg-linear-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-100 max-w-[1440px] mx-auto">
      
      {/* CTA Section */}
      <div className="border-b border-orange-800/20">
        <div className="w-full mx-auto px-6 py-20 bg-linear-to-r from-stone-800/50 to-stone-900/50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your{' '}
              <span className="text-gradient-sunset">Travel Buddy?</span>
            </h2>

            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers already connecting and exploring the
              world together.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
             <Link href="/register">
              <button className="px-8 py-4 gradient-sunset text-white font-semibold rounded-full shadow-lg shadow-(--color-coral)/30 hover:shadow-xl hover:shadow-(--color-coral)/40 transition-all duration-300">
                Start Your Journey Free
              </button>
             </Link>

            </div>
          </motion.div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-full mx-auto px-6 py-16  bg-stone-900">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                TravelBuddy
              </span>
            </div>

            <p className="text-white/60 text-sm mb-6">
              Connecting travelers worldwide for shared adventures and
              unforgettable experiences.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-(--color-coral) transition-colors"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-(--color-coral) transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-(--color-coral) transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Dynamic Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
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
            © {new Date().getFullYear()}  TravelBuddy. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <MailIcon className="w-4 h-4" />
            <span>hello@travelbuddy.com</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
