/* eslint-disable react/no-unescaped-entities */
'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { StarIcon, QuoteIcon } from 'lucide-react'
import Image from 'next/image'
const testimonials = [
    {
        name: 'Jessica Chen',
        location: 'San Francisco, USA',
        avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        trip: 'Japan Adventure',
        quote:
            'I was nervous about solo travel to Japan, but Travel Buddy matched me with Sarah who had the same itinerary. We became best friends and are already planning our next trip together!',
        rating: 5,
    },
    {
        name: 'Marcus Williams',
        location: 'London, UK',
        avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        trip: 'Bali Retreat',
        quote:
            'The AI matching is incredible. It paired me with travelers who share my love for surfing and photography. Split costs, shared experiences, made memories for life.',
        rating: 5,
    },
    {
        name: 'Elena Rodriguez',
        location: 'Barcelona, Spain',
        avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        trip: 'Peru Expedition',
        quote:
            'As a solo female traveler, safety was my priority. The verified profiles and compatibility matching gave me confidence to connect with amazing travel companions.',
        rating: 5,
    },
]
export function Testimonials() {
    const ref = useRef(null)
    const isInView = useInView(ref, {
        once: true,
        margin: '-100px',
    })
    return (
        <section ref={ref} className="py-24 bg-(--color-warm-white)">
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
                    <span className="inline-block px-4 py-2 rounded-full bg-(--color-sand) text-(--color-coral) text-sm font-medium mb-4">
                        Traveler Stories
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-4">
                        Adventures Made Together
                    </h2>
                    <p className="text-xl text-(--color-charcoal)/60 max-w-2xl mx-auto">
                        Real stories from travelers who found their perfect companions
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
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
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
                        >
                            <QuoteIcon className="absolute top-6 right-6 w-8 h-8 text-(--color-sand-dark)" />

                            <div className="flex items-center gap-4 mb-6">
                                <Image
                                    width={56}
                                    height={56}
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-(--color-sand)"
                                />
                                <div>
                                    <h3 className="font-semibold text-(--color-charcoal)">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-(--color-charcoal)/60">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className="w-4 h-4 fill-(--color-sunset) text-(--color-sunset)"
                                    />
                                ))}
                            </div>

                            <p className="text-(--color-charcoal)/70 leading-relaxed mb-4">
                                "{testimonial.quote}"
                            </p>

                            <div className="pt-4 border-t border-(--color-sand)">
                                <span className="text-sm font-medium text-(--color-teal)">
                                    {testimonial.trip}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
