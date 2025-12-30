/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    MapPin, Calendar, Star, Globe,
    Briefcase, CheckCircle, Shield, AlertCircle,
    Sparkles, UserPlus, Clock, Loader2,
    Ban, RefreshCw, Crown, Gem, Zap, Award, ShieldCheck, BadgeCheck,
    ChevronLeft, ChevronRight, ChevronFirst, ChevronLast
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from 'next-auth/react'
import { useConnection } from '@/hooks/connections/useConnection'
import { toast } from 'sonner'
import { Traveler } from '@/types/travel'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { PaymentModal } from '../payment/PaymentModal'
import { connectionManager } from '@/hooks/connections/connectionManager'
import api from '@/lib/axios'

interface PublicViewProfileProps {
    traveler?: Traveler
}

interface TravelPlan {
    id: string;
    destination: string;
    image?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    travelType?: string;
    budget?: number;
}

// Subscription badge configuration
const SUBSCRIPTION_BADGES = {
    EXPLORER: {
        icon: Zap,
        label: 'Explorer',
        verifiedLabel: 'Verified Explorer',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-500',
        gradient: 'from-blue-400 to-blue-500',
        badgeIcon: Shield,
        level: 1
    },
    MONTHLY: {
        icon: Crown,
        label: 'Adventurer',
        verifiedLabel: 'Verified Adventurer',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-500',
        gradient: 'from-purple-500 to-purple-600',
        badgeIcon: BadgeCheck,
        level: 2
    },
    YEARLY: {
        icon: Gem,
        label: 'Globetrotter',
        verifiedLabel: 'Verified Globetrotter',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-orange-500',
        gradient: 'from-orange-500 to-amber-600',
        badgeIcon: Award,
        level: 3
    }
} as const;

