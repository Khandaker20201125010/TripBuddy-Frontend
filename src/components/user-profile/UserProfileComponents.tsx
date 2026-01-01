"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { EditProfileModal } from "@/components/ui/EditProfileModal";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { PremiumStatsCard } from "./components/PremiumStatsCard";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { ErrorState } from "./components/ErrorState";
import { useProfileData } from "./hooks/useProfileData";

export default function UserProfileComponents() {
  const { data: session } = useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trips");

  const {
    profile,
    connections,
    incomingRequests,
    loading,
    error,
    fetchProfile,
    handleRespondToRequest,
    handleDeleteConnection
  } = useProfileData();

  // Loading state
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Error state
  if (error || !profile) {
    return <ErrorState error={error || "Profile not found"} onRetry={fetchProfile} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pt-20"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-amber-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          session={session}
          onEditClick={() => setIsEditOpen(true)}
          onPremiumClick={() => setIsPaymentModalOpen(true)}
        />

        {/* Stats Grid */}
        <ProfileStats
          profile={profile}
          connectionsCount={connections.length}
          incomingRequestsCount={incomingRequests.length}
        />

        {/* Premium Stats Card */}
        <PremiumStatsCard
          profile={profile}
          onPremiumClick={() => setIsPaymentModalOpen(true)}
        />

        {/* Main Content Tabs */}
        <ProfileTabs
          profile={profile}
          connections={connections}
          incomingRequests={incomingRequests}
          session={session}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEditClick={() => setIsEditOpen(true)}
          onRespondToRequest={handleRespondToRequest}
          onDeleteConnection={handleDeleteConnection}
        />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={profile}
        onSuccess={fetchProfile}
      />

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </motion.div>
  );
}