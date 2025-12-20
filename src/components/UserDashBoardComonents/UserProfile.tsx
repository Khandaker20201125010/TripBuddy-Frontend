/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { 
  MapPin, Calendar, Star, Edit3, Globe, 
  Mail, ShieldCheck, User as UserIcon 
} from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Rating } from "@/components/ui/Rating";
import { EditProfileModal } from "@/components/ui/EditProfileModal";

// Types based on your Prisma Schema
interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  visitedCountries: string[]; // Can be null/undefined from backend
  rating: number;
  createdAt: string;
  travelPlans: any[];         // Can be null/undefined from backend
  reviewsReceived: any[];     // Can be null/undefined from backend
}

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch Profile Data
  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await api.get(`/user/${session.user.id}`);
      setProfile(res.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Profile...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found.</div>;

  // --- 🛡️ SAFETY FIX: Default to empty array if null ---
  const safePlans = profile.travelPlans || []; 
  const safeCountries = profile.visitedCountries || [];
  const safeReviews = profile.reviewsReceived || [];
  
  const upcomingTrips = safePlans.filter((p: any) => new Date(p.endDate) > new Date());
  const pastTrips = safePlans.filter((p: any) => new Date(p.endDate) <= new Date());

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      
      {/* --- Header Section --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Fixed CSS class name: bg-linear-to-r -> bg-gradient-to-r */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 mt-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-gray-200">
              <Image 
                src={profile.profileImage || "/placeholder-user.png"} 
                alt={profile.name || "User"} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" title="Online"></div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              {(profile.rating || 0) > 4.5 && (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 gap-1">
                  <ShieldCheck size={14} /> Super Traveler
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
               <span className="flex items-center gap-1"><Mail size={14} /> {profile.email}</span>
               <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-gray-600 max-w-2xl leading-relaxed">
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>

          {/* Action Button */}
          <Button onClick={() => setIsEditOpen(true)} variant="outline" className="gap-2 shadow-sm">
            <Edit3 size={16} /> Edit Profile
          </Button>
        </div>

        {/* --- Quick Stats --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
          <StatBox label="Trips Hosted" value={safePlans.length} icon={<MapPin className="text-blue-500" />} />
          <StatBox label="Countries" value={safeCountries.length} icon={<Globe className="text-green-500" />} />
          <StatBox label="Reviews" value={safeReviews.length} icon={<Star className="text-amber-500" />} />
          {/* Safety check for rating as well */}
          <StatBox label="Rating" value={(profile.rating || 0).toFixed(1)} icon={<ShieldCheck className="text-purple-500" />} />
        </div>
      </div>

      {/* --- Visited Countries --- */}
      {safeCountries.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" /> My Travel Map
          </h3>
          <div className="flex flex-wrap gap-2">
            {safeCountries.map((country, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100">
                {country}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* --- Tabs Content (Trips & Reviews) --- */}
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="bg-white p-1 border border-gray-200 rounded-xl mb-6">
          <TabsTrigger value="plans" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Upcoming Plans ({upcomingTrips.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Travel History ({pastTrips.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Reviews ({safeReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map((plan: any) => (
                 <SimplePlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
             <EmptyState message="No upcoming adventures planned." />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
           {pastTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTrips.map((plan: any) => (
                 <SimplePlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
             <EmptyState message="No past trips found." />
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {safeReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeReviews.map((review: any) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
             <EmptyState message="No reviews received yet." />
          )}
        </TabsContent>
      </Tabs>

      {/* --- Edit Modal --- */}
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        user={profile} 
        onSuccess={fetchProfile}
      />
    </div>
  );
}

// --- Sub Components ---

const StatBox = ({ label, value, icon }: any) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100">
    <div className="mb-2 p-2 bg-white rounded-full shadow-sm">{icon}</div>
    <span className="text-2xl font-bold text-gray-900">{value}</span>
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
      <UserIcon className="text-gray-400" />
    </div>
    <p className="text-gray-500">{message}</p>
  </div>
);

const SimplePlanCard = ({ plan }: { plan: any }) => (
  <div className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
    <div className="h-40 bg-gray-200 relative">
      <Image src={plan.image || "/placeholder-travel.jpg"} alt={plan.destination} fill className="object-cover" />
      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold">
        ${plan.budget}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg mb-1">{plan.destination}</h3>
      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
        <Calendar size={14} /> {new Date(plan.startDate).toLocaleDateString()}
      </p>
      <div className="flex gap-2 text-xs">
        <Badge variant="outline">{plan.travelType}</Badge>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: any }) => (
  <div className="p-5 border rounded-2xl bg-white shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2">
         <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
            <Image src="/placeholder-user.png" alt="Reviewer" fill className="object-cover" />
         </div>
         <span className="font-semibold text-sm">Traveler</span>
       </div>
       <Rating rating={review.rating} size={14} />
    </div>
    <p className="text-gray-600 text-sm italic">"{review.content}"</p>
  </div>
);