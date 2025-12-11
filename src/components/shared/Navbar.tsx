'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

const navLinks = [
    { name: 'Explore Travelers', href: '/explore-travelers' },
    { name: 'Find Travel Buddy', href: '#find-travel-buddy' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handler)
        return () => window.removeEventListener("scroll", handler)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/60 backdrop-blur-lg border-b border-stone-200"
                    : "bg-transparent backdrop-blur-0 border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display text-xl font-bold text-(--color-charcoal)">
                            TravelBuddy
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-(--color-charcoal)/70 hover:text-(--color-coral) transition-colors font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">

                      <Link href="/login">  <button className="cursor-pointer px-6 py-2.5 gradient-sunset text-white font-semibold rounded-full shadow-md shadow-(--color-coral)/20 hover:shadow-lg hover:shadow-(--color-coral)/30 transition-all duration-300">
                            Log In
                        </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-(--color-warm-white) border-t border-(--color-sand-dark)"
                    >
                        <div className="px-6 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-(--color-charcoal) font-medium py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}

                            <div className="pt-4 border-t border-(--color-sand-dark) space-y-3">
                               <Link href="/login">
                                <Button variant="gradient" size="default">
                                    Log In
                                </Button>
                                </Link>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
