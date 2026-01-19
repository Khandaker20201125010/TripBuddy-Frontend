/* eslint-disable react/no-unescaped-entities */
'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { 
  ShieldCheck, 
  Globe2, 
  MessageSquare, 
  Users, 
  Heart, 
  Clock 
} from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified & Safe Community',
    description: 'All users go through ID verification and background checks for your peace of mind.',
    color: 'var(--color-teal)',
  },
  {
    icon: Globe2,
    title: 'Global Network',
    description: 'Connect with travelers from 120+ countries across all continents.',
    color: 'var(--color-blue)',
  },
  {
    icon: MessageSquare,
    title: 'Built-in Chat System',
    description: 'Secure messaging platform to plan trips and get to know your travel buddy.',
    color: 'var(--color-coral)',
  },
  {
    icon: Users,
    title: 'Group Travel Options',
    description: 'Find or create group trips with 3+ travelers for shared experiences.',
    color: 'var(--color-sunset)',
  },
  {
    icon: Heart,
    title: 'Shared Interests Matching',
    description: 'Match based on hobbies, food preferences, photography, adventure levels and more.',
    color: 'var(--color-coral)',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Find companions for weekend getaways, month-long adventures, or last-minute trips.',
    color: 'var(--color-teal)',
  },
]

export function WhyChooseUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  return (
    <section ref={ref} className="py-24 bg-(--color-warm-white)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-(--color-sand) text-(--color-charcoal) text-sm font-medium mb-4">
            Why Travel Buddy?
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-4">
            More Than Just Matching
          </h2>
          <p className="text-xl text-(--color-charcoal)/60 max-w-2xl mx-auto">
            We've built a complete ecosystem for safe, enjoyable, and memorable travel experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="h-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-(--color-sand)/50 group-hover:border-(--color-sand-dark)">
                <div className="flex items-start gap-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${feature.color}15`,
                    }}
                  >
                    <feature.icon 
                      className="w-7 h-7"
                      style={{ color: feature.color }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-(--color-charcoal) mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-(--color-charcoal)/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover effect line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-coral)] to-transparent transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 pt-12 border-t border-(--color-sand-dark)"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-(--color-charcoal) mb-2">98%</div>
              <div className="text-(--color-charcoal)/60">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-(--color-charcoal) mb-2">24/7</div>
              <div className="text-(--color-charcoal)/60">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-(--color-charcoal) mb-2">4.9★</div>
              <div className="text-(--color-charcoal)/60">App Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-(--color-charcoal) mb-2">30+</div>
              <div className="text-(--color-charcoal)/60">Languages</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}