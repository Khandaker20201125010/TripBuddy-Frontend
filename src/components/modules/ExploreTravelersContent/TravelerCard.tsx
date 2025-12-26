/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { UserPlus, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react'
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

interface TravelerCardProps {
  traveler: Traveler
  index: number
}

export function TravelerCard({ traveler, index }: TravelerCardProps) {
  const { sendRequest, isLoading } = useConnection();
  const router = useRouter();
  const { data: session } = useSession();

  const [isSent, setIsSent] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // 1. Target the correct user object (Handling nested TravelPlan responses)
  const userObj = traveler.user || traveler;
  const profileId = userObj.id || traveler.userId;
  const isSelf = session?.user?.id === profileId;

  // 2. Logic for Persistence: Check DB status fetched via getAllTravelPlans
  // Ensure your backend includes sentConnections/receivedConnections filtered by current user
  const dbStatus = 
    userObj.sentConnections?.[0]?.status || 
    userObj.receivedConnections?.[0]?.status;

  const isPending = dbStatus === "PENDING" || isSent;
  const isAccepted = dbStatus === "ACCEPTED";

  const handleConnectClick = async () => {
    // Unauthenticated Check
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
        
        // ✅ CRITICAL: Sync server data immediately
        // This forces Next.js to re-fetch the list, updating userObj.sentConnections
        router.refresh(); 
      }
    } catch (error: any) {
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
          if (result.isConfirmed) setIsPricingOpen(true);
        });
      }

      // Handle Conflicts
      if (error.statusCode === 409 || error.message?.includes("already exists")) {
        setIsSent(true);
        return toast.info("A request is already pending");
      }

      toast.error(error.message || "Failed to send request.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
        <div className="relative h-24 bg-gradient-to-r from-orange-100 to-amber-50">
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-orange-700">
              {userObj.role === 'ADMIN' ? 'Expert' : 'Traveler'}
            </Badge>
          </div>
        </div>

        <CardContent className="pt-0 pb-6 px-6 relative">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={userObj.profileImage} alt={userObj.name} className="object-cover" />
              <AvatarFallback className="bg-stone-200 text-stone-500 text-xl font-bold">
                {userObj.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-stone-900 line-clamp-1">{userObj.name}</h3>
              <div className="flex items-center text-xs text-stone-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {userObj.visitedCountries?.[0] || 'Global Citizen'}
              </div>
            </div>

            <p className="text-sm text-stone-500 line-clamp-2 min-h-[40px]">
              {userObj.bio || `Hi, I'm ${userObj.name}!`}
            </p>

            <CardFooter className="grid grid-cols-2 gap-2 p-4 bg-stone-50/50 border-t border-stone-100">
              <Button
                variant={isPending || isAccepted ? "secondary" : "outline"}
                size="sm"
                className={`w-full text-xs cursor-pointer transition-all ${
                  isPending ? "bg-stone-200 text-stone-600" : ""
                }`}
                onClick={handleConnectClick}
                disabled={isLoading || isPending || isAccepted || isSelf}
              >
                {isLoading ? (
                  "Sending..."
                ) : isAccepted ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
                    Buddy
                  </>
                ) : isPending ? (
                  "Requested"
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                    Connect
                  </>
                )}
              </Button>

              <Link href={`/PublicVisitProfile/${profileId}`} className="w-full">
                <Button size="sm" className="cursor-pointer w-full text-xs bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm">
                  Profile <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
      {isPricingOpen && (
        <PaymentModal onClose={() => setIsPricingOpen(false)} />
      )}
    </motion.div>
  )
}