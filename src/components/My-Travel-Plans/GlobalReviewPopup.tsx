/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal"; 
import { ReviewFormModal } from "@/components/ReviewsComponents/ReviewFormModal";
import api from "@/lib/axios";

export default function GlobalReviewPopup() {
  const { data: session } = useSession();
  const [pendingPlan, setPendingPlan] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Create a "trigger" state. Incrementing this number forces the effect to run again.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkPendingReviews = async () => {
      // FIXED: Added check to ensure user exists AND is not an ADMIN
      const user = session?.user as any;
      if (!user || user.role === 'ADMIN') return;

      try {
        const res = await api.get("/review/pending");
        
        if (res.data?.data) {
          const plan = res.data.data;
          const hasSeen = sessionStorage.getItem(`ignore_review_${plan.id}`);
          
          if (!hasSeen) {
            setPendingPlan(plan);
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Failed to check pending reviews", error);
      }
    };

    // Only run if we have a user
    if (session?.user) {
      checkPendingReviews();
    }

    // 3. Add 'refreshKey' to dependencies. Changing it re-runs this effect.
  }, [session, refreshKey]);

  const handleClose = () => {
    setIsOpen(false);
    if (pendingPlan) {
      sessionStorage.setItem(`ignore_review_${pendingPlan.id}`, "true");
    }
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setPendingPlan(null);
    setRefreshKey(prev => prev + 1); 
  };

  if (!pendingPlan) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="How was your trip?"
    >
      <ReviewFormModal 
        plan={pendingPlan} 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
      />
    </Modal>
  );
}