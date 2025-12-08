"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
    SparklesIcon,
    MapPinIcon,
    UsersIcon,
    ArrowRightIcon,
} from "lucide-react";
import Image from "next/image";

// Container variant
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

// Item variant
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

// AI Demo variant
const aiDemoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
    },
};

// Match card variant
const matchCardVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
    }),
};

const travelMatches = [
    {
        name: "Sarah K.",
        destination: "Bali, Indonesia",
        match: 94,
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        interests: ["Photography", "Hiking"],
    },
    {
        name: "Marcus T.",
        destination: "Bali, Indonesia",
        match: 89,
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        interests: ["Surfing", "Food"],
    },
    {
        name: "Elena R.",
        destination: "Bali, Indonesia",
        match: 87,
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        interests: ["Yoga", "Culture"],
    },
];

export function Hero() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-(--color-warm-white)">
            {/* Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
                <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-(--color-coral) blur-[120px]" />
                <div className="absolute bottom-40 right-40 w-72 h-72 rounded-full bg-(--color-sunset) blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--color-sand) text-(--color-teal) text-sm font-medium mb-6"
                        >
                            <SparklesIcon className="w-4 h-4 text-(--color-coral)" />
                            AI-Powered Travel Matching
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-(--color-charcoal) leading-[1.1] mb-6"
                        >
                            Find Your Perfect{" "}
                            <span className="text-gradient-sunset">Travel Buddy</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-(--color-charcoal)/70 leading-relaxed mb-8 max-w-xl"
                        >
                            Our AI analyzes your travel style, interests, and preferences to
                            match you with compatible companions heading to the same
                            destinations.
                        </motion.p>

                        {/* Feature */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-(--color-card) rounded-2xl p-6 shadow-lg shadow-(--color-coral)/10 border border-(--color-sand-dark) mb-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center shrink-0">
                                    <SparklesIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-(--color-charcoal) mb-1">
                                        Smart Travel Plan Matching
                                    </h3>
                                    <p className="text-(--color-charcoal)/60 text-sm leading-relaxed">
                                        Tell us your travel dreams and preferences. Our AI instantly
                                        finds the TOP travel plans and companions that match your
                                        unique style.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <button className="group px-8 py-4 gradient-sunset text-white font-semibold rounded-full shadow-lg shadow-(--color-coral)/30 hover:shadow-xl hover:shadow-(--color-coral)/40 transition-all duration-300 flex items-center gap-2">
                                Start Matching Free
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white text-(--color-charcoal) font-semibold rounded-full border-2 border-(--color-sand-dark) hover:border-(--color-coral) hover:text-(--color-coral) transition-colors duration-300">
                                See How It Works
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-8 mt-12 pt-8 border-t border-(--color-sand-dark)"
                        >
                            <div>
                                <div className="text-3xl font-bold text-(--color-charcoal)">
                                    50K+
                                </div>
                                <div className="text-sm text-(--color-charcoal)/60">
                                    Active Travelers
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-(--color-charcoal)">
                                    120+
                                </div>
                                <div className="text-sm text-(--color-charcoal)/60">
                                    Countries
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-(--color-charcoal)">
                                    15K+
                                </div>
                                <div className="text-sm text-(--color-charcoal)/60">
                                    Trips Matched
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right */}
                    <motion.div
                        variants={aiDemoVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative"
                    >
                        <div className="relative bg-(--color-card) rounded-3xl shadow-2xl shadow-(--color-charcoal)/10 overflow-hidden">
                            {/* Header */}
                            <div className="bg-linear-to-r from-(--color-teal) to-(--color-blue) p-6">
                                <div className="flex items-center gap-3 text-white/80 text-sm mb-4">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span>Your Destination</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Image
                                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=80&h=80&fit=crop"
                                        alt="Bali"
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                    <div>
                                        <h3 className="text-white font-semibold text-xl">
                                            Bali, Indonesia
                                        </h3>
                                        <p className="text-white/70 text-sm">Dec 15 - Dec 28, 2024</p>
                                    </div>
                                </div>
                            </div>

                            {/* Matches */}
                            <div className="p-6 space-y-3">
                                {travelMatches.map((match, i) => (
                                    <motion.div
                                        key={match.name}
                                        custom={i}
                                        variants={matchCardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex items-center gap-4 p-4 rounded-xl bg-r(--color-sand)/50 hover:bg-(--color-sand) transition-colors cursor-pointer group"
                                    >
                                        <Image
                                            src={match.avatar}
                                            alt={match.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-(--color-charcoal)">
                                                    {match.name}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-(--color-charcoal)/50">
                                                    <UsersIcon className="w-3 h-3" />
                                                    {match.interests.join(" • ")}
                                                </div>
                                            </div>
                                            <p className="text-sm text-(--color-charcoal)/60 truncate">
                                                {match.destination}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-(--color-coral)">
                                                {match.match}%
                                            </div>
                                            <div className="text-xs text-(--color-charcoal)/50">
                                                match
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
