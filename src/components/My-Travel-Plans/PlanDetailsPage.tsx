/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { 
  Calendar, CheckCircle, MapPin, Wallet, 
  Clock, ShieldCheck, MessageSquare, Info, Timer 
} from "lucide-react";
import { useMyTravelPlans } from "@/hooks/travelshooks/useMyTravelPlans";
import Image from "next/image";
import { Button } from "../ui/button";
import { Modal } from "../ui/Modal";
import { ReviewFormModal } from "../ReviewsComponents/ReviewFormModal";
import { useSession } from "next-auth/react";
import { Rating } from "../ui/Rating";
import Swal from "sweetalert2";
import api from "@/lib/axios";

export default function PlanDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const { getSinglePlan, loading } = useMyTravelPlans();

  const [plan, setPlan] = useState<any | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const fetchPlanData = useCallback(() => {
    if (id) getSinglePlan(id as string).then(setPlan);
  }, [id, getSinglePlan]);

  useEffect(() => {
    fetchPlanData();
  }, [fetchPlanData]);

  // ✅ 1. CHECK THE USER'S SPECIFIC BUDDY STATUS
  const userBuddyRecord = useMemo(() => {
    if (!plan || !session?.user) return null;
    return plan.buddies?.find((buddy: any) => buddy.userId === session.user.id);
  }, [plan, session]);

  const isApprovedBuddy = userBuddyRecord?.status === "APPROVED";
  const isPendingBuddy = userBuddyRecord?.status === "PENDING";

  const isTripOver = useMemo(() => {
    if (!plan) return false;
    return new Date(plan.endDate) < new Date();
  }, [plan]);

  const userReview = useMemo(() => {
    if (!plan || !session?.user || !plan.reviews) return null;
    return plan.reviews.find((r: any) => r.reviewerId === session.user.id);
  }, [plan, session]);

  // ✅ 2. AUTO-OPEN MODAL LOGIC
  useEffect(() => {
    // Wait until loading finishes and we have plan data
    if (!loading && plan && session?.user) {
      
      // Criteria: Trip is over + User is Approved Buddy + User hasn't reviewed yet
      if (isTripOver && isApprovedBuddy && !userReview) {
        
        // Optional: Check sessionStorage to prevent annoying the user if they close it once per session
        // Remove the sessionStorage lines if you want it to FORCE open every refresh
        const hasSeenPrompt = sessionStorage.getItem(`review_prompt_${plan.id}`);

        if (!hasSeenPrompt) {
          // Add a small delay for better UX (don't pop up instantly on load)
          const timer = setTimeout(() => {
            setIsReviewModalOpen(true);
            sessionStorage.setItem(`review_prompt_${plan.id}`, 'true'); 
          }, 1500);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [loading, plan, session, isTripOver, isApprovedBuddy, userReview]);

  const handleJoinRequest = async () => {
    if (!session) {
        return Swal.fire("Error", "Please login to join this trip", "error");
    }
    setIsRequesting(true);
    try {
      await api.post(`/travelPlan/request/${plan?.id}`);
      Swal.fire("Success", "Your request to join has been sent!", "success");
      fetchPlanData(); 
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to send request", "error");
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading || !plan) return <p className="text-center p-10">Loading Adventure Details...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Hero Image Section */}
      <div className="relative h-64 md:h-[450px] w-full mb-8">
        <Image
          fill
          src={plan.image || "/placeholder-travel.jpg"}
          alt={plan.destination}
          className="object-cover rounded-3xl shadow-lg"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold shadow-sm">
          {plan.travelType}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Itinerary & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{plan.destination}</h1>
            <div className="flex flex-wrap items-center text-gray-500 gap-4">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Global</span>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500" /> About this trip
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {plan.description || "No specific description provided for this itinerary yet."}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="text-blue-700 font-bold mb-1 flex items-center gap-2"><Wallet className="w-4 h-4" /> Budget Range</h4>
              <p className="text-2xl font-black text-blue-900">${plan.budget}</p>
              <p className="text-xs text-blue-600 mt-1">Estimated total per person</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
              <h4 className="text-purple-700 font-bold mb-1 flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</h4>
              <p className="text-2xl font-black text-purple-900">
                {Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 3600 * 24))} Days
              </p>
              <p className="text-xs text-purple-600 mt-1">From departure to return</p>
            </div>
          </section>

          {/* ✅ 3. REVIEW PROMPT SECTION (Manual trigger always visible if not reviewed) */}
          {isTripOver && isApprovedBuddy && (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-amber-900 text-lg">Trip Completed!</h3>
                <p className="text-sm text-amber-800">
                  {userReview ? "Thanks for sharing your experience!" : `How was your journey with ${plan.user?.name}?`}
                </p>
              </div>
              {userReview ? (
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-3 border border-amber-100">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-bold uppercase">Your Rating</span>
                    <Rating rating={userReview.rating} size={14} />
                  </div>
                </div>
              ) : (
                 <Button variant="gradient" onClick={() => setIsReviewModalOpen(true)}>Rate Your Buddy</Button>
              )}
            </div>
          )}

          {/* REVIEWS LIST */}
          {(isApprovedBuddy || session?.user?.id === plan.userId) ? (
            plan.reviews?.length > 0 && (
                <section className="pt-8 border-t">
                    <h3 className="text-2xl font-bold mb-4">Trip Reviews</h3>
                    <div className="space-y-4">
                        {plan.reviews.map((rev: any) => (
                            <div key={rev.id} className="p-4 bg-white border rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                                            <Image 
                                                src={rev.reviewer?.profileImage || "/placeholder-user.png"} 
                                                fill 
                                                alt="Reviewer" 
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-bold text-sm">{rev.reviewer?.name}</span>
                                    </div>
                                    <Rating rating={rev.rating} size={12} />
                                </div>
                                <p className="text-gray-600 text-sm italic">"{rev.content}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            )
          ) : isTripOver && (
            <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-400 text-sm border border-dashed">
                <ShieldCheck className="w-5 h-5 mx-auto mb-1 opacity-50" />
                Reviews for this trip are only visible to participants.
            </div>
          )}
        </div>

        {/* Right Column: Host Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Meet your host</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <Image
                  fill
                  src={plan.user?.profileImage || "/placeholder-user.png"}
                  alt="Host"
                  className="rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg">{plan.user?.name}</h4>
                <div className="flex items-center gap-1">
                  <Rating rating={plan.user?.rating || 0} size={14} />
                  <span className="text-xs text-gray-500">({plan.user?.rating?.toFixed(1)})</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 line-clamp-3">
              {plan.user?.bio || "Passionate traveler looking for great buddies to explore the world with."}
            </p>

            <div className="space-y-3 mb-6">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Identity Verified
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  Quick Responder
               </div>
            </div>

            {session?.user?.id !== plan.userId ? (
              <Button 
                variant={isApprovedBuddy ? "outline" : "gradient"}
                onClick={handleJoinRequest}
                disabled={isRequesting || isTripOver || isApprovedBuddy || isPendingBuddy}
                className="w-full py-6 rounded-2xl text-lg font-bold shadow-lg shadow-blue-100"
              >
                {isRequesting ? (
                  "Sending..."
                ) : isApprovedBuddy ? (
                  <span className="flex items-center gap-2 text-green-600 font-bold"><CheckCircle className="w-5 h-5" /> You're Joined</span>
                ) : isPendingBuddy ? (
                  <span className="flex items-center gap-2 text-amber-600"><Timer className="w-5 h-5" /> Request Pending</span>
                ) : isTripOver ? (
                  "Trip Ended"
                ) : (
                  "Request to Join"
                )}
              </Button>
            ) : (
              <Button disabled className="w-full py-6 rounded-2xl opacity-50 bg-gray-100 text-gray-500 border-none">
                You are the Host
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Submit Review">
        <ReviewFormModal 
          plan={plan} 
          onClose={() => setIsReviewModalOpen(false)} 
          onSuccess={fetchPlanData} 
        />
      </Modal>
    </div>
  );
}