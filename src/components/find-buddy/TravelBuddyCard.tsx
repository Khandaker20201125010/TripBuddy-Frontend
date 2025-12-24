/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, Calendar, User, DollarSign, CheckCircle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession, signIn } from "next-auth/react";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import Link from "next/link";

export function TravelBuddyCard({ plan }: { plan: any }) {
  const { data: session } = useSession();
  const [isRequesting, setIsRequesting] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const buddyStatus = useMemo(() => {
    if (localStatus) return localStatus;
    if (!plan || !session?.user) return null;
    return plan.buddies?.find((b: any) => b.userId === session.user.id)?.status || null;
  }, [plan, session, localStatus]);

  const isTripOver = new Date(plan.endDate) < new Date();
  const isHost = session?.user?.id === plan.userId;

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
      });
      if (result.isConfirmed) signIn();
      return;
    }

    setIsRequesting(true);
    try {
      await api.post(`/travelPlan/request/${plan.id}`);
      setLocalStatus("PENDING");
      Swal.fire("Request Sent", "The host has been notified!", "success");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <article className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{plan.destination}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 mr-1 text-orange-500" />
            <span className="truncate">Hosted by {plan.user?.name ?? "Traveler"}</span>
          </div>
        </div>
        <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
          {plan.travelType}
        </Badge>
      </div>

      <div className="bg-stone-50 rounded-xl p-3 mb-4 space-y-2">
        <div className="flex items-center text-xs text-gray-600">
          <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-600">
            <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
            {plan.travelType}
          </div>
          <div className="text-sm font-bold text-gray-900 flex items-center">
            <DollarSign className="w-3.5 h-3.5 text-green-600" />{plan.budget}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-5 grow italic">
        "{plan.description}"
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Link href={`/travel-plans/${plan.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full text-xs">Details</Button>
        </Link>

        {isHost ? (
          <Button disabled size="sm" className="bg-gray-50 text-gray-400 text-xs">Your Trip</Button>
        ) : buddyStatus === "APPROVED" ? (
          <Button disabled size="sm" className="bg-green-50 text-green-700 text-xs border-green-100">
            <CheckCircle className="w-3 h-3 mr-1" /> Joined
          </Button>
        ) : buddyStatus === "PENDING" ? (
          <Button disabled size="sm" className="bg-amber-50 text-amber-600 text-xs border-amber-100">
            <Timer className="w-3 h-3 mr-1" /> Pending
          </Button>
        ) : isTripOver ? (
          <Button disabled size="sm" className="text-xs">Ended</Button>
        ) : (
          <Button 
            onClick={handleJoinRequest} 
            disabled={isRequesting}
            variant="gradient"
            size="sm" 
            className=" text-white text-xs shadow-sm"
          >
            {isRequesting ? "Sending..." : "Request toJoin Trip"}
          </Button>
        )}
      </div>
    </article>
  );
}