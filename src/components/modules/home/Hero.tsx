"use client";
import { motion, Variants } from "framer-motion";
import {
    SparklesIcon,
    ArrowRightIcon,
} from "lucide-react";
import AISuggestions from "@/components/shared/AISuggestions";

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
                            <button className="cursor-pointer group px-8 py-4 gradient-sunset text-white font-semibold rounded-full shadow-lg shadow-(--color-coral)/30 hover:shadow-xl hover:shadow-(--color-coral)/40 transition-all duration-300 flex items-center gap-2">
                                Start Exploring
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white text-(--color-charcoal) font-semibold rounded-full border-2 border-(--color-sand-dark) hover:border-(--color-coral) hover:text-(--color-coral) transition-colors duration-300">
                               Find Travel Buddy
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
                        <AISuggestions />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
