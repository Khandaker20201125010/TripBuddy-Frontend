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
                <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-(--color-coral) blur-[80px] sm:blur-[100px] lg:blur-[120px]" />
                <div className="absolute bottom-20 sm:bottom-40 right-20 sm:right-40 w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full bg-(--color-sunset) blur-[60px] sm:blur-[80px] lg:blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 lg:pt-32 pb-16 md:pb-20">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                    {/* Left */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-(--color-sand) text-(--color-teal) text-xs md:text-sm font-medium mb-4 md:mb-6"
                        >
                            <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 text-(--color-coral)" />
                            AI-Powered Travel Matching
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-(--color-charcoal) leading-[1.1] mb-4 md:mb-6"
                        >
                            Find Your Perfect{" "}
                            <span className="text-gradient-sunset">Travel Buddy</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-base md:text-xl text-(--color-charcoal)/70 leading-relaxed mb-6 md:mb-8 max-w-xl"
                        >
                            Our AI analyzes your travel style, interests, and preferences to
                            match you with compatible companions heading to the same
                            destinations.
                        </motion.p>

                        {/* Feature */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-(--color-card) rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg shadow-(--color-coral)/10 border border-(--color-sand-dark) mb-6 md:mb-8"
                        >
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl gradient-sunset flex items-center justify-center shrink-0">
                                    <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm md:text-base text-(--color-charcoal) mb-1">
                                        Smart Travel Plan Matching
                                    </h3>
                                    <p className="text-xs md:text-sm text-(--color-charcoal)/60 leading-relaxed">
                                        Tell us your travel dreams and preferences. Our AI instantly
                                        finds the TOP travel plans and companions that match your
                                        unique style.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 md:gap-4">
                            <button className="cursor-pointer group px-6 py-3 md:px-8 md:py-4 gradient-sunset text-white font-semibold rounded-full shadow-lg shadow-(--color-coral)/30 hover:shadow-xl hover:shadow-(--color-coral)/40 transition-all duration-300 flex items-center gap-2 text-sm md:text-base">
                                Start Exploring
                                <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-(--color-charcoal) font-semibold rounded-full border-2 border-(--color-sand-dark) hover:border-(--color-coral) hover:text-(--color-coral) transition-colors duration-300 text-sm md:text-base">
                               Find Travel Buddy
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-(--color-sand-dark)"
                        >
                            <div>
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-(--color-charcoal)">
                                    50K+
                                </div>
                                <div className="text-xs md:text-sm text-(--color-charcoal)/60">
                                    Active Travelers
                                </div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-(--color-charcoal)">
                                    120+
                                </div>
                                <div className="text-xs md:text-sm text-(--color-charcoal)/60">
                                    Countries
                                </div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-(--color-charcoal)">
                                    15K+
                                </div>
                                <div className="text-xs md:text-sm text-(--color-charcoal)/60">
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
                        className="relative lg:mt-0 mt-8 md:mt-12"
                    >
                        <AISuggestions />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
