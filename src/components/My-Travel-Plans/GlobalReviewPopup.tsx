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

  const checkPendingReviews = async () => {
    if (!session?.user) return;

    try {
      // Call the new endpoint we made in Step 1
      const res = await api.get("/review/pending");
      
      if (res.data?.data) {
        const plan = res.data.data;
        
        // Check session storage so we don't annoy them if they just closed it
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

  useEffect(() => {
    // Check when session loads
    if (session?.user) {
      checkPendingReviews();
    }
  }, [session]);

  const handleClose = () => {
    setIsOpen(false);
    if (pendingPlan) {
      // If they close without reviewing, remind them next session (or set timeout)
      // For now, let's silence it for this browser session
      sessionStorage.setItem(`ignore_review_${pendingPlan.id}`, "true");
    }
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setPendingPlan(null);
    // Optionally check if there are MORE reviews pending
    checkPendingReviews(); 
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