'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MapPin, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Button } from '../ui/button'
import { getCookie } from '@/services/auth/tokenHandlers'
import Logoutbutton from './Logoutbutton'

import { useNotifications } from '@/hooks/connections/useNotifications'
import NotificationPanel from '../NotificationIcon/NotificationPanel'

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
  { name: 'Travel Plans', href: '/my-travel-plans' },
  { name: 'Profile', href: '/profile' },
]

// ---------------- NAVBAR ----------------

export function Navbar() {
  const pathname = usePathname()
  const { status } = useSession()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const { totalNotifications } = useNotifications();

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 backdrop-blur-lg border-b border-stone-200 shadow-sm'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-sunset flex items-center justify-center">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="font-display text-lg md:text-xl font-bold text-(--color-charcoal)">
              TravelBuddy
            </span>
          </Link>

          {/* DESKTOP NAV LINKS - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
            <div className="flex items-center gap-6 lg:gap-8">
              {currentNavLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      relative font-medium transition-colors text-sm lg:text-base
                      ${active
                        ? 'text-(--color-coral)'
                        : 'text-(--color-charcoal)/70 hover:text-(--color-coral)'
                      }
                    `}
                  >
                    {link.name}

                    {/* Active underline */}
                    {active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-(--color-coral) rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* DESKTOP RIGHT SECTION - Notification + Auth */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full border-stone-200 bg-white/50 backdrop-blur hover:bg-white h-9 w-9 lg:h-10 lg:w-10"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-stone-700" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {totalNotifications > 9 ? '9+' : totalNotifications}
                    </span>
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <NotificationPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <Logoutbutton />
            ) : (
              <Link href="/login">
                <Button className="px-5 py-2 gradient-sunset text-white font-semibold rounded-full text-sm lg:text-base h-9 lg:h-10">
                  Log In
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE RIGHT SECTION - Notification + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Notification Bell - Only for authenticated users */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full border-stone-200 bg-white/50 backdrop-blur hover:bg-white h-9 w-9"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4 text-stone-700" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">
                        {totalNotifications > 9 ? '9+' : totalNotifications}
                      </span>
                    </span>
                  )}
                </Button>

                <AnimatePresence>
                  {showNotifications && (
                    <NotificationPanel
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-(--color-charcoal) hover:text-(--color-coral) hover:bg-stone-100 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-5 w-5" />
              ) : (
                <Menu className="block h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-200 shadow-lg"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {/* Mobile Navigation Links */}
              {currentNavLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg font-medium transition-colors
                      ${active
                        ? 'bg-(--color-coral)/10 text-(--color-coral)'
                        : 'text-(--color-charcoal) hover:bg-stone-50'
                      }
                    `}
                  >
                    {link.name}
                    {active && (
                      <div className="ml-2 h-1.5 w-1.5 rounded-full bg-(--color-coral)" />
                    )}
                  </Link>
                )
              })}

              {/* Mobile Auth Section */}
              <div className="pt-4 mt-4 border-t border-stone-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {/* Mobile Logout Button */}
                    <div onClick={() => setIsOpen(false)}>
                      <Logoutbutton />
                    </div>
                    
                    {/* Mobile Notification Text */}
                    <div className="px-4 py-2 text-sm text-stone-500">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>
                          {totalNotifications > 0 
                            ? `${totalNotifications} notification${totalNotifications !== 1 ? 's' : ''}`
                            : 'No notifications'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="gradient" className="w-full py-3 text-base">
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