'use client'
import  { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { UserPlusIcon, SparklesIcon, UsersIcon, PlaneIcon } from 'lucide-react'
const steps = [
  {
    icon: UserPlusIcon,
    title: 'Create Your Profile',
    description:
      "Tell us about your travel style, interests, and what you're looking for in a travel companion.",
    color: 'var(--color-coral)',
  },
  {
    icon: SparklesIcon,
    title: 'AI Finds Your Matches',
    description:
      'Our smart algorithm analyzes thousands of travelers to find the most compatible companions for your trip.',
    color: 'var(--color-sunset)',
  },
  {
    icon: UsersIcon,
    title: 'Connect & Plan Together',
    description:
      'Chat with your matches, share itineraries, and plan your adventure together in our collaborative space.',
    color: 'var(--color-blue)',
  },
  {
    icon: PlaneIcon,
    title: 'Travel & Make Memories',
    description:
      'Meet up at your destination and create unforgettable experiences with your new travel buddy.',
    color: 'var(--color-teal)',
  },
]
export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })
  return (
    <section ref={ref} className="py-24 bg-(--color-sand)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.6,
          }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white text-(--color-teal) text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-4">
            How It Works
          </h2>
          <p className="text-xl text-(--color-charcoal)/60 max-w-2xl mx-auto">
            From solo traveler to adventure squad in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-(--color-sand-dark) to-transparent" />
              )}

              <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${step.color}15`,
                  }}
                >
                  <step.icon
                    className="w-8 h-8"
                    style={{
                      color: step.color,
                    }}
                  />
                </div>

                <div className="text-sm font-medium text-(--color-charcoal)/40 mb-2">
                  Step {index + 1}
                </div>

                <h3 className="text-xl font-semibold text-(--color-charcoal) mb-3">
                  {step.title}
                </h3>

                <p className="text-(--color-charcoal)/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
