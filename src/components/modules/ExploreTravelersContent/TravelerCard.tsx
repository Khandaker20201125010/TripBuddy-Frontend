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
  RefreshCw
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
        console.log('Received connection update for user:', profileId, event);
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

  const badgeColor = useMemo(() => {
    if (isExpert) return 'bg-linear-to-r from-purple-600 to-indigo-600';
    if (isPremium) return 'bg-linear-to-r from-amber-500 to-orange-500';
    return 'bg-linear-to-r from-blue-500 to-cyan-500';
  }, [isExpert, isPremium]);

  const badgeText = useMemo(() => {
    if (isExpert) return 'Expert';
    if (isPremium) return 'Premium';
    return 'Traveler';
  }, [isExpert, isPremium]);

  const badgeIcon = useMemo(() => {
    if (isExpert) return <Award className="h-3 w-3" />;
    if (isPremium) return <Shield className="h-3 w-3" />;
    return <Plane className="h-3 w-3" />;
  }, [isExpert, isPremium]);

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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group relative h-full overflow-hidden border border-stone-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-300 rounded-2xl hover:bg-white hover:border-stone-300">
        <div className={`absolute inset-0 bg-linear-to-br from-transparent via-white to-transparent transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-30' : 'opacity-0'}`} />
        
        {/* Badge in corner */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${badgeColor} text-white border-0 shadow-lg flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold`}>
            {badgeIcon}
            {badgeText}
          </Badge>
        </div>

        {/* Rating badge */}
        {rating > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-700 border border-stone-200 shadow-sm flex items-center gap-1 px-2.5 py-1 text-xs">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </Badge>
          </div>
        )}

        <CardContent className="pt-8 pb-4 px-6 relative">
          {/* Avatar with decorative background */}
          <div className="relative -mt-6 mb-6 flex justify-center">
            <div className="absolute -inset-4 bg-linear-to-r from-purple-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Avatar className="relative h-20 w-20 border-4 border-white shadow-xl ring-2 ring-white/50">
              <AvatarImage 
                src={profileImage} 
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="bg-linear-to-br from-stone-200 to-stone-300 text-stone-600 text-xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="space-y-4 text-center">
            <div>
              <h3 className="text-xl font-bold text-stone-900 line-clamp-1">
                {userName}
              </h3>
              <div className="flex items-center justify-center text-sm text-stone-500 mt-1 gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">
                  {location}
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-stone-600 line-clamp-2 min-h-[40px] leading-relaxed">
              {bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
              <div className="text-center">
                <div className="font-bold text-stone-900">{visitedCountriesCount}</div>
                <div className="text-xs text-stone-500 flex items-center justify-center gap-1">
                  <Globe className="h-3 w-3" />
                  Countries
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-stone-900">{interestsCount}</div>
                <div className="text-xs text-stone-500 flex items-center justify-center gap-1">
                  <Languages className="h-3 w-3" />
                  Interests
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-stone-900">{userObj.role === 'ADMIN' ? 'Expert' : 'Traveler'}</div>
                <div className="text-xs text-stone-500 flex items-center justify-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Status
                </div>
              </div>
            </div>

            {/* Connection Status Badge - REMOVED the REJECTED badge */}
            {isCheckingConnection ? (
              <div className="pt-2">
                <Badge
                  variant="outline"
                  className="w-full justify-center py-2 border border-stone-200 bg-stone-50 text-stone-500"
                >
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Checking...
                </Badge>
              </div>
            ) : connectionStatus && connectionStatus !== "REJECTED" ? ( // CHANGED: Hide REJECTED status badge
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="pt-2"
              >
                <Badge
                  variant="outline"
                  className={`
                    w-full justify-center py-2 border font-medium
                    ${isPending ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                    ${isAccepted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
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

        <CardFooter className="relative z-10 p-5 pt-0 border-t border-stone-100 bg-linear-to-t from-stone-50/50 to-transparent">
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Connect/Accept/Reject Button */}
            {isIncomingRequest ? (
              <>
                {/* Accept Button */}
                <Button
                  size="sm"
                  variant={"gradient"}
                  className="w-full text-sm font-medium transition-all duration-300 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
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
                  className="w-full text-sm font-medium border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400 transition-all duration-300"
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
                {/* Connect Button - Show for all states including REJECTED */}
                <Button
                  size="sm"
                  variant={"gradient"}
                  className={`
                    w-full text-sm font-medium transition-all duration-300
                    ${isAccepted 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white' 
                      : isPending && !isIncomingRequest
                        ? 'bg-linear-to-r from-stone-200 to-stone-300 text-stone-700 hover:from-stone-300 hover:to-stone-400'
                        : isRejected
                          ? 'bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white'
                          : 'bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                    }
                  `}
                  onClick={handleConnectClick}
                  disabled={isLoading || (isPending && !isIncomingRequest) || isAccepted || isSelf || !profileId}
                  // Note: isRejected is NOT in disabled condition - user can reconnect
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
                    className="cursor-pointer w-full text-sm font-medium border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 hover:border-stone-400 transition-all duration-300"
                    disabled={!profileId}
                  >
                    Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Payment Modal */}
      {isPricingOpen && (
        <PaymentModal onClose={() => setIsPricingOpen(false)} />
      )}
    </motion.div>
  )
}