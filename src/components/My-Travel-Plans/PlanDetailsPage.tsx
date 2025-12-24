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
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ReviewFormModal } from "@/components/ReviewsComponents/ReviewFormModal";
import { useSession, signIn } from "next-auth/react";
import { Rating } from "@/components/ui/Rating";
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

  // ✅ CHECK THE USER'S BUDDY STATUS
  const userBuddyRecord = useMemo(() => {
    if (!plan || !session?.user) return null;
    return plan.buddies?.find((buddy: any) => buddy.userId === session.user.id);
  }, [plan, session]);

  const isApprovedBuddy = userBuddyRecord?.status === "APPROVED";
  const isPendingBuddy = userBuddyRecord?.status === "PENDING";
  const isHost = session?.user?.id === plan?.userId;

  const isTripOver = useMemo(() => {
    if (!plan) return false;
    return new Date(plan.endDate) < new Date();
  }, [plan]);

  const userReview = useMemo(() => {
    if (!plan || !session?.user || !plan.reviews) return null;
    return plan.reviews.find((r: any) => r.reviewerId === session.user.id);
  }, [plan, session]);

  // ✅ AUTO-OPEN REVIEW MODAL LOGIC
  useEffect(() => {
    if (!loading && plan && session?.user) {
      if (isTripOver && isApprovedBuddy && !userReview) {
        const hasSeenPrompt = sessionStorage.getItem(`review_prompt_${plan.id}`);
        if (!hasSeenPrompt) {
          const timer = setTimeout(() => {
            setIsReviewModalOpen(true);
            sessionStorage.setItem(`review_prompt_${plan.id}`, 'true'); 
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [loading, plan, session, isTripOver, isApprovedBuddy, userReview]);

  // ✅ HANDLER WITH AUTH GUARD
  const handleJoinRequest = async () => {
    // 1. Check if logged in
    if (!session) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "You need to be logged in to join this trip.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        confirmButtonColor: "#ea580c",
      });

      if (result.isConfirmed) {
        signIn(); // Redirects to login page
      }
      return;
    }

    // 2. Proceed with API call if logged in
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

  if (loading || !plan) return <p className="text-center p-10 font-medium">Loading Adventure Details...</p>;

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
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{plan.destination}</h1>
            <div className="flex flex-wrap items-center text-gray-500 gap-4 text-sm">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-orange-500" /> {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-orange-500" /> Global Exploration</span>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Info className="w-6 h-6 text-blue-500" /> About this trip
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {plan.description || "No specific description provided for this itinerary yet."}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h4 className="text-blue-700 font-bold mb-1 flex items-center gap-2 text-sm"><Wallet className="w-4 h-4" /> Budget Range</h4>
              <p className="text-2xl font-black text-blue-900">${plan.budget}</p>
              <p className="text-xs text-blue-600 mt-1 uppercase tracking-wider font-semibold">Estimated per person</p>
            </div>
            <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
              <h4 className="text-purple-700 font-bold mb-1 flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /> Duration</h4>
              <p className="text-2xl font-black text-purple-900">
                {Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 3600 * 24))} Days
              </p>
              <p className="text-xs text-purple-600 mt-1 uppercase tracking-wider font-semibold">Total Trip Length</p>
            </div>
          </section>

          {/* Review Banner for Completed Trips */}
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
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Your Rating</span>
                    <Rating rating={userReview.rating} size={14} />
                  </div>
                </div>
              ) : (
                 <Button variant="default" className="bg-amber-600 hover:bg-amber-700" onClick={() => setIsReviewModalOpen(true)}>Rate Your Buddy</Button>
              )}
            </div>
          )}

          {/* REVIEWS SECTION */}
          {(isApprovedBuddy || isHost) ? (
            plan.reviews?.length > 0 && (
              <section className="pt-8 border-t">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Trip Reviews</h3>
                <div className="grid gap-4">
                  {plan.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-200">
                            <Image src={rev.reviewer?.profileImage || "/placeholder-user.png"} fill alt="Reviewer" className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{rev.reviewer?.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Participant</p>
                          </div>
                        </div>
                        <Rating rating={rev.rating} size={12} />
                      </div>
                      <p className="text-gray-600 text-sm italic leading-relaxed">"{rev.content}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          ) : isTripOver && (
            <div className="p-8 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">Reviews for this trip are exclusive to participants.</p>
                <p className="text-xs text-gray-400 mt-1">Join a trip to see community feedback!</p>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Meet your host</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <Image
                  fill
                  src={plan.user?.profileImage || "/placeholder-user.png"}
                  alt="Host"
                  className="rounded-full object-cover border-4 border-gray-50 shadow-sm"
                />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">{plan.user?.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <Rating rating={plan.user?.rating || 0} size={14} />
                  <span className="text-xs font-bold text-gray-400 tracking-tight">({plan.user?.rating?.toFixed(1)})</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-8 leading-relaxed italic border-l-2 border-orange-500 pl-4">
              {plan.user?.bio || "Passionate traveler looking for great buddies to explore the world with."}
            </p>

            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="p-2 bg-green-50 rounded-lg"><ShieldCheck className="w-4 h-4 text-green-600" /></div>
                  Identity Verified
               </div>
               <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-lg"><MessageSquare className="w-4 h-4 text-blue-600" /></div>
                  Quick Responder
               </div>
            </div>

            {/* ACTION BUTTON */}
            {!isHost ? (
              <Button 
                variant={isApprovedBuddy ? "outline" : "gradient"}
                onClick={handleJoinRequest}
                disabled={isRequesting || isTripOver || isApprovedBuddy || isPendingBuddy}
                className={`w-full py-7 rounded-2xl text-lg font-bold transition-all duration-300 ${
                  !isApprovedBuddy && !isPendingBuddy && !isTripOver ? "bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-100" : ""
                }`}
              >
                {isRequesting ? (
                  "Processing..."
                ) : isApprovedBuddy ? (
                  <span className="flex items-center gap-2 text-green-600"><CheckCircle className="w-6 h-6" /> You're Joined</span>
                ) : isPendingBuddy ? (
                  <span className="flex items-center gap-2 text-amber-600"><Timer className="w-6 h-6" /> Request Pending</span>
                ) : isTripOver ? (
                  "Trip Ended"
                ) : (
                  "Request to Join"
                )}
              </Button>
            ) : (
              <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Host Access</p>
                <p className="text-xs text-gray-500 mt-1">Manage this trip from your dashboard</p>
              </div>
            )}
            
            {!session && (
              <p className="text-[10px] text-center text-gray-400 mt-4 uppercase font-bold tracking-widest">
                Account required to join
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Share Your Experience">
        <ReviewFormModal 
          plan={plan} 
          onClose={() => setIsReviewModalOpen(false)} 
          onSuccess={fetchPlanData} 
        />
      </Modal>
    </div>
  );
}