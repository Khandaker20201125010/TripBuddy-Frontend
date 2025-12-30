/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { 
  UserPlus, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Loader2,
  Globe,
  Languages,
  CalendarDays,
  Award,
  Shield,
  Plane,
  Star,
  Ban,
  RefreshCw,
  Zap,
  Crown,
  Gem,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useConnection } from '@/hooks/connections/useConnection'
import { Traveler } from '@/types/travel'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { PaymentModal } from '@/components/payment/PaymentModal'
import api from '@/lib/axios'
import { connectionManager } from '@/hooks/connections/connectionManager'

interface TravelerCardProps {
  traveler: Traveler
  index: number
}

export function TravelerCard({ traveler, index }: TravelerCardProps) {
  const { sendRequest, isLoading: isConnectionLoading } = useConnection();
  const router = useRouter();
  const { data: session } = useSession();
 
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionDirection, setConnectionDirection] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  
  
  // Memoized calculations
  const userObj = useMemo(() => traveler.user || traveler, [traveler]);
  const profileId = useMemo(() => {
    const id = userObj.id || traveler.userId || traveler.id;
    return id || '';
  }, [userObj, traveler.userId, traveler.id]);
  
  const isSelf = useMemo(() =>
    session?.user?.id === profileId,
    [session?.user?.id, profileId]
  );

  // Optimistically update connection status
  const updateConnectionOptimistically = (status: string | null, direction: string | null, id: string | null) => {
    setConnectionStatus(status);
    setConnectionDirection(direction);
    setConnectionId(id);
  };

  // Fetch actual connection status from server
  const fetchConnectionStatus = async () => {
    if (!session?.user?.id || !profileId || isSelf) return;
    setIsCheckingConnection(true);
    try {
      // Get ALL connections (including REJECTED)
      const allConnectionsRes = await api.get('/connections/all');
      if (allConnectionsRes.data.success) {
        const allConnections = allConnectionsRes.data.data;
        // Find any connection with this user
        const connectionWithUser = allConnections.find((conn: any) => 
          (conn.senderId === session.user.id && conn.receiverId === profileId) ||
          (conn.senderId === profileId && conn.receiverId === session.user.id)
        );
        if (connectionWithUser) {
          const direction = connectionWithUser.senderId === session.user.id ? 'sent' : 'received';
          updateConnectionOptimistically(connectionWithUser.status, direction, connectionWithUser.id);
        } else {
          updateConnectionOptimistically(null, null, null);
        }
      }
    } catch (error) {
      console.error('Error fetching connection status:', error);
      // Fallback: Check individual endpoints
      try {
        // Check buddies (ACCEPTED)
        const buddiesRes = await api.get('/connections/buddies');
        if (buddiesRes.data.success) {
          const buddies = buddiesRes.data.data;
          const existingConnection = buddies.find((buddy: any) => 
            (buddy.sender.id === session.user.id && buddy.receiver.id === profileId) ||
            (buddy.sender.id === profileId && buddy.receiver.id === session.user.id)
          );
          if (existingConnection) {
            const direction = existingConnection.sender.id === session.user.id ? 'sent' : 'received';
            updateConnectionOptimistically('ACCEPTED', direction, existingConnection.id);
            setIsCheckingConnection(false);
            return;
          }
        }

        // Check incoming requests (PENDING received)
        const incomingRes = await api.get('/connections/incoming');
        if (incomingRes.data.success) {
          const incomingRequests = incomingRes.data.data;
          const incomingFromThisUser = incomingRequests.find((req: any) => 
            req.sender?.id === profileId
          );
          if (incomingFromThisUser) {
            updateConnectionOptimistically('PENDING', 'received', incomingFromThisUser.id);
            setIsCheckingConnection(false);
            return;
          }
        }

        // If we can't find any connection, set to null
        updateConnectionOptimistically(null, null, null);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        updateConnectionOptimistically(null, null, null);
      }
    } finally {
      setIsCheckingConnection(false);
    }
  };

  // Subscribe to connection updates
  useEffect(() => {
    if (!session?.user?.id || !profileId || isSelf) return;

    const unsubscribe = connectionManager.subscribe(session.user.id, (event) => {
      // Check if this update is for the current user in the card
      if (event.userId === profileId) {
        updateConnectionOptimistically(event.status, event.direction, event.connectionId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [session?.user?.id, profileId, isSelf]);

  // Initialize connection status
  useEffect(() => {
    if (!userObj) return;

    const currentUserId = session?.user?.id;
    const user = userObj as any;

    // First, use data from props if available
    if (traveler.connectionInfo) {
      updateConnectionOptimistically(
        traveler.connectionInfo.status,
        traveler.connectionInfo.direction || null,
        traveler.connectionInfo.id || null
      );
      return;
    }

    if (traveler.connectionStatus) {
      updateConnectionOptimistically(
        traveler.connectionStatus,
        traveler.connectionDirection || null,
        null
      );
      return;
    }

    if (user.connectionInfo) {
      updateConnectionOptimistically(
        user.connectionInfo.status,
        user.connectionInfo.direction || null,
        user.connectionInfo.id || null
      );
      return;
    }

    // If no props data, fetch from server
    if (currentUserId && profileId && !isSelf) {
      fetchConnectionStatus();
    } else {
      updateConnectionOptimistically(null, null, null);
    }
  }, [userObj, traveler.connectionStatus, traveler.connectionDirection, traveler.connectionInfo, session?.user?.id, profileId, isSelf]);

  // Handle connect request with instant updates
  const handleConnectClick = async () => {
    // Authentication check
    if (!session?.user || !session.accessToken) {
      return Swal.fire({
        title: 'Login Required',
        text: 'You need to log in to connect with travelers.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Log In',
        confirmButtonColor: '#8b5cf6',
        background: '#1c1917',
        color: '#fafaf9',
        customClass: { popup: 'rounded-2xl border border-stone-700' }
      }).then((result) => {
        if (result.isConfirmed) router.push('/login');
      });
    }

    if (isSelf) return toast.error("You can't connect with yourself");
    if (!profileId) return toast.error("Unable to connect: Invalid Profile ID");

    const isRejected = connectionStatus === "REJECTED";
    // OPTIMISTIC UPDATE: Immediately show loading state
    setLocalLoading(true);

    // If connection was previously REJECTED, delete it first
    if (isRejected && connectionId) {
      try {
        // OPTIMISTIC UPDATE: Immediately clear the rejected state
        updateConnectionOptimistically(null, null, null);
        // Notify connection manager about deletion
        connectionManager.notifyConnectionRemoved(session.user.id, profileId, connectionId);
        // Delete the rejected connection
        await api.delete(`/connections/${connectionId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        toast.success("Previous connection removed");
        
        // Fetch latest connection status
        await fetchConnectionStatus();
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        // Now send new connection request
        await sendNewConnectionRequest();
      } catch (error: any) {
        console.error('Error deleting rejected connection:', error);
        // ROLLBACK: If deletion fails, revert to previous state
        updateConnectionOptimistically('REJECTED', connectionDirection, connectionId);
        // Fetch actual status from server
        await fetchConnectionStatus();
        toast.error("Failed to reset connection. Please try again.");
        setLocalLoading(false);
        return;
      }
    } else {
      // If not rejected, just send new request
      await sendNewConnectionRequest();
    }
  };

  // Separate function for sending new connection request with optimistic updates
  const sendNewConnectionRequest = async () => {
    try {
      // OPTIMISTIC UPDATE: Immediately show as PENDING
      updateConnectionOptimistically('PENDING', 'sent', null);
      // Notify connection manager about new request
      connectionManager.notify(session!.user!.id, {
        userId: profileId,
        status: 'PENDING',
        direction: 'sent',
        connectionId: null
      });
      const result = await sendRequest(profileId, session!.accessToken!);

      if (result) {
        // Update with actual data from server
        updateConnectionOptimistically('PENDING', 'sent', result.id || null);
        // Notify connection manager with actual connection ID
        connectionManager.notify(session!.user!.id, {
          userId: profileId,
          status: 'PENDING',
          direction: 'sent',
          connectionId: result.id || null
        });
        toast.success("Connection request sent!");
        
        // Fetch latest status from server to confirm
        await fetchConnectionStatus();
      }
    } catch (error: any) {
      // ROLLBACK: If request fails, revert to no connection
      updateConnectionOptimistically(null, null, null);
      // Notify connection manager about failure
      connectionManager.notify(session!.user!.id, {
        userId: profileId,
        status: null,
        direction: null,
        connectionId: null
      });
      // Fetch actual status from server after error
      await fetchConnectionStatus();
      // Handle limits
      if (error?.statusCode === 403 || error?.message?.toLowerCase().includes("limit")) {
        return Swal.fire({
          title: 'Upgrade Required',
          text: error.message || 'Connect with more travelers by upgrading your plan.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Upgrade',
          confirmButtonColor: '#8b5cf6',
          background: '#1c1917',
          color: '#fafaf9',
          customClass: { popup: 'rounded-2xl border border-stone-700' }
        }).then((result) => {
          if (result.isConfirmed) setIsPricingOpen(true);
        });
      }

      // Handle conflicts (already exists)
      if (error?.statusCode === 409) {
        // Refresh connection status to get actual state
        await fetchConnectionStatus();
        return toast.info("Request already sent");
      }

      toast.error(error?.message || "Failed to send request");
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle accepting/rejecting incoming requests
  const handleRespondToRequest = async (status: 'ACCEPTED' | 'REJECTED') => {
  if (!connectionId || !session?.accessToken) return;
  setLocalLoading(true);
  try {
    // OPTIMISTIC UPDATE: Immediately update UI
    updateConnectionOptimistically(status, 'received', connectionId);
    // Notify connection manager about response
    connectionManager.notify(session.user.id, {
      userId: profileId,
      status: status,
      direction: 'received',
      connectionId: connectionId
    });
    const response = await api.patch(
      `/connections/respond/${connectionId}`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      }
    );
    if (response.data.success) {
      // Notify the other user about the response
      connectionManager.notify(profileId, {
        userId: session.user.id,
        status: status,
        direction: 'sent',
        connectionId: connectionId
      });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      
      // Fetch latest status from server
      await fetchConnectionStatus();
    }
  } catch (error: any) {
    console.error('Error responding to request:', error);
    // ROLLBACK: Fetch actual status from server
    await fetchConnectionStatus();
    
    toast.error(error?.message || `Failed to ${status.toLowerCase()} request`);
  } finally {
    setLocalLoading(false);
  }
};

  const isLoading = localLoading || isConnectionLoading || isCheckingConnection;
  const isPending = connectionStatus === "PENDING";
  const isAccepted = connectionStatus === "ACCEPTED";
  const isRejected = connectionStatus === "REJECTED";
  const isIncomingRequest = isPending && connectionDirection === "received";

  // Safely access properties with type guards
  const isPremium = useMemo(() => {
    const user = userObj as any;
    return user.premium === true || user.isPremium === true;
  }, [userObj]);
  
  const subscriptionType = useMemo(() => {
    const user = userObj as any;
    return user.subscriptionType;
  }, [userObj]);

  const isVerified = useMemo(() => {
    const user = userObj as any;
    return user.verified === true || user.isVerified === true;
  }, [userObj]);
  const visitedCountriesCount = useMemo(() => {
    const user = userObj as any;
    return user.visitedCountries?.length || user.visitedCountriesCount || 0;
  }, [userObj]);
  const interestsCount = useMemo(() => {
    const user = userObj as any;
    return user.interests?.length || user.interestsCount || 0;
  }, [userObj]);
  const rating = useMemo(() => {
    const user = userObj as any;
    return user.rating || 0;
  }, [userObj]);
  
  const isExpert = useMemo(() => 
    userObj.role === 'ADMIN' || isVerified || rating >= 4.5,
    [userObj.role, isVerified, rating]
  );
  
  // --- PROFESSIONAL BADGE LOGIC ---
  const badgeConfig = useMemo(() => {
    // Admin has highest priority
    if (userObj.role === 'ADMIN') {
        return { 
            text: 'Admin', 
            gradient: 'from-red-500 via-rose-500 to-pink-500',
            borderColor: 'border-red-200',
            shadow: 'shadow-red-500/20',
            icon: <Shield className="h-3 w-3" />,
            premium: false
        };
    }
    
    // Premium subscription badges
    if (isPremium && subscriptionType) {
        switch(subscriptionType) {
            case 'EXPLORER':
                return { 
                    text: 'Explorer', 
                    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
                    borderColor: 'border-blue-200',
                    shadow: 'shadow-blue-500/20',
                    icon: <Zap className="h-3 w-3" />,
                    premium: true
                };
            case 'MONTHLY':
                return { 
                    text: 'Adventurer', 
                    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
                    borderColor: 'border-purple-200',
                    shadow: 'shadow-purple-500/20',
                    icon: <Crown className="h-3 w-3" />,
                    premium: true
                };
            case 'YEARLY':
                return { 
                    text: 'Globetrotter', 
                    gradient: 'from-amber-500 via-orange-500 to-red-500',
                    borderColor: 'border-orange-200',
                    shadow: 'shadow-orange-500/20',
                    icon: <Gem className="h-3 w-3" />,
                    premium: true
                };
        }
    }

    // Expert badge
    if (isExpert) {
        return { 
            text: 'Expert', 
            gradient: 'from-indigo-500 via-purple-500 to-violet-500',
            borderColor: 'border-indigo-200',
            shadow: 'shadow-indigo-500/20',
            icon: <Award className="h-3 w-3" />,
            premium: false
        };
    }
    
    // Default Traveler badge
    return { 
        text: 'Traveler', 
        gradient: 'from-stone-500 via-stone-400 to-stone-300',
        borderColor: 'border-stone-200',
        shadow: 'shadow-stone-500/10',
        icon: <Plane className="h-3 w-3" />,
        premium: false
    };
  }, [isExpert, isPremium, subscriptionType, userObj.role]);

  // Safely get the user's name
  const userName = useMemo(() => {
    const user = userObj as any;
    return user.name || user.fullName || 'Traveler';
  }, [userObj]);
  
  // Safely get the profile image
  const profileImage = useMemo(() => {
    const user = userObj as any;
    return user.profileImage || user.avatar || user.image || '';
  }, [userObj]);
  
  // Safely get bio
  const bio = useMemo(() => {
    const user = userObj as any;
    return user.bio || user.description || `Passionate traveler exploring the world.`;
  }, [userObj]);
  
  // Safely get location
  const location = useMemo(() => {
    const user = userObj as any;
    return user.location || user.country || user.visitedCountries?.[0] || 'Global Explorer';
  }, [userObj]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <Card className={`
        group relative h-full overflow-hidden 
        border ${badgeConfig.borderColor} border-opacity-50
        bg-white/95 backdrop-blur-sm
        shadow-lg ${isHovered ? badgeConfig.shadow : 'shadow-stone-200/50'}
        transition-all duration-500 ease-out
        rounded-2xl
        hover:border-opacity-100
        ${isHovered ? 'scale-[1.02]' : ''}
      `}>
        
        {/* Premium Gradient Border Effect */}
        {badgeConfig.premium && (
          <div className={`
            absolute inset-0 rounded-2xl 
            bg-linear-to-r ${badgeConfig.gradient}
            opacity-0 transition-opacity duration-500
            ${isHovered ? 'opacity-10' : ''}
            -z-10
          `} />
        )}

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-5" />

        {/* Top Right Badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge className={`
            relative overflow-hidden
            bg-linear-to-r ${badgeConfig.gradient}
            text-white border-0 
            shadow-lg flex items-center gap-1.5 
            px-3 py-1.5 text-xs font-semibold
            transition-all duration-300
            ${isHovered ? 'scale-105 shadow-xl' : ''}
            group-hover:shadow-xl
          `}>
            {/* Sparkle effect for premium badges */}
            {badgeConfig.premium && (
              <Sparkles className="absolute -top-1 -left-1 h-2 w-2 text-white/80" />
            )}
            {badgeConfig.icon}
            {badgeConfig.text}
          </Badge>
        </div>

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="secondary" className={`
              bg-white/95 backdrop-blur-sm 
              text-stone-700 border border-stone-200 
              shadow-sm flex items-center gap-1 
              px-2.5 py-1 text-xs
              transition-all duration-300
              ${isHovered ? 'scale-105' : ''}
            `}>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </Badge>
          </div>
        )}

        <CardContent className="pt-8 pb-4 px-6 relative">
          {/* Avatar Section */}
          <div className="relative -mt-6 mb-6 flex justify-center">
            {/* Avatar Background Glow */}
            <div className={`
              absolute -inset-4 rounded-full 
              bg-linear-to-r ${badgeConfig.gradient}
              opacity-0 blur-xl
              transition-all duration-700
              ${isHovered ? 'opacity-20 scale-110' : ''}
            `} />
            
            {/* Avatar Container */}
            <div className="relative">
              <Avatar className={`
                relative h-24 w-24 
                border-4 border-white 
                shadow-2xl
                transition-all duration-500
                ${isHovered ? 'scale-110' : ''}
              `}>
                
                <AvatarImage 
                  src={profileImage} 
                  alt={userName}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <AvatarFallback className="bg-linear-to-br from-stone-200 to-stone-300 text-stone-600 text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Online Status Indicator */}
              {traveler.online && (
                <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
              )}
            </div>
          </div>

          {/* User Info Section */}
          <div className="space-y-4 text-center">
            {/* Name and Location */}
            <div>
              <h3 className="text-2xl font-bold text-stone-900 line-clamp-1
                transition-colors duration-300
                group-hover:text-stone-950">
                {userName}
              </h3>
              <div className="flex items-center justify-center text-sm text-stone-500 mt-2 gap-1.5
                transition-colors duration-300
                group-hover:text-stone-600">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">
                  {location}
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-stone-600 line-clamp-2 min-h-10 leading-relaxed
              transition-colors duration-300
              group-hover:text-stone-700">
              {bio}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-100">
              {[
                { 
                  value: visitedCountriesCount, 
                  label: 'Countries',
                  icon: Globe,
                  color: 'text-blue-500'
                },
                { 
                  value: interestsCount, 
                  label: 'Interests',
                  icon: Languages,
                  color: 'text-purple-500'
                },
                { 
                  value: userObj.role === 'ADMIN' ? 'Staff' : 'Active', 
                  label: 'Status',
                  icon: CalendarDays,
                  color: 'text-emerald-500'
                }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group/stat">
                  <div className="font-bold text-stone-900 text-lg
                    transition-all duration-300
                    group-hover/stat:scale-110">
                    {stat.value}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center justify-center gap-1
                    transition-all duration-300
                    group-hover/stat:text-stone-700">
                    <stat.icon className={`h-3 w-3 ${stat.color}`} />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Connection Status Badge */}
            {isCheckingConnection ? (
              <div className="pt-3">
                <Badge
                  variant="outline"
                  className="w-full justify-center py-2 border border-stone-200 bg-stone-50 text-stone-500
                    transition-all duration-300
                    group-hover:border-stone-300 group-hover:bg-stone-100"
                >
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Checking...
                </Badge>
              </div>
            ) : connectionStatus && connectionStatus !== "REJECTED" ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="pt-3"
              >
                <Badge
                  variant="outline"
                  className={`
                    w-full justify-center py-2 border font-medium
                    transition-all duration-300
                    ${isPending ? 'bg-amber-50 text-amber-700 border-amber-200 group-hover:border-amber-300 group-hover:bg-amber-100' : ''}
                    ${isAccepted ? 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:border-emerald-300 group-hover:bg-emerald-100' : ''}
                  `}
                >
                  {isIncomingRequest && <Clock className="h-3.5 w-3.5 mr-1.5" />}
                  {!isIncomingRequest && isPending && <Clock className="h-3.5 w-3.5 mr-1.5" />}
                  {isAccepted && <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
                  
                  {isIncomingRequest && 'Request Received'}
                  {!isIncomingRequest && isPending && 'Request Sent'}
                  {isAccepted && 'Connected'}
                </Badge>
              </motion.div>
            ) : null}
          </div>
        </CardContent>

        {/* Footer with Buttons */}
        <CardFooter className="relative z-10 p-6 pt-4 border-t border-stone-100 
          bg-linear-to-t from-white/50 to-transparent">
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Connect/Accept/Reject Button */}
            {isIncomingRequest ? (
              <>
                {/* Accept Button */}
                <Button
                  size="sm"
                  variant={"gradient"}
                  className="w-full text-sm font-medium 
                    bg-linear-to-r from-emerald-500 to-emerald-600 
                    hover:from-emerald-600 hover:to-emerald-700 
                    text-white shadow-md
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-emerald-500/30
                    hover:-translate-y-0.5"
                  onClick={() => handleRespondToRequest('ACCEPTED')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Accept
                    </>
                  )}
                </Button>

                {/* Reject Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-sm font-medium 
                    border-red-300 text-red-700 
                    hover:bg-red-50 hover:text-red-800 hover:border-red-400
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-red-500/20
                    hover:-translate-y-0.5"
                  onClick={() => handleRespondToRequest('REJECTED')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Decline
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* Connect Button */}
                <Button
                  size="sm"
                  variant={"gradient"}
                  className={`
                    w-full text-sm font-medium 
                    shadow-md
                    transition-all duration-300
                    hover:shadow-lg hover:-translate-y-0.5
                    ${isAccepted 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-emerald-500/30' 
                      : isPending && !isIncomingRequest
                        ? 'bg-linear-to-r from-stone-200 to-stone-300 text-stone-700 hover:from-stone-300 hover:to-stone-400 hover:shadow-stone-500/20'
                        : isRejected
                          ? 'bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white hover:shadow-rose-500/30'
                          : 'bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white hover:shadow-purple-500/30'
                    }
                  `}
                  onClick={handleConnectClick}
                  disabled={isLoading || (isPending && !isIncomingRequest) || isAccepted || isSelf || !profileId}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isAccepted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Connected
                    </>
                  ) : isPending && !isIncomingRequest ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </>
                  ) : isRejected ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>

                {/* View Profile Button */}
                <Link href={`/PublicVisitProfile/${profileId}`} className="w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-sm font-medium 
                      border-stone-300 text-stone-700 
                      hover:bg-stone-100 hover:text-stone-900 hover:border-stone-400
                      transition-all duration-300
                      hover:shadow-lg hover:shadow-stone-500/20
                      hover:-translate-y-0.5"
                    disabled={!profileId}
                  >
                    Profile
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardFooter>

        {/* Premium Indicator Ribbon */}
        {badgeConfig.premium && (
          <div className={`
            absolute -top-3 -right-3 w-24 h-24 overflow-hidden
            transition-transform duration-300
            ${isHovered ? 'scale-110' : ''}
          `}>
            <div className={`
              absolute top-0 right-0 w-32 h-8
              bg-linear-to-r ${badgeConfig.gradient}
              transform rotate-45 translate-y-4 translate-x-8
              flex items-center justify-center
              shadow-lg
            `}>
              <span className="text-[10px] font-bold text-white tracking-wider">
                PREMIUM
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Payment Modal */}
      {isPricingOpen && (
        <PaymentModal onClose={() => setIsPricingOpen(false)} />
      )}
    </motion.div>
  )
}