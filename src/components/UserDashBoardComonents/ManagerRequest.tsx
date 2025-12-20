/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Check, X,  MapPin,  } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

export default function ManageRequests() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHostPlans = async () => {
    try {
      // You may need a specific endpoint or use my-plans if it includes buddies
      const { data } = await api.get("/travelPlan/my-plans");
      setPlans(data.data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHostPlans(); }, []);

  const handleAction = async (buddyId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await api.patch(`/travelPlan/request-status/${buddyId}`, { status });
      Swal.fire("Success", `Request ${status.toLowerCase()}`, "success");
      fetchHostPlans(); // Refresh data
    } catch (err: any) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading requests...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trip Requests</h1>
      
      {plans.map((plan) => (
        <div key={plan.id} className="mb-8 bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
               <MapPin className="text-amber-500" />
               <span className="font-bold text-lg">{plan.destination}</span>
            </div>
            <span className="text-sm text-gray-500">{new Date(plan.startDate).toLocaleDateString()}</span>
          </div>

          <div className="p-4">
            {plan.buddies?.length > 0 ? (
              <div className="space-y-4">
                {plan.buddies.map((buddy: any) => (
                  <div key={buddy.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                        <Image fill src={buddy.user?.profileImage || "/placeholder-user.png"} alt="User" />
                      </div>
                      <div>
                        <p className="font-bold">{buddy.user?.name}</p>
                        <p className="text-xs text-gray-500">Requested {new Date(buddy.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {buddy.status === "PENDING" ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => handleAction(buddy.id, "APPROVED")}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleAction(buddy.id, "REJECTED")}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      ) : (
                        <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                          buddy.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {buddy.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-6">No join requests yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}