const PublicViewProfileComponent = ({ traveler }: PublicViewProfileProps) => {
    const router = useRouter()
    const params = useParams()
    const userId = (params?.id || params?.userId) as string

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [errorDetails, setErrorDetails] = useState<string>("")
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const { sendRequest, isLoading: isConnectionLoading } = useConnection()
    const { data: session } = useSession()
    
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
    const [connectionDirection, setConnectionDirection] = useState<string | null>(null);
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const [localLoading, setLocalLoading] = useState(false);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    // Pagination state for hosted trips
    const [hostedTrips, setHostedTrips] = useState<TravelPlan[]>([]);
    const [currentTripPage, setCurrentTripPage] = useState(1);
    const [tripsPerPage] = useState(4); // Show 4 cards per page
    const [isLoadingTrips, setIsLoadingTrips] = useState(false);

    // Logic to determine profile IDs and connection status
    const profileId = user?.id || traveler?.userId || traveler?.id
    const isSelf = session?.user?.id === profileId

    // Calculate pagination values
    const totalTrips = user?.travelPlans?.length || 0;
    const totalTripPages = Math.ceil(totalTrips / tripsPerPage);
    const startIndex = (currentTripPage - 1) * tripsPerPage;
    const endIndex = startIndex + tripsPerPage;
    const currentTrips = user?.travelPlans?.slice(startIndex, endIndex) || [];

    // Helper function to render subscription badge
    const renderSubscriptionBadge = (userData: any) => {
        if (!userData?.premium) return null;
        
        const subscriptionType = userData?.subscriptionType;
        const config = subscriptionType 
            ? SUBSCRIPTION_BADGES[subscriptionType as keyof typeof SUBSCRIPTION_BADGES] 
            : SUBSCRIPTION_BADGES.MONTHLY;
        
        const Icon = config.icon;
        const BadgeIcon = config.badgeIcon;
        
        return (
            <Badge 
                className={`
                    ${config.bgColor} 
                    ${config.color} 
                    ${config.borderColor}
                    border-2 
                    font-bold 
                    px-3 py-1.5
                    flex items-center gap-2
                    shadow-sm
                    rounded-full
                `}
            >
                <div className="relative">
                    <Icon className={`h-4 w-4 ${config.iconColor}`} />
                    <BadgeIcon className="absolute -top-1 -right-1 h-3 w-3 text-white fill-current" />
                </div>
                <span className="text-sm">{config.verifiedLabel}</span>
            </Badge>
        );
    };

    // Helper function to render premium stats indicator
    const renderPremiumStats = (userData: any) => {
        if (!userData?.premium) return null;
        
        const subscriptionType = userData?.subscriptionType;
        const config = subscriptionType 
            ? SUBSCRIPTION_BADGES[subscriptionType as keyof typeof SUBSCRIPTION_BADGES] 
            : SUBSCRIPTION_BADGES.MONTHLY;
        
        return (
            <div className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-bold">Premium Benefits</span>
                </div>
                <ul className="text-xs space-y-1">
                    {subscriptionType === 'EXPLORER' && (
                        <>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Verified Explorer Badge</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Priority in Search Results</span>
                            </li>
                        </>
                    )}
                    {subscriptionType === 'MONTHLY' && (
                        <>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Verified Adventurer Badge</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Unlimited Connection Requests</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Priority Support</span>
                            </li>
                        </>
                    )}
                    {subscriptionType === 'YEARLY' && (
                        <>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Verified Globetrotter Badge</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Exclusive Badge & Features</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>24/7 Premium Support</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Partner Discounts</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        );
    };

    // Fetch connection status from server
    const fetchConnectionStatus = useCallback(async () => {
        if (!session?.user?.id || !profileId || isSelf) {
            setConnectionStatus(null);
            setConnectionDirection(null);
            setConnectionId(null);
            return;
        }
        
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
                    setConnectionStatus(connectionWithUser.status);
                    setConnectionDirection(direction);
                    setConnectionId(connectionWithUser.id);
                    
                    console.log('Found connection:', {
                        status: connectionWithUser.status,
                        direction: direction,
                        id: connectionWithUser.id
                    });
                    
                    // Update localStorage
                    localStorage.setItem(`connection_${profileId}`, JSON.stringify({
                        status: connectionWithUser.status,
                        direction: direction,
                        connectionId: connectionWithUser.id,
                        timestamp: Date.now()
                    }));
                } else {
                    setConnectionStatus(null);
                    setConnectionDirection(null);
                    setConnectionId(null);
                    localStorage.removeItem(`connection_${profileId}`);
                    console.log('No connection found');
                }
            }
        } catch (error) {
            console.error('Error fetching connection status:', error);
            // Fallback to localStorage if available
            const storedConnection = localStorage.getItem(`connection_${profileId}`);
            if (storedConnection) {
                try {
                    const connectionData = JSON.parse(storedConnection);
                    if (Date.now() - connectionData.timestamp < 3600000) { // 1 hour
                        setConnectionStatus(connectionData.status);
                        setConnectionDirection(connectionData.direction);
                        setConnectionId(connectionData.connectionId || null);
                        console.log('Using localStorage connection:', connectionData);
                        return;
                    } else {
                        localStorage.removeItem(`connection_${profileId}`);
                    }
                } catch (parseError) {
                    console.error('Error parsing localStorage connection data:', parseError);
                }
            }
            setConnectionStatus(null);
            setConnectionDirection(null);
            setConnectionId(null);
        } finally {
            setIsCheckingConnection(false);
        }
    }, [session?.user?.id, profileId, isSelf]);

    // Pagination functions
    const nextPage = () => {
        if (currentTripPage < totalTripPages) {
            setCurrentTripPage(currentTripPage + 1);
        }
    };

    const prevPage = () => {
        if (currentTripPage > 1) {
            setCurrentTripPage(currentTripPage - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalTripPages) {
            setCurrentTripPage(page);
        }
    };

    const goToFirstPage = () => {
        setCurrentTripPage(1);
    };

    const goToLastPage = () => {
        setCurrentTripPage(totalTripPages);
    };

    // Render pagination controls
    const renderPagination = () => {
        if (totalTrips <= tripsPerPage) return null;

        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentTripPage - Math.floor(maxVisiblePages / 2));
        const  endPage = Math.min(totalTripPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-stone-200">
                {/* Page info */}
                <div className="text-sm text-stone-500">
                    Showing <span className="font-semibold text-stone-700">{startIndex + 1}-{Math.min(endIndex, totalTrips)}</span> of{" "}
                    <span className="font-semibold text-stone-700">{totalTrips}</span> hosted trips
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-1">
                    {/* First Page Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={goToFirstPage}
                        disabled={currentTripPage === 1}
                    >
                        <ChevronFirst className="h-4 w-4" />
                    </Button>

                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={prevPage}
                        disabled={currentTripPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((pageNum) => (
                            <Button
                                key={pageNum}
                                variant={currentTripPage === pageNum ? "default" : "outline"}
                                size="sm"
                                className={`h-8 w-8 ${currentTripPage === pageNum ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0' : ''}`}
                                onClick={() => goToPage(pageNum)}
                            >
                                {pageNum}
                            </Button>
                        ))}
                        
                        {/* Ellipsis for more pages */}
                        {endPage < totalTripPages && (
                            <>
                                <span className="px-2 text-stone-400">...</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8"
                                    onClick={() => goToPage(totalTripPages)}
                                >
                                    {totalTripPages}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={nextPage}
                        disabled={currentTripPage === totalTripPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last Page Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={goToLastPage}
                        disabled={currentTripPage === totalTripPages}
                    >
                        <ChevronLast className="h-4 w-4" />
                    </Button>
                </div>

                {/* Page counter */}
                <div className="text-sm text-stone-500">
                    Page <span className="font-semibold text-stone-700">{currentTripPage}</span> of{" "}
                    <span className="font-semibold text-stone-700">{totalTripPages}</span>
                </div>
            </div>
        );
    };

    // Subscribe to connection updates
    useEffect(() => {
        if (!session?.user?.id || !profileId || isSelf) return;

        const unsubscribe = connectionManager.subscribe(session.user.id, (event) => {
            // Check if this update is for the user we're viewing
            if (event.userId === profileId) {
                console.log('PublicProfile: Received connection update', event);
                setConnectionStatus(event.status);
                setConnectionDirection(event.direction);
                setConnectionId(event.connectionId);
                
                // Update localStorage for persistence
                if (event.status) {
                    localStorage.setItem(`connection_${profileId}`, JSON.stringify({
                        status: event.status,
                        direction: event.direction,
                        connectionId: event.connectionId,
                        timestamp: Date.now()
                    }));
                } else {
                    localStorage.removeItem(`connection_${profileId}`);
                }
                
                // Refresh user data if connection status changed
                if (event.status === 'ACCEPTED' || event.status === 'REJECTED') {
                    fetchUserData();
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [session?.user?.id, profileId, isSelf]);

    // Fetch user data
    const fetchUserData = async () => {
        if (!userId) {
            setLoading(false)
            return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        try {
            setLoading(true)
            const res = await fetch(`${apiUrl}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` })
                },
                cache: 'no-store'
            })

            if (!res.ok) {
                setErrorDetails(`Error ${res.status}: ${res.statusText}`)
                return
            }

            const json = await res.json()
            if (json.success && json.data) {
                const data = json.data
                const newUser = {
                    ...data,
                    interests: data.interests || [],
                    visitedCountries: data.visitedCountries || [],
                    stats: {
                        hosted: data.travelPlans?.length || 0,
                        joined: data.joinedTrips?.length || 0,
                        reviews: data.reviewsReceived?.length || 0
                    },
                    travelPlans: data.travelPlans || [],
                    reviews: data.reviewsReceived || [],
                    sentConnections: data.sentConnections || [],
                    receivedConnections: data.receivedConnections || []
                }
                setUser(newUser)
                
                // Check for connection info in user data first
                if (data.connectionInfo) {
                    console.log('Found connectionInfo in user data:', data.connectionInfo);
                    setConnectionStatus(data.connectionInfo.status);
                    setConnectionDirection(data.connectionInfo.direction);
                    setConnectionId(data.connectionInfo.id || null);
                } else {
                    // After fetching user, fetch connection status from API
                    if (session?.user?.id && !isSelf) {
                        await fetchConnectionStatus();
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setErrorDetails("Network connection failed")
        } finally {
            setLoading(false)
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchUserData();
    }, [userId, session?.accessToken, session?.user?.id])

    // Also check connection status when session changes
    useEffect(() => {
        if (session?.user?.id && profileId && !isSelf && !loading) {
            fetchConnectionStatus();
        }
    }, [session?.user?.id, profileId, isSelf, loading]);

    const handleConnectClick = async () => {
        console.log('Connect clicked, current status:', connectionStatus);
        
        // 1. Unauthenticated Check
        if (!session?.accessToken || !session?.user) {
            return Swal.fire({
                title: 'Login Required',
                text: 'You must be logged in to connect with other travelers.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Log In',
                confirmButtonColor: '#f97316',
            }).then((result) => {
                if (result.isConfirmed) router.push('/login');
            });
        }

        if (isSelf) return toast.error("You cannot connect with yourself");

        // Check if connection already exists
        if (connectionStatus && connectionStatus !== 'REJECTED') {
            console.log('Connection already exists:', connectionStatus);
            return toast.info(`Connection already ${connectionStatus.toLowerCase()}`);
        }

        setLocalLoading(true);

        try {
            console.log('Sending connection request to:', profileId);
            
            // OPTIMISTIC UPDATE
            setConnectionStatus('PENDING');
            setConnectionDirection('sent');
            
            // Notify connection manager immediately
            connectionManager.notify(session.user.id, {
                userId: profileId,
                status: 'PENDING',
                direction: 'sent',
                connectionId: null
            });
            
            // Send the actual request
            const result = await sendRequest(profileId, session.accessToken);

            if (result) {
                console.log('Request sent successfully:', result);
                
                // Update with actual data from server
                setConnectionStatus('PENDING');
                setConnectionDirection('sent');
                setConnectionId(result.id || null);
                
                // Notify connection manager with actual connection ID
                connectionManager.notify(session.user.id, {
                    userId: profileId,
                    status: 'PENDING',
                    direction: 'sent',
                    connectionId: result.id || null
                });
                
                // Store in localStorage
                localStorage.setItem(`connection_${profileId}`, JSON.stringify({
                    status: 'PENDING',
                    direction: 'sent',
                    connectionId: result.id || null,
                    timestamp: Date.now()
                }));
                
                toast.success("Connection request sent!");
                
                // Fetch latest status from server to confirm
                await fetchConnectionStatus();
            }
        } catch (error: any) {
            console.error('Error sending connection request:', error);
            
            // ROLLBACK on error
            setConnectionStatus(null);
            setConnectionDirection(null);
            setConnectionId(null);
            
            // Notify connection manager about failure
            connectionManager.notify(session.user.id, {
                userId: profileId,
                status: null,
                direction: null,
                connectionId: null
            });
            
            // Remove from localStorage
            localStorage.removeItem(`connection_${profileId}`);
            
            // Fetch actual status from server after error
            await fetchConnectionStatus();
            
            // Handle Limits
            if (error.statusCode === 403 || error.message?.toLowerCase().includes("limit reached")) {
                return Swal.fire({
                    title: 'Limit Reached!',
                    text: error.message || 'You have reached your free connection limit.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Upgrade Plan',
                    confirmButtonColor: '#f97316',
                    cancelButtonColor: '#78716c',
                    customClass: { popup: 'rounded-2xl' }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setIsPricingOpen(true);
                    }
                });
            }
            
            // Handle Conflicts (Already Exists)
            if (error.statusCode === 409 || error.message?.includes("already exists")) {
                // Refresh connection status to get actual state
                await fetchConnectionStatus();
                return toast.info("Request already sent.");
            }

            toast.error(error.message || "Failed to send request.");
        } finally {
            setLocalLoading(false);
        }
    };

    // Handle accepting/rejecting incoming requests
    const handleRespondToRequest = async (status: 'ACCEPTED' | 'REJECTED') => {
        if (!connectionId || !session?.accessToken) return;
        
        console.log('Responding to request:', { status, connectionId });
        
        setLocalLoading(true);
        try {
            // OPTIMISTIC UPDATE: Immediately update UI
            setConnectionStatus(status);
            setConnectionDirection('received');
            
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
                console.log('Response successful:', response.data);
                
                // Notify the other user about the response
                connectionManager.notify(profileId, {
                    userId: session.user.id,
                    status: status,
                    direction: 'sent',
                    connectionId: connectionId
                });
                
                toast.success(`Request ${status.toLowerCase()} successfully`);
                
                // Update localStorage
                if (status === "ACCEPTED") {
                    localStorage.removeItem(`connection_${profileId}`);
                } else {
                    localStorage.setItem(`connection_${profileId}`, JSON.stringify({
                        status: status,
                        direction: 'received',
                        connectionId: connectionId,
                        timestamp: Date.now()
                    }));
                }
                
                // Refresh user data
                await fetchUserData();
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

    // Clear localStorage when connection is accepted
    useEffect(() => {
        if (connectionStatus === "ACCEPTED" && profileId) {
            localStorage.removeItem(`connection_${profileId}`);
        }
    }, [connectionStatus, profileId]);

    if (loading) return <ProfileSkeleton />

    if (!user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="text-stone-500 mb-6">{errorDetails || "This traveler profile could not be loaded."}</p>
            <Link href="/travelers">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600">
                    Explore Other Travelers
                </Button>
            </Link>
        </div>
    )

    const isLoading = localLoading || isConnectionLoading || isCheckingConnection;
    const isPending = connectionStatus === "PENDING";
    const isAccepted = connectionStatus === "ACCEPTED";
    const isRejected = connectionStatus === "REJECTED";
    const isIncomingRequest = isPending && connectionDirection === "received";

    console.log('Connection state:', {
        status: connectionStatus,
        direction: connectionDirection,
        isPending,
        isAccepted,
        isRejected,
        isIncomingRequest,
        profileId,
        isSelf
    });

    // Render connection button based on status
    const renderConnectionButton = () => {
        if (isCheckingConnection) {
            return (
                <Button
                    variant="secondary"
                    size="lg"
                    disabled
                >
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                </Button>
            );
        }

        if (isIncomingRequest) {
            return (
                <div className="flex gap-3">
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        onClick={() => handleRespondToRequest('ACCEPTED')}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Accepting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Request
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400"
                        onClick={() => handleRespondToRequest('REJECTED')}
                        disabled={isLoading}
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        Decline
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                <Button
                    variant={isPending || isAccepted || isRejected ? "secondary" : "default"}
                    size="lg"
                    className={`
                        ${isAccepted 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 border-green-200' 
                            : isPending
                                ? 'bg-gradient-to-r from-stone-200 to-stone-300 text-stone-600 hover:from-stone-300 hover:to-stone-400 border-stone-300'
                                : isRejected
                                    ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 hover:from-rose-200 hover:to-pink-200 border-rose-200'
                                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-orange-500'
                        }
                    `}
                    onClick={handleConnectClick}
                    disabled={isLoading || (isPending && !isIncomingRequest) || isAccepted || isSelf}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : isAccepted ? (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Connected
                        </>
                    ) : isPending ? (
                        <>
                            <Clock className="h-4 w-4 mr-2" />
                            Request Sent
                        </>
                    ) : isRejected ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Connect Again
                        </>
                    ) : (
                        <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Request Buddy
                        </>
                    )}
                </Button>
                
                {/* Premium badge indicator on button */}
                {user.premium && user.subscriptionType && (
                    <div className="flex items-center justify-center gap-1 text-xs">
                        {user.subscriptionType === 'EXPLORER' && (
                            <>
                                <Zap className="h-3 w-3 text-blue-500" />
                                <span className="text-blue-600 font-medium">Verified Explorer</span>
                            </>
                        )}
                        {user.subscriptionType === 'MONTHLY' && (
                            <>
                                <Crown className="h-3 w-3 text-purple-500" />
                                <span className="text-purple-600 font-medium">Verified Adventurer</span>
                            </>
                        )}
                        {user.subscriptionType === 'YEARLY' && (
                            <>
                                <Gem className="h-3 w-3 text-orange-500" />
                                <span className="text-orange-600 font-medium">Verified Globetrotter</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-20">
            {/* COVER IMAGE */}
            <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-stone-800 to-stone-900">
                <Image
                    src={user.profileImage || '/default-cover.jpg'}
                    alt="Cover"
                    fill
                    className="object-cover opacity-40"
                />
                {/* Premium gradient overlay */}
                {user.premium && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${
                        user.subscriptionType === 'EXPLORER' ? 'from-blue-500/20 to-blue-600/20' :
                        user.subscriptionType === 'MONTHLY' ? 'from-purple-500/20 to-purple-600/20' :
                        'from-orange-500/20 to-amber-600/20'
                    }`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="relative -mt-24 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
                    {/* AVATAR with premium border */}
                    <div className="relative">
                        <Avatar className={`
                            h-36 w-36 md:h-44 md:w-44 
                            border-8 border-white 
                            shadow-2xl bg-white
                            ${user.premium ? `
                                ${user.subscriptionType === 'EXPLORER' ? 'ring-4 ring-blue-300 shadow-blue-200' : ''}
                                ${user.subscriptionType === 'MONTHLY' ? 'ring-4 ring-purple-300 shadow-purple-200' : ''}
                                ${user.subscriptionType === 'YEARLY' ? 'ring-4 ring-orange-300 shadow-orange-200' : ''}
                            ` : ''}
                        `}>
                            <AvatarImage src={user.profileImage} className="object-cover" />
                            <AvatarFallback className="text-3xl bg-gradient-to-br from-stone-300 to-stone-400 text-white">
                                {user.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Premium verification badge on avatar */}
                        {user.premium && user.subscriptionType && (
                            <div className={`
                                absolute -bottom-2 -right-2 
                                h-10 w-10 rounded-full 
                                flex items-center justify-center
                                border-4 border-white
                                shadow-lg
                                ${user.subscriptionType === 'EXPLORER' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
                                ${user.subscriptionType === 'MONTHLY' ? 'bg-gradient-to-r from-purple-500 to-violet-500' : ''}
                                ${user.subscriptionType === 'YEARLY' ? 'bg-gradient-to-r from-orange-500 to-amber-500' : ''}
                            `}>
                                {user.subscriptionType === 'EXPLORER' && <ShieldCheck className="h-5 w-5 text-white" />}
                                {user.subscriptionType === 'MONTHLY' && <BadgeCheck className="h-5 w-5 text-white" />}
                                {user.subscriptionType === 'YEARLY' && <Award className="h-5 w-5 text-white" />}
                            </div>
                        )}
                    </div>

                    {/* BASIC INFO */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-stone-900">{user.name}</h1>
                            
                            {/* High Rating Badge */}
                            {user.rating > 4.5 && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md">
                                    <Star className="h-3.5 w-3.5 mr-1 fill-white" />
                                    Top Rated
                                </Badge>
                            )}
                            
                            {/* Premium Subscription Verified Badge */}
                            {renderSubscriptionBadge(user)}
                        </div>
                        
                        <p className="text-stone-600 text-lg">{user.email}</p>
                        
                        {/* Premium subscription details */}
                        {user.premium && user.subscriptionType && (
                            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm">
                                <div className={`
                                    flex items-center gap-1 px-2 py-0.5 rounded-full
                                    ${user.subscriptionType === 'EXPLORER' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                                    ${user.subscriptionType === 'MONTHLY' ? 'bg-purple-50 text-purple-700 border border-purple-200' : ''}
                                    ${user.subscriptionType === 'YEARLY' ? 'bg-orange-50 text-orange-700 border border-orange-200' : ''}
                                `}>
                                    {user.subscriptionType === 'EXPLORER' && <Zap className="h-3 w-3" />}
                                    {user.subscriptionType === 'MONTHLY' && <Crown className="h-3 w-3" />}
                                    {user.subscriptionType === 'YEARLY' && <Gem className="h-3 w-3" />}
                                    <span className="font-medium">
                                        {user.subscriptionType === 'EXPLORER' && 'Explorer Plan'}
                                        {user.subscriptionType === 'MONTHLY' && 'Adventurer Plan'}
                                        {user.subscriptionType === 'YEARLY' && 'Globetrotter Plan'}
                                    </span>
                                </div>
                                {user.subscriptionExpiresAt && (
                                    <>
                                        <span className="text-stone-400">•</span>
                                        <span className="text-stone-500">
                                            Renews {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {/* Show connection status badge */}
                        {isCheckingConnection ? (
                            <div className="mt-2">
                                <Badge 
                                    variant="outline" 
                                    className="bg-stone-50 text-stone-500 border-stone-200"
                                >
                                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                    Checking connection...
                                </Badge>
                            </div>
                        ) : connectionStatus && connectionStatus !== "REJECTED" ? (
                            <div className="mt-2">
                                <Badge 
                                    variant="outline" 
                                    className={`
                                        ${connectionStatus === 'PENDING' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200' : ''}
                                        ${connectionStatus === 'ACCEPTED' ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200' : ''}
                                    `}
                                >
                                    {connectionStatus === 'PENDING' && isIncomingRequest && (
                                        <>
                                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                                            Request Received
                                        </>
                                    )}
                                    {connectionStatus === 'PENDING' && !isIncomingRequest && (
                                        <>
                                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                                            Request Sent
                                        </>
                                    )}
                                    {connectionStatus === 'ACCEPTED' && (
                                        <>
                                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                            Connected
                                        </>
                                    )}
                                </Badge>
                            </div>
                        ) : null}
                    </div>

                    {/* CONNECTION BUTTON */}
                    {!isSelf && (
                        <div className="flex gap-3 pb-4">
                            {renderConnectionButton()}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: About & Stats */}
                    <div className="space-y-6">
                        <Card className="border border-stone-200 shadow-lg rounded-2xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-stone-50 to-white">
                                <CardTitle className="flex items-center gap-2 text-stone-800">
                                    About Traveler
                                    {user.premium && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            user.subscriptionType === 'EXPLORER' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                            user.subscriptionType === 'MONTHLY' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                            'bg-orange-100 text-orange-700 border border-orange-200'
                                        }`}>
                                            {user.subscriptionType === 'EXPLORER' && 'Verified Explorer'}
                                            {user.subscriptionType === 'MONTHLY' && 'Verified Adventurer'}
                                            {user.subscriptionType === 'YEARLY' && 'Verified Globetrotter'}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-stone-600 leading-relaxed">{user.bio || "No bio provided."}</p>
                                <div className="mt-6 space-y-4">
                                    <h4 className="text-xs font-bold uppercase text-stone-400">Interests</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {user.interests.map((i: string) => (
                                            <Badge key={i} variant="secondary" className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200">
                                                {i}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card with Premium Section */}
                        <Card className="border border-stone-200 shadow-lg rounded-2xl overflow-hidden">
                            {/* Premium header gradient */}
                            {user.premium && (
                                <div className={`h-2 w-full bg-gradient-to-r ${
                                    user.subscriptionType === 'EXPLORER' ? 'from-blue-400 to-blue-500' :
                                    user.subscriptionType === 'MONTHLY' ? 'from-purple-500 to-purple-600' :
                                    'from-orange-500 to-amber-600'
                                }`} />
                            )}
                            <CardContent className={`pt-6 ${user.premium ? '' : 'bg-gradient-to-br from-stone-900 to-stone-800 text-white'}`}>
                                {/* Premium benefits section */}
                                {user.premium && renderPremiumStats(user)}
                                
                                {/* Stats grid */}
                                <div className={`grid grid-cols-2 gap-4 ${user.premium ? 'mt-4' : ''}`}>
                                    <div className={`text-center p-4 rounded-xl ${
                                        user.premium 
                                            ? 'bg-gradient-to-br from-stone-50 to-white text-stone-900 border border-stone-200' 
                                            : 'bg-gradient-to-br from-stone-800 to-stone-700'
                                    }`}>
                                        <div className={`text-2xl font-bold ${
                                            user.premium 
                                                ? user.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                                                  user.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                                                  'text-orange-500'
                                                : 'text-orange-400'
                                        }`}>
                                            {user.stats.hosted}
                                        </div>
                                        <div className={`text-[10px] uppercase tracking-wider font-medium ${
                                            user.premium ? 'text-stone-500' : 'text-stone-400'
                                        }`}>
                                            Hosted
                                        </div>
                                    </div>
                                    <div className={`text-center p-4 rounded-xl ${
                                        user.premium 
                                            ? 'bg-gradient-to-br from-stone-50 to-white text-stone-900 border border-stone-200' 
                                            : 'bg-gradient-to-br from-stone-800 to-stone-700'
                                    }`}>
                                        <div className={`text-2xl font-bold ${
                                            user.premium 
                                                ? user.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                                                  user.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                                                  'text-orange-500'
                                                : 'text-blue-400'
                                        }`}>
                                            {user.stats.joined}
                                        </div>
                                        <div className={`text-[10px] uppercase tracking-wider font-medium ${
                                            user.premium ? 'text-stone-500' : 'text-stone-400'
                                        }`}>
                                            Joined
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Premium indicator */}
                                {user.premium && (
                                    <div className="mt-4 pt-4 border-t border-stone-200">
                                        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                                            <ShieldCheck className="h-3 w-3" />
                                            <span>Premium member benefits active</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="trips">
                            <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6">
                                <TabsTrigger value="trips" className="rounded-none data-[state=active]:border-b-2 border-orange-500 px-6 py-3 text-stone-700 data-[state=active]:text-orange-600">
                                    Hosted Trips
                                    {user.premium && (
                                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700">
                                            {user.stats.hosted}
                                        </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 border-orange-500 px-6 py-3 text-stone-700 data-[state=active]:text-orange-600">
                                    Reviews
                                    {user.premium && (
                                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700">
                                            {user.stats.reviews}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="trips" className="mt-0">
                                {currentTrips.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentTrips.map((plan: TravelPlan) => (
                                                <Card key={plan.id} className="overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                                    <div className="relative h-32">
                                                        <Image 
                                                            src={plan.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080'} 
                                                            alt={plan.destination} 
                                                            fill 
                                                            className="object-cover" 
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                        {user.premium && (
                                                            <div className="absolute top-2 left-2">
                                                                <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs border-0">
                                                                    Premium
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <h3 className="font-bold text-stone-900">{plan.destination}</h3>
                                                        <p className="text-xs text-stone-500 mt-1">
                                                            {new Date(plan.startDate).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                        {plan.travelType && (
                                                            <Badge variant="outline" className="mt-2 text-xs border-stone-300 text-stone-600">
                                                                {plan.travelType}
                                                            </Badge>
                                                        )}
                                                        {plan.budget && (
                                                            <p className="text-sm text-stone-700 mt-2 font-medium">
                                                                Budget: ${plan.budget.toLocaleString()}
                                                            </p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                        
                                        {/* Pagination Controls */}
                                        {renderPagination()}
                                    </>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl bg-gradient-to-b from-stone-50 to-white">
                                        <Briefcase className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                                        <h3 className="text-lg font-medium text-stone-700 mb-2">No trips hosted yet</h3>
                                        <p className="text-stone-500 max-w-md mx-auto">
                                            This traveler hasn't created any travel plans yet. Check back later to see their adventures!
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-0">
                                {user.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.reviews.map((rev: any) => (
                                            <Card key={rev.id} className="border border-stone-200 shadow-sm">
                                                <CardContent className="p-4 flex gap-4">
                                                    <Avatar className={`
                                                        ${user.premium ? 
                                                            user.subscriptionType === 'EXPLORER' ? 'ring-2 ring-blue-300' :
                                                            user.subscriptionType === 'MONTHLY' ? 'ring-2 ring-purple-300' :
                                                            'ring-2 ring-orange-300'
                                                        : ''
                                                        }
                                                    `}>
                                                        <AvatarImage src={rev.reviewer?.profileImage} />
                                                        <AvatarFallback className="bg-gradient-to-br from-stone-300 to-stone-400 text-white">
                                                            {rev.reviewer?.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-stone-900">{rev.reviewer?.name || 'Anonymous'}</span>
                                                            <div className="flex items-center gap-1 text-yellow-500">
                                                                <Star className="h-3 w-3 fill-current" /> 
                                                                <span className="text-sm font-medium">{rev.rating}</span>
                                                            </div>
                                                            {user.premium && (
                                                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                                    user.subscriptionType === 'EXPLORER' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                                    user.subscriptionType === 'MONTHLY' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                                                    'bg-orange-50 text-orange-700 border border-orange-200'
                                                                }`}>
                                                                    Premium Review
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-stone-600 mt-2 italic">"{rev.content}"</p>
                                                        <p className="text-xs text-stone-400 mt-2">
                                                            {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl bg-gradient-to-b from-stone-50 to-white">
                                        <Star className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                                        <h3 className="text-lg font-medium text-stone-700 mb-2">No reviews yet</h3>
                                        <p className="text-stone-500 max-w-md mx-auto">
                                            This traveler hasn't received any reviews yet. Be the first to share your experience!
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            
            {/* Payment Modal */}
            {isPricingOpen && (
                <PaymentModal onClose={() => setIsPricingOpen(false)} />
            )}
        </div>
    )
}

const ProfileSkeleton = () => (
    <div className="container mx-auto px-4 pt-10 max-w-6xl">
        <Skeleton className="h-64 w-full rounded-3xl mb-8" />
        <div className="flex gap-6 -mt-20 px-8">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="space-y-3 pt-24">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-48" />
            </div>
        </div>
    </div>
)

export default PublicViewProfileComponent