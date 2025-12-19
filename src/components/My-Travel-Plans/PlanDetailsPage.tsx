
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TravelPlan } from "@/types/travel";
import { Calendar, User, Wallet, MapPin } from "lucide-react";
import { useMyTravelPlans } from "@/hooks/travelshooks/useMyTravelPlans";
import Image from "next/image";

export default function PlanDetailsPage() {
  const { id } = useParams();
  const { getSinglePlan, loading ,} = useMyTravelPlans();
 
  const [plan, setPlan] = useState<TravelPlan | null>(null);

  useEffect(() => {
    if (id) getSinglePlan(id as string).then(setPlan);
  }, [id]);

  if (loading || !plan) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Image
        width={400}
        height={300}
        src={plan.image || "/placeholder-travel.jpg"} 
        alt={plan.destination} 
        className="w-full h-96 object-cover rounded-2xl mb-6"
      />
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">{plan.destination}</h1>
          <div className="flex items-center text-gray-500 gap-4">
             <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(plan.startDate).toLocaleDateString()}</span>
             <span className="flex items-center"><User className="w-4 h-4 mr-1"/> Posted by {plan.user.name}</span>
          </div>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold text-xl">
          ${plan.budget}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">About this trip</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {plan.description || "No description provided for this amazing journey."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Travel Type</p>
          <p className="font-medium">{plan.travelType}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium capitalize">{plan.status}</p>
        </div>
      </div>
    </div>
  );
}