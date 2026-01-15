/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MapPin, Menu, X, Shield, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

import { Button } from '../ui/button'
import { setCookie, deleteCookie } from '@/services/auth/tokenHandlers'
import { useNotifications } from '@/hooks/connections/useNotifications'
import NotificationPanel from '../NotificationIcon/NotificationPanel'
import { NavbarAvatar } from '../ui/NavbarAvatar'


const loggedOutNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Explore Travelers', href: '/explore-travelers' },
  { name: 'Find Travel Buddy', href: '/find-travel-buddy' },
]

const loggedInNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Explore Travelers', href: '/explore-travelers' },
  { name: 'Travel Plans', href: '/my-travel-plans' },
  { name: 'Community', href: '/community' },
]

const loggedInAdminNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/adminDashboard/adminProfile' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Get notifications with proper authentication check
  const { totalNotifications, isAuthenticated: notificationsAuthenticated } = useNotifications();

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      // Check for Refresh Error
      if ((session as any).error === "RefreshAccessTokenError") {
        signOut({ callbackUrl: '/login' });
        return;
      }
      // Sync cookie for middleware usage
      setCookie('accessToken', session.accessToken, { path: '/', maxAge: 3600 });
    } else if (status === 'unauthenticated') {
      // Cleanup
      deleteCookie('accessToken');
    }
  }, [session, status]);

  // Close notifications and user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close notifications if clicking outside
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        const panel = document.querySelector('.notification-panel');
        if (panel && !panel.contains(event.target as Node)) {
          setShowNotifications(false);
        }
      }

      // Close user menu if clicking outside (only on desktop)
      if (window.innerWidth >= 768 && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auth check
  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';

  // Determine which nav links to show
  let currentNavLinks = loggedOutNavLinks;
  if (isAuthenticated) {
    currentNavLinks = isAdmin ? loggedInAdminNavLinks : loggedInNavLinks;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    // Handle admin dashboard paths
    if (href.includes('/adminDashboard')) {
      return pathname.startsWith('/adminDashboard');
    }
    // Handle user profile paths
    if (href.includes('/profile') || href.includes('/dashboard')) {
      return pathname.startsWith(href);
    }
    return pathname.startsWith(href)
  }

  // User menu items for dropdown (desktop only)
  const userMenuItems = [
    {
      name: 'Dashboard',
      href: isAdmin ? '/adminDashboard/adminProfile' : '/dashboard/profile',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      name: 'Logout',
      action: () => signOut({ callbackUrl: '/' }),
      icon: <LogOut className="h-4 w-4" />
    }
  ];

  // User menu items for mobile menu (text only)
  const mobileUserMenuItems = [
    {
      name: 'Dashboard',
      href: isAdmin ? '/adminDashboard' : '/dashboard/profile',
      icon: <LayoutDashboard className="h-4 w-4" />
    }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-stone-200 shadow-sm'
          : 'bg-transparent border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-sunset flex items-center justify-center">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="font-display text-lg md:text-xl font-bold text-(--color-charcoal)">
                TravelBuddy
              </span>
              {isAdmin && (
                <div className="hidden md:flex items-center gap-1 ml-2 px-2 py-1 bg-purple-100 rounded-full">
                  <Shield className="h-3 w-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">Admin</span>
                </div>
              )}
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
                          ? isAdmin
                            ? 'text-purple-600'
                            : 'text-(--color-coral)'
                          : 'text-(--color-charcoal)/70 hover:text-(--color-coral)'
                        }
                      `}
                    >
                      {link.name}
                      {active && (
                        <span
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isAdmin ? 'bg-purple-600' : 'bg-(--color-coral)'
                            }`}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* DESKTOP RIGHT SECTION - Notification + User Avatar (768px and above) */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {/* Notification Bell - Show for regular users and admin */}
              {isAuthenticated && !isAdmin && (
                <div className="relative" ref={notificationRef}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full border-stone-200 bg-white/50 backdrop-blur hover:bg-white h-9 w-9 lg:h-10 lg:w-10"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-stone-700" />
                    {/* Only show notification badge if authenticated AND has notifications */}
                    {notificationsAuthenticated && totalNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {totalNotifications > 9 ? '9+' : totalNotifications}
                        </span>
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* User Avatar Dropdown - Only on desktop */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors"
                  >
                    <NavbarAvatar
                      src={session?.user?.image || session?.user?.picture || undefined}
                      name={session?.user?.name}
                      size="md"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-(--color-charcoal) truncate max-w-[120px]">
                        {session?.user?.name || 'User'}
                      </p>
                      {!isAdmin && (
                        <p className="text-xs text-stone-500 truncate max-w-[120px]">
                          {session?.user?.email}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50"
                      >
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-stone-100">
                          <div className="flex items-center gap-3">
                            <NavbarAvatar
                              src={session?.user?.image}
                              name={session?.user?.name}
                              size="md"
                            />
                            <div>
                              <p className="font-medium text-(--color-charcoal)">
                                {session?.user?.name || 'User'}
                              </p>
                              <p className="text-sm text-stone-500 truncate">
                                {session?.user?.email}
                              </p>
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                              <Shield className="h-3 w-3 text-purple-600" />
                              <span className="text-xs font-medium text-purple-700">Admin</span>
                            </div>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {userMenuItems.map((item) => (
                            item.href ? (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-(--color-coral) transition-colors"
                              >
                                <span className="text-stone-400">{item.icon}</span>
                                <span>{item.name}</span>
                              </Link>
                            ) : (
                              <button
                                key={item.name}
                                onClick={() => {
                                  item.action?.();
                                  setShowUserMenu(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors"
                              >
                                <span className="text-stone-400">{item.icon}</span>
                                <span>{item.name}</span>
                              </button>
                            )
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Login Button for non-authenticated users
                <Link href="/login">
                  <Button className="px-5 py-2 gradient-sunset text-white font-semibold rounded-full text-sm lg:text-base h-9 lg:h-10">
                    Log In
                  </Button>
                </Link>
              )}
            </div>

            {/* MOBILE RIGHT SECTION (Below 768px) */}
            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && !isAdmin && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full border-stone-200 bg-white/50 backdrop-blur hover:bg-white h-9 w-9"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-4 w-4 text-stone-700" />
                    {/* Only show notification badge if authenticated AND has notifications */}
                    {notificationsAuthenticated && totalNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {totalNotifications > 9 ? '9+' : totalNotifications}
                        </span>
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* Mobile menu button - NO AVATAR ON MOBILE */}
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

        {/* MOBILE MENU (Below 768px) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-200 shadow-lg"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
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
                          ? isAdmin
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-(--color-coral)/10 text-(--color-coral)'
                          : 'text-(--color-charcoal) hover:bg-stone-50'
                        }
                      `}
                    >
                      {link.name}
                      {active && (
                        <div
                          className={`ml-2 h-1.5 w-1.5 rounded-full ${isAdmin ? 'bg-purple-600' : 'bg-(--color-coral)'
                            }`}
                        />
                      )}
                    </Link>
                  )
                })}

                <div className="pt-4 mt-4 border-t border-stone-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {/* User Info in Mobile - Shows name only */}
                      <div className="px-4 py-3 mb-2 bg-stone-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {/* Show small avatar in mobile menu */}
                          <NavbarAvatar
                            src={session?.user?.image}
                            name={session?.user?.name}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-(--color-charcoal)">
                              {session?.user?.name || 'User'}
                            </p>
                            <p className="text-sm text-stone-500">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile User Menu Items - Text only */}
                      {mobileUserMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                        >
                          <span className="text-stone-400">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      ))}

                      {/* Logout Button in Mobile Menu */}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>

                      {!isAdmin && (
                        <div className="px-4 py-2 text-sm text-stone-500">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span>
                              {notificationsAuthenticated && totalNotifications > 0
                                ? `${totalNotifications} notification${totalNotifications !== 1 ? 's' : ''}`
                                : 'No notifications'
                              }
                            </span>
                          </div>
                        </div>
                      )}
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

      {/* NOTIFICATION PANEL */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}