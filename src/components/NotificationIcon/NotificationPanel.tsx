/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, MapPin, Bell, Calendar, User, AlertCircle, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/hooks/connections/useNotifications';
import { useEffect, useRef } from 'react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { 
    connectionRequests, 
    tripRequests, 
    loading, 
    error,
    handleConnectionAction,
    handleTripAction,
    refresh,
    totalNotifications
  } = useNotifications();

  const panelRef = useRef<HTMLDivElement>(null);

  // Combine and sort all notifications
  const allNotifications = [
    ...connectionRequests.map(req => ({ 
      ...req, 
      type: 'connection' as const, 
      date: req.createdAt,
      id: `conn-${req.id}` 
    })),
    ...tripRequests.map(req => ({ 
      ...req, 
      type: 'trip' as const, 
      date: req.createdAt,
      id: `trip-${req.id}` 
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-[85vw] md:w-96 bg-white shadow-2xl z-[80] flex flex-col border-l border-stone-200"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/50">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-(--color-coral)" />
                <h2 className="font-display font-bold text-lg text-stone-800">Notifications</h2>
                {totalNotifications > 0 && (
                  <span className="bg-(--color-coral) text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-6 h-6 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refresh()}
                  disabled={loading}
                  className="p-2 hover:bg-stone-200 rounded-full transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-100"
                    onClick={() => refresh()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {loading && allNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-coral) mb-4" />
                  <p className="text-stone-500">Loading notifications...</p>
                </div>
              )}

              {!loading && allNotifications.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                  <Bell className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No notifications</p>
                  <p className="text-sm text-center px-8">
                    Connection and trip requests will appear here.
                  </p>
                </div>
              )}

              {!loading && allNotifications.length > 0 && (
                <div className="space-y-4">
                  {allNotifications.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Connection Request */}
                      {item.type === 'connection' && (
                        <>
                          <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                            <User className="w-3 h-3 text-blue-500" />
                            <span>Connection Request</span>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={item.sender?.profileImage} alt={item.sender?.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {item.sender?.name?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                                <User className="w-3 h-3 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 space-y-3">
                              <div>
                                <p className="font-semibold text-sm text-stone-800">
                                  {item.sender?.name || 'User'}
                                </p>
                                <p className="text-xs text-stone-500">Wants to connect with you</p>
                                <p className="text-xs text-stone-400 mt-1">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="h-8 flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                  onClick={() => handleConnectionAction(item.id.replace('conn-', ''), 'ACCEPTED')}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-3 text-stone-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300 text-xs"
                                  onClick={() => handleConnectionAction(item.id.replace('conn-', ''), 'REJECTED')}
                                >
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Trip Request */}
                      {item.type === 'trip' && (
                        <>
                          <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                            <MapPin className="w-3 h-3 text-orange-500" />
                            <span className="truncate">{item.travelPlan?.destination || 'Trip'}</span>
                            <span className="mx-1">•</span>
                            <Calendar className="w-3 h-3 text-orange-500" />
                            <span>{new Date(item.travelPlan?.startDate).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={item.user?.profileImage} alt={item.user?.name} />
                                <AvatarFallback className="bg-orange-100 text-orange-600">
                                  {item.user?.name?.[0]?.toUpperCase() || 'T'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1 border-2 border-white">
                                <Calendar className="w-3 h-3 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 space-y-3">
                              <div>
                                <p className="font-semibold text-sm text-stone-800">
                                  {item.user?.name || 'Traveler'}
                                </p>
                                <p className="text-xs text-stone-500">Wants to join your trip</p>
                                <p className="text-xs text-stone-400 mt-1">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="h-8 flex-1 bg-gradient-to-r from-(--color-coral) to-orange-500 hover:from-orange-600 hover:to-(--color-coral) text-white text-xs"
                                  onClick={() => handleTripAction(item.id.replace('trip-', ''), 'APPROVED')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-3 text-stone-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300 text-xs"
                                  onClick={() => handleTripAction(item.id.replace('trip-', ''), 'REJECTED')}
                                >
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel Footer */}
            {!loading && allNotifications.length > 0 && (
              <div className="p-4 border-t border-stone-100 bg-stone-50">
                <p className="text-xs text-stone-500 text-center">
                  {totalNotifications} notification{totalNotifications !== 1 ? 's' : ''} • 
                  <button 
                    onClick={() => refresh()}
                    className="ml-1 text-(--color-coral) hover:underline"
                  >
                    Refresh
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}