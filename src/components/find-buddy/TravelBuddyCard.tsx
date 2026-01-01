/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  Globe,
  Heart,
  Share2,
  MessageCircle,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession, signIn } from "next-auth/react";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface TravelBuddyCardProps {
  plan: any;
  index?: number;
}

export function TravelBuddyCard({ plan, index = 0 }: TravelBuddyCardProps) {
  const { data: session } = useSession();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  // Logged-in user's buddy status
  const buddyStatus = useMemo(() => {
    if (localStatus) return localStatus;
    if (!plan || !session?.user) return null;
    return plan.buddies?.find((b: any) => b.userId === session.user.id)?.status || null;
  }, [plan, session, localStatus]);

  const isTripOver = new Date(plan.endDate) < new Date();
  const hostProfileId = plan.user?.id;
  const isHost = session?.user?.id === hostProfileId;

  // Calculate trip duration
  const tripDuration = useMemo(() => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [plan.startDate, plan.endDate]);

  // Format date range
  const formattedDateRange = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = new Date(plan.startDate).toLocaleDateString('en-US', options);
    const end = new Date(plan.endDate).toLocaleDateString('en-US', options);
    return `${start} - ${end}`;
  }, [plan.startDate, plan.endDate]);

  // Calculate days until trip
  const daysUntilTrip = useMemo(() => {
    const today = new Date();
    const start = new Date(plan.startDate);
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [plan.startDate]);

  const handleJoinRequest = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!session) {
      const result = await Swal.fire({
        title: "Join the Adventure!",
        text: "You need an account to request a join. Login now?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Let's Go",
        confirmButtonColor: "#ea580c",
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-xl font-bold',
          confirmButton: 'rounded-lg px-6'
        }
      });

      if (result.isConfirmed) signIn();
      return;
    }

    setIsRequesting(true);
    try {
      await api.post(`/travelPlan/request/${plan.id}`);
      setLocalStatus("PENDING");
      Swal.fire({
        title: "Request Sent!",
        text: "The host has been notified of your interest.",
        icon: "success",
        confirmButtonColor: "#10b981",
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-xl font-bold',
        }
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: 'rounded-2xl',
        }
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Determine status badge color
  const getStatusBadge = () => {
    if (isTripOver) {
      return { text: 'Completed', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
    if (daysUntilTrip <= 7) {
      return { text: 'Starting Soon', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (plan.travelType === 'Solo') {
      return { text: 'Solo', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    return { text: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const statusBadge = getStatusBadge();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-gradient-to-br from-white to-stone-50 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-stone-200 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-bl-2xl" />

      {/* Header with host info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-white shadow-sm flex items-center justify-center">
              {plan.user?.image ? (
                <Image
                  src={plan.user.image}
                  alt={plan.user?.name || "Traveler"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <Users className="w-6 h-6 text-orange-500" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-900">
              {plan.user?.name || "Anonymous Traveler"}
            </h4>
            <p className="text-xs text-stone-500">Travel Host</p>
          </div>
        </div>
        
        <Badge className={`px-3 py-1.5 font-medium border ${statusBadge.color}`}>
          {statusBadge.text}
        </Badge>
      </div>

      {/* Destination & Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-stone-600">{plan.destination}</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 leading-tight">
          {plan.title || `Adventure to ${plan.destination}`}
        </h3>
      </div>

      {/* Trip Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-stone-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-medium text-stone-500">Dates</span>
          </div>
          <p className="text-sm font-semibold text-stone-900">{formattedDateRange}</p>
          <p className="text-xs text-stone-500">{tripDuration} days</p>
        </div>

        <div className="bg-stone-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-medium text-stone-500">Group</span>
          </div>
          <p className="text-sm font-semibold text-stone-900 capitalize">{plan.travelType}</p>
          <p className="text-xs text-stone-500">
            {plan.currentTravelers || 1}/{plan.maxTravelers || '∞'} spots
          </p>
        </div>

        <div className="bg-stone-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-medium text-stone-500">Budget</span>
          </div>
          <p className="text-sm font-semibold text-stone-900">${plan.budget || 'Flexible'}</p>
          <p className="text-xs text-stone-500">Per person</p>
        </div>

        <div className="bg-stone-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-medium text-stone-500">Starts in</span>
          </div>
          <p className="text-sm font-semibold text-stone-900">
            {daysUntilTrip > 0 ? `${daysUntilTrip} days` : 'Ongoing'}
          </p>
          <p className="text-xs text-stone-500">{isTripOver ? 'Trip ended' : 'Active'}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 flex-1">
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
          {plan.description || "Join this exciting adventure to explore new destinations and create unforgettable memories with fellow travelers."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Primary CTA */}
        <div className="flex gap-2">
          <Link href={`/PublicViewDetails/${plan.id}`} className="flex-1">
            <Button 
              variant="default" 
              size="default"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group/btn"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          {/* <button
            onClick={handleLike}
            className="p-2.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 transition-colors group/like"
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isLiked 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-stone-400 group-hover/like:text-stone-600'
              }`} 
            />
          </button> */}
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/PublicVisitProfile/${hostProfileId}`} 
            className="flex-1"
            onClick={(e) => !hostProfileId && e.preventDefault()}
          >
            <Button 
              variant="outline" 
              size="default"
              disabled={!hostProfileId}
              className="w-full border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-700 transition-colors"
            >
              View Host Profile
            </Button>
          </Link>

          {session && !isHost && !isTripOver && (
            <Button
              variant="outline"
              size="default"
              onClick={handleJoinRequest}
              disabled={isRequesting || buddyStatus === "PENDING" || buddyStatus === "ACCEPTED"}
              className={`flex-1 border ${
                buddyStatus === "PENDING"
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : buddyStatus === "ACCEPTED"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-stone-300 hover:border-stone-400"
              } transition-colors`}
            >
              {isRequesting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  Sending...
                </span>
              ) : buddyStatus === "PENDING" ? (
                "Request Sent"
              ) : buddyStatus === "ACCEPTED" ? (
                "Joined ✓"
              ) : (
                "Express Interest"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{plan.commentsCount || 0} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{plan.buddiesCount || 0} interested</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{plan.rating || "New"}</span>
        </div>
      </div>
    </motion.article>
  );
}