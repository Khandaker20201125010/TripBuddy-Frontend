// frontend/app/profile/[id]/page.tsx
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

import { UserProfile } from "./helpers/types";
import EnhancedUserLocationMapSimple from "./components/EnhancedUserLocationMapSimple";
import EnhancedUserLocationMap from "./components/EnhancedUserLocationMap";

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

  // Type assertion to handle optional fields
  const userProfile = profile as UserProfile;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Profile Header */}
        <ProfileHeader
          profile={userProfile}
          session={session}
          onEditClick={() => setIsEditOpen(true)}
          onPremiumClick={() => setIsPaymentModalOpen(true)}
        />

        {/* Stats Grid */}
        <ProfileStats
          profile={userProfile}
          connectionsCount={connections.length}
          incomingRequestsCount={incomingRequests.length}
        />

        {/* Premium Stats Card */}
        <PremiumStatsCard
          profile={userProfile}
          onPremiumClick={() => setIsPaymentModalOpen(true)}
        />

        {/* Main Content Tabs */}
        <ProfileTabs
          profile={userProfile}
          connections={connections}
          incomingRequests={incomingRequests}
          session={session}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEditClick={() => setIsEditOpen(true)}
          onRespondToRequest={handleRespondToRequest}
          onDeleteConnection={handleDeleteConnection}
        />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Location</h2>
            <div className="text-sm text-gray-500">
              {userProfile.latitude && userProfile.longitude ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live location enabled
                </span>
              ) : (
                <span className="text-amber-600">Location not set</span>
              )}
            </div>
          </div>

          {/* ✅ Use Enhanced Map Component */}
          <EnhancedUserLocationMap
            userId={userProfile.id}
            user={userProfile}
            isCurrentUser={session?.user?.id === userProfile.id}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={userProfile}
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