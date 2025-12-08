/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import {
    SparklesIcon,
    BrainIcon,
    HeartIcon,
    MapIcon,
    ShieldCheckIcon,
    ZapIcon,
} from 'lucide-react'
import Image from 'next/image'
const features = [
    {
        icon: BrainIcon,
        title: 'Smart Preference Learning',
        description:
            'Our AI learns from your travel history and preferences to improve matches over time.',
    },
    {
        icon: HeartIcon,
        title: 'Personality Compatibility',
        description:
            'Beyond destinations—we match based on travel pace, budget, and social preferences.',
    },
    {
        icon: MapIcon,
        title: 'Itinerary Suggestions',
        description:
            'Get AI-curated travel plans based on combined interests of you and your matches.',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Verified Profiles',
        description:
            'All travelers are verified for safety, giving you peace of mind when connecting.',
    },
    {
        icon: ZapIcon,
        title: 'Instant Matching',
        description:
            'Real-time matching as soon as you set your destination and travel dates.',
    },
    {
        icon: SparklesIcon,
        title: 'Compatibility Score',
        description:
            'Transparent scoring shows exactly why you and a traveler are a great match.',
    },
]
export function AIFeature() {
    const [positions, setPositions] = React.useState<number[][]>([]);
    const ref = useRef(null)
    const isInView = useInView(ref, {
        once: true,
        margin: '-100px',
    })

    React.useEffect(() => {
        setPositions([0, 1, 2, 3, 4, 5].map(i => [
            50 + 40 * Math.sin((i * Math.PI * 2) / 6),
            50 + 40 * Math.cos((i * Math.PI * 2) / 6)
        ]));
    }, []);
    return (
        <section
            ref={ref}
            className="py-24 bg-var(--color-warm-white) overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Visual */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -50,
                        }}
                        animate={
                            isInView
                                ? {
                                    opacity: 1,
                                    x: 0,
                                }
                                : {}
                        }
                        transition={{
                            duration: 0.8,
                        }}
                        className="relative"
                    >
                        <div className="relative aspect-square max-w-lg mx-auto">
                            {/* Central AI brain */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="w-40 h-40 rounded-full gradient-sunset flex items-center justify-center shadow-2xl shadow-(--color-coral)/30"
                                >
                                    <SparklesIcon className="w-16 h-16 text-white" />
                                </motion.div>
                            </div>

                            {/* Orbiting elements */}
                            {positions.length > 0 &&
                                [0, 1, 2, 3, 4, 5].map((i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            top: `${positions[i][0]}%`,
                                            left: `${positions[i][1]}%`,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                        className="absolute w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center"
                                    >
                                        <Image
                                            width={40}
                                            height={40}
                                            src={`https://images.unsplash.com/photo-${['1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e', '1534528741775-53994a69daeb', '1500648767791-00dcc994a43e'][i]}?w=60&h=60&fit=crop&crop=face`}
                                            alt="Traveler"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </motion.div>
                                ))}


                            {/* Connection lines */}
                            <svg
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    zIndex: -1,
                                }}
                            >
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <motion.line
                                        key={i}
                                        x1="50%"
                                        y1="50%"
                                        x2={`${positions[i]?.[1] ?? 50}%`}
                                        y2={`${positions[i]?.[0] ?? 50}%`}
                                        stroke="var(--color-sand-dark)"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                        initial={{ pathLength: 0 }}
                                        animate={isInView ? { pathLength: 1 } : {}}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                    />

                                ))}
                            </svg>
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <div>
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
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--color-coral)/10 text-(--color-coral) text-sm font-medium mb-6">
                                <SparklesIcon className="w-4 h-4 " />
                                AI-Powered Matching
                            </span>

                            <h2 className="font-display text-4xl md:text-5xl font-bold text-(--color-charcoal) mb-6">
                                Intelligent Travel Companion Matching
                            </h2>

                            <p className="text-xl text-(--color-charcoal)/60 mb-10 leading-relaxed">
                                Our proprietary AI doesn't just match destinations—it
                                understands the nuances of travel compatibility to find your
                                perfect adventure partner.
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
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
                                        duration: 0.5,
                                        delay: 0.2 + index * 0.1,
                                    }}
                                    className="flex gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-(--color-sand) flex items-center justify-center shrink-0">
                                        <feature.icon className="w-5 h-5 text-(--color-teal)" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-(--color-charcoal) mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-(--color-charcoal)/60">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
