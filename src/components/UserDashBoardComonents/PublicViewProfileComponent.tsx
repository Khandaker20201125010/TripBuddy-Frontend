/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    MapPin, Calendar, Star, Globe,
    Briefcase, CheckCircle, Shield, AlertCircle,
    Sparkles, UserPlus
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

interface PublicViewProfileProps {
    traveler: Traveler
}

const PublicViewProfileComponent = ({ traveler }: PublicViewProfileProps) => {
    const router = useRouter()
    const params = useParams()
    const userId = (params?.id || params?.userId) as string

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [errorDetails, setErrorDetails] = useState<string>("")
    const [isSent, setIsSent] = useState(false)
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const { sendRequest, isLoading } = useConnection()
    const { data: session } = useSession()

    // Logic to determine profile IDs and connection status
    const profileId = user?.id || traveler?.userId || traveler?.id
    const isSelf = session?.user?.id === profileId

    // Check status from either the initial prop or the freshly fetched user state
    const connectionData = user || traveler;
    const dbStatus = connectionData?.sentConnections?.[0]?.status || connectionData?.receivedConnections?.[0]?.status;

    const isPending = dbStatus === "PENDING" || isSent
    const isAccepted = dbStatus === "ACCEPTED"

    const handleConnectClick = async () => {
        // 1. Unauthenticated Check
        if (!session?.accessToken) {
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

        try {
            const result = await sendRequest(profileId, session.accessToken);

            if (result) {
                setIsSent(true);
                toast.success("Connection request sent!");
            }
        } catch (error: any) {
            // --- UPDATED: HANDLES ID-BASED NAVIGATION ---
            if (error.statusCode === 403 || error.message?.toLowerCase().includes("limit reached")) {
                return Swal.fire({
                    title: 'Limit Reached!',
                    text: error.message || 'You have reached your free connection limit.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Upgrade Plan', // Changed text for clarity
                    confirmButtonColor: '#f97316',
                    cancelButtonColor: '#78716c',
                    customClass: { popup: 'rounded-2xl' }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // OPEN THE MODAL INSTEAD OF SCROLLING
                        setIsPricingOpen(true);
                    }
                });
            }
            if (error.statusCode === 409 || error.message?.includes("already exists")) {
                setIsSent(true);
                return toast.info("A request is already pending");
            }

            toast.error(error.message || "Failed to send request.");
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
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
                        // IMPORTANT: Pass token so backend can return connection status for the logged-in user
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
                    setUser({
                        ...data,
                        interests: data.interests || [],
                        visitedCountries: data.visitedCountries || [],
                        stats: {
                            hosted: data.travelPlans?.length || 0,
                            joined: data.joinedTrips?.length || 0,
                            reviews: data.reviewsReceived?.length || 0
                        },
                        travelPlans: data.travelPlans || [],
                        reviews: data.reviewsReceived || []
                    })
                }
            } catch (error) {
                setErrorDetails("Network connection failed")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [userId, session?.accessToken])

    if (loading) return <ProfileSkeleton />

    if (!user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="text-stone-500 mb-6">{errorDetails || "This traveler profile could not be loaded."}</p>
            <Link href="/travelers">
                <Button className="bg-orange-500 text-white">Explore Other Travelers</Button>
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            {/* COVER IMAGE */}
            <div className="relative h-64 md:h-80 w-full bg-stone-200">
                <Image
                    src={user.profileImage || '/default-cover.jpg'}
                    alt="Cover"
                    fill
                    className="object-cover opacity-60 blur-[2px]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-50 to-transparent" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="relative -mt-24 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
                    {/* AVATAR */}
                    <Avatar className="h-36 w-36 md:h-44 md:w-44 border-8 border-white shadow-2xl bg-white">
                        <AvatarImage src={user.profileImage} className="object-cover" />
                        <AvatarFallback className="text-3xl">{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    {/* BASIC INFO */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-4xl font-extrabold text-stone-900">{user.name}</h1>
                            {user.rating > 4.5 && <CheckCircle className="text-green-500 h-6 w-6" />}
                        </div>
                        <p className="text-stone-500 text-lg">{user.email}</p>
                    </div>

                    {/* CONNECTION BUTTON */}
                    {!isSelf && (
                        <div className="flex gap-3 pb-4">
                            <Button
                                variant={isPending || isAccepted ? "secondary" : "default"}
                                size="lg"
                                className={!isPending && !isAccepted ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-stone-200 text-stone-600"}
                                onClick={handleConnectClick}
                                disabled={isLoading || isPending || isAccepted}
                            >
                                {isLoading ? "Sending..." :
                                    isAccepted ? "Buddy" :
                                        isPending ? "Requested" :
                                            <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Request Buddy</span>}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: About & Stats */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-md">
                            <CardHeader><CardTitle>About Traveler</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-stone-600 leading-relaxed">{user.bio || "No bio provided."}</p>
                                <div className="mt-6 space-y-4">
                                    <h4 className="text-xs font-bold uppercase text-stone-400">Interests</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {user.interests.map((i: string) => (
                                            <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-700">{i}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-stone-900 text-white border-none">
                            <CardContent className="pt-6 grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <div className="text-2xl font-bold text-orange-400">{user.stats.hosted}</div>
                                    <div className="text-[10px] uppercase text-stone-400">Hosted</div>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-400">{user.stats.joined}</div>
                                    <div className="text-[10px] uppercase text-stone-400">Joined</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="trips">
                            <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6">
                                <TabsTrigger value="trips" className="rounded-none data-[state=active]:border-b-2 border-orange-500 px-6 py-3">Hosted Trips</TabsTrigger>
                                <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 border-orange-500 px-6 py-3">Reviews</TabsTrigger>
                            </TabsList>

                            <TabsContent value="trips">
                                {user.travelPlans.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.travelPlans.map((plan: any) => (
                                            <Card key={plan.id} className="overflow-hidden">
                                                <div className="relative h-32">
                                                    <Image src={plan.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080'} alt={plan.destination} fill className="object-cover" />
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-bold">{plan.destination}</h3>
                                                    <p className="text-xs text-stone-500">{new Date(plan.startDate).toLocaleDateString()}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed rounded-2xl">
                                        <Briefcase className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                                        <p className="text-stone-500">No journeys posted yet.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews">
                                {user.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.reviews.map((rev: any) => (
                                            <Card key={rev.id}>
                                                <CardContent className="p-4 flex gap-4">
                                                    <Avatar><AvatarImage src={rev.reviewer?.profileImage} /></Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm">{rev.reviewer?.name}</span>
                                                            <div className="flex text-yellow-500"><Star className="h-3 w-3 fill-current" /> {rev.rating}</div>
                                                        </div>
                                                        <p className="text-sm text-stone-600 mt-1 italic">"{rev.content}"</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed rounded-2xl">
                                        <Star className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                                        <p className="text-stone-500">No reviews yet.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
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
            <div className="space-y-3 pt-24"><Skeleton className="h-10 w-64" /><Skeleton className="h-5 w-48" /></div>
        </div>
    </div>
)

export default PublicViewProfileComponent