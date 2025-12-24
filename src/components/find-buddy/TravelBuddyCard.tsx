/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, Calendar, User, DollarSign, CheckCircle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TravelPlan } from "@/types/travel";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import Link from "next/link";

export function TravelBuddyCard({ plan }: { plan: any }) {
  const { data: session } = useSession();
  const [isRequesting, setIsRequesting] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  // 1. Determine Status (Pending, Approved, or None)
  const buddyStatus = useMemo(() => {
    // If user just clicked request, show PENDING immediately
    if (localStatus) return localStatus;

    if (!plan || !session?.user) return null;
    const record = plan.buddies?.find((b: any) => b.userId === session.user.id);
    return record?.status || null;
  }, [plan, session, localStatus]);

  const isTripOver = new Date(plan.endDate) < new Date();
  const isHost = session?.user?.id === plan.userId;

  // 2. Handle Join Request
  const handleJoinRequest = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if wrapped in a link
    
    if (!session) {
      return Swal.fire({
        title: "Login Required",
        text: "Please login to join this adventure!",
        icon: "info",
        confirmButtonText: "Okay",
        confirmButtonColor: "#ea580c", // orange-600
      });
    }

    setIsRequesting(true);
    try {
      await api.post(`/travelPlan/request/${plan.id}`);
      setLocalStatus("PENDING");
      Swal.fire("Sent!", "Your request is waiting for host approval.", "success");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to send request", "error");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <article className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {plan.destination}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-orange-500" />
            <span className="truncate max-w-[150px]">Hosted by {plan.user?.name ?? "Traveler"}</span>
          </div>
        </div>
        <Badge className="bg-orange-50 text-orange-700 border-orange-100 whitespace-nowrap">
          {plan.travelType}
        </Badge>
      </div>

      {/* Trip Details Box */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              {plan.travelType}
            </div>
            <div className="flex items-center text-gray-900 font-bold">
              <DollarSign className="w-4 h-4 text-green-600" />
              {plan.budget}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-6">
        {plan.description}
      </p>

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link href={`/my-travel-plans/${plan.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full border-gray-200 hover:bg-gray-50">
            View Details
          </Button>
        </Link>

        {isHost ? (
          <Button disabled size="sm" className="bg-gray-100 text-gray-400 cursor-not-allowed border-none">
            Your Trip
          </Button>
        ) : buddyStatus === "APPROVED" ? (
          <Button variant="outline" size="sm" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Joined
          </Button>
        ) : buddyStatus === "PENDING" ? (
          <Button disabled size="sm" className="bg-amber-50 text-amber-600 border-amber-100">
            <Timer className="w-3.5 h-3.5 mr-1" /> Pending
          </Button>
        ) : isTripOver ? (
          <Button disabled size="sm" className="bg-gray-100 text-gray-400">
            Ended
          </Button>
        ) : (
          <Button 
            onClick={handleJoinRequest} 
            disabled={isRequesting}
            size="sm" 
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-100"
          >
            {isRequesting ? "Sending..." : "Join Trip"}
          </Button>
        )}
      </div>
    </article>
  );
}