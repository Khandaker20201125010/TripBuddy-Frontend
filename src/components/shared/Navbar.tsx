'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Button } from '../ui/button'
import { getCookie } from '@/services/auth/tokenHandlers'
import Logoutbutton from './Logoutbutton'

// ---------------- NAV LINKS ----------------

// Logged OUT users
const loggedOutNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Explore Travelers', href: '/explore-travelers' },
  { name: 'Find Travel Buddy', href: '/find-travel-buddy' },
]

// Logged IN users
const loggedInNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Explore Travelers', href: '/explore-travelers' },
  { name: 'My Travel Plans', href: '/my-travel-plans' },
  { name: 'Profile', href: '/profile' },
]

// ---------------- NAVBAR ----------------

export function Navbar() {
  const pathname = usePathname()
  const { status } = useSession()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Read token from cookie
  useEffect(() => {
    async function fetchToken() {
      const token = await getCookie('accessToken')
      setAccessToken(token)
    }
    fetchToken()
  }, [])

  // Auth check
  const isAuthenticated = !!accessToken || status === 'authenticated'

  // Select nav links
  const currentNavLinks = isAuthenticated
    ? loggedInNavLinks
    : loggedOutNavLinks

  // Active link checker (supports nested routes)
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/60 backdrop-blur-lg border-b border-stone-200'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-(--color-charcoal)">
              TravelBuddy
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {currentNavLinks.map((link) => {
              const active = isActive(link.href)

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    relative font-medium transition-colors
                    ${
                      active
                        ? 'text-(--color-coral)'
                        : 'text-(--color-charcoal)/70 hover:text-(--color-coral)'
                    }
                  `}
                >
                  {link.name}

                  {/* Active underline */}
                  {active && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-(--color-coral) rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* DESKTOP AUTH CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Logoutbutton />
            ) : (
              <Link href="/login">
                <button className="px-6 py-2 gradient-sunset text-white font-semibold rounded-full">
                  Log In
                </button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-(--color-warm-white) border-t border-(--color-sand-dark)"
          >
            <div className="px-6 py-6 space-y-4">
              {currentNavLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        active
                          ? 'bg-(--color-coral)/10 text-(--color-coral)'
                          : 'text-(--color-charcoal)'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                )
              })}

              <div className="pt-4 border-t space-y-3">
                {isAuthenticated ? (
                  <Logoutbutton />
                ) : (
                  <Link href="/login">
                    <Button variant="gradient" className="w-full">
                      Log In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
