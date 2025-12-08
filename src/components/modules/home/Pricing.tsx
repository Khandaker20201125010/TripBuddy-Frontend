'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { CheckIcon, SparklesIcon } from 'lucide-react'
const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    description: 'Perfect for trying out the platform',
    features: [
      'Browse traveler profiles',
      'Basic destination search',
      '3 connection requests/month',
      'Community forums access',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Adventurer',
    price: '$12',
    period: '/month',
    description: 'For active travelers seeking companions',
    features: [
      'Everything in Explorer',
      'AI-powered matching',
      'Unlimited connections',
      'Priority profile visibility',
      'Trip planning tools',
      'In-app messaging',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Globetrotter',
    price: '$29',
    period: '/month',
    description: 'For serious travelers and groups',
    features: [
      'Everything in Adventurer',
      'Advanced AI recommendations',
      'Group trip coordination',
      'Verified badge',
      'Priority support',
      'Exclusive events access',
      'Travel deals & discounts',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
]
export function Pricing() {
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
            Simple Pricing
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-xl text-(--color-charcoal)/60 max-w-2xl mx-auto">
            Start free and upgrade as you explore more of the world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
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
              className={`relative rounded-2xl p-8 flex flex-col ${plan.highlighted ? 'bg-linear-to-b from-orange-300 to-orange-500 text-white shadow-xl scale-105' : 'bg-white shadow-sm'}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-(--color-coral) text-white text-sm font-medium">
                  <SparklesIcon className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-semibold mb-2 ${plan.highlighted ? 'text-white' : 'text-(--color-charcoal)'}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-(--color-charcoal)'}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={
                        plan.highlighted
                          ? 'text-white/70'
                          : 'text-(--color-charcoal)/60'
                      }
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${plan.highlighted ? 'text-white/80' : 'text-(--color-charcoal)/60'}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon
                      className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-(--color-sunset)' : 'text-(--color-teal)'}`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-(--color-charcoal)/70'}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${plan.highlighted ? 'bg-white text-(--color-teal) hover:bg-(--color-sand)' : 'bg-(--color-sand) text-(--color-charcoal) hover:bg-(--color-teal) hover:text-white'}`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                }
              : {}
          }
          transition={{
            duration: 0.6,
            delay: 0.6,
          }}
          className="text-center mt-8 text-(--color-charcoal)/60"
        >
          All paid plans include a 14-day free trial. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}
