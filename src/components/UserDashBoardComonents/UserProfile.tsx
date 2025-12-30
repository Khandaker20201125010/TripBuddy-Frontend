/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Star,
  Edit3,
  Globe,
  Mail,
  User as UserIcon,
  Map,
  Trophy,
  TrendingUp,
  CheckCircle,
  Clock,
  History,
  MessageSquare,
  Users,
  Settings,
  Camera,
  UserCheck,
  UserPlus,
  UserX,
  Trash2,
  MoreVertical,
  Sparkles,
  Plane,
  Compass,
  Heart,
  Target,
  Flag,
  UserRoundSearch,
  Zap,
  Crown,
  Gem,
  Award,
  BadgeCheck,
  ShieldCheck,
  Shield,
  Sparkles as SparklesIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Rating } from "@/components/ui/Rating";
import { EditProfileModal } from "@/components/ui/EditProfileModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getImageSrc } from "@/helpers/getImageSrc ";

// Subscription badge configuration
const SUBSCRIPTION_BADGES = {
  EXPLORER: {
    icon: Zap,
    label: 'Explorer',
    verifiedLabel: 'Verified Explorer',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    linear: 'from-blue-400 to-blue-500',
    badgeIcon: Shield,
    level: 1
  },
  MONTHLY: {
    icon: Crown,
    label: 'Adventurer',
    verifiedLabel: 'Verified Adventurer',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    linear: 'from-purple-500 to-purple-600',
    badgeIcon: BadgeCheck,
    level: 2
  },
  YEARLY: {
    icon: Gem,
    label: 'Globetrotter',
    verifiedLabel: 'Verified Globetrotter',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-500',
    linear: 'from-orange-500 to-amber-600',
    badgeIcon: Award,
    level: 3
  }
} as const;

// Types based on your Prisma Schema
interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  visitedCountries: string[];
  rating: number;
  createdAt: string;
  travelPlans: any[];
  reviewsReceived: any[];
  interests?: string[];
  location?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  premium?: boolean;
  subscriptionType?: keyof typeof SUBSCRIPTION_BADGES;
  subscriptionExpiresAt?: string;
}

interface Connection {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    profileImage?: string;
    email: string;
  };
  receiver?: {
    id: string;
    name: string;
    profileImage?: string;
    email: string;
  };
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};


// Helper function to render subscription badge
const renderSubscriptionBadge = (userData: any) => {
  if (!userData?.premium) return null;

  const subscriptionType = userData?.subscriptionType as keyof typeof SUBSCRIPTION_BADGES | undefined;
  const config = subscriptionType
    ? SUBSCRIPTION_BADGES[subscriptionType]
    : SUBSCRIPTION_BADGES.MONTHLY;

  const Icon = config.icon;
  const BadgeIcon = config.badgeIcon;

  return (
    <Badge
      className={`
        ${config.bgColor} 
        ${config.color} 
        ${config.borderColor}
        border-2 
        font-bold 
        px-3 py-1.5
        flex items-center gap-2
        shadow-sm
        rounded-full
      `}
    >
      <div className="relative">
        <Icon className={`h-4 w-4 ${config.iconColor}`} />
        <BadgeIcon className="absolute -top-1 -right-1 h-3 w-3 text-white fill-current" />
      </div>
      <span className="text-sm">{config.verifiedLabel}</span>
    </Badge>
  );
};

// Helper function to render premium stats indicator
const renderPremiumStats = (userData: any) => {
  if (!userData?.premium) return null;

  const subscriptionType = userData?.subscriptionType as keyof typeof SUBSCRIPTION_BADGES | undefined;
  const config = subscriptionType
    ? SUBSCRIPTION_BADGES[subscriptionType]
    : SUBSCRIPTION_BADGES.MONTHLY;

  return (
    <div className={`p-4 rounded-xl bg-linear-to-br ${config.linear} text-white shadow-lg`}>
      <div className="flex items-center gap-2 mb-2">
        <Crown className="h-4 w-4" />
        <span className="text-sm font-bold">Premium Benefits</span>
      </div>
      <ul className="text-xs space-y-1">
        {subscriptionType === 'EXPLORER' && (
          <>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified Explorer Badge</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Priority in Search Results</span>
            </li>
          </>
        )}
        {subscriptionType === 'MONTHLY' && (
          <>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified Adventurer Badge</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Unlimited Connection Requests</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Priority Support</span>
            </li>
          </>
        )}
        {subscriptionType === 'YEARLY' && (
          <>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified Globetrotter Badge</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Exclusive Badge & Features</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>24/7 Premium Support</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Partner Discounts</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLoadingConnections] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingConnectionId, setDeletingConnectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("trips");

  // Fetch Profile Data
  const fetchProfile = async () => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/user/${session.user.id}`);

      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
      } else {
        setError("Failed to load profile data");
      }
    } catch (error: any) {
      console.error("Failed to fetch profile", error);
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Connections Data
  const fetchConnections = async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingConnections(true);

      // Fetch accepted connections (buddies)
      const buddiesRes = await api.get('/connections/buddies');
      if (buddiesRes.data.success) {
        const buddies = buddiesRes.data.data.map((buddy: any) => {
          const isSender = buddy.sender.id === session.user.id;
          const otherUser = isSender ? buddy.receiver : buddy.sender;

          return {
            id: buddy.id,
            status: 'ACCEPTED',
            senderId: buddy.sender.id,
            receiverId: buddy.receiver.id,
            createdAt: buddy.createdAt,
            updatedAt: buddy.updatedAt,
            sender: buddy.sender,
            receiver: buddy.receiver,
            otherUser: otherUser,
            direction: isSender ? 'sent' : 'received'
          };
        });

        setConnections(buddies);
      }

      // Fetch incoming requests
      const requestsRes = await api.get('/connections/incoming');
      if (requestsRes.data.success) {
        setIncomingRequests(requestsRes.data.data.map((req: any) => ({
          ...req,
          status: 'PENDING',
          direction: 'received'
        })));
      }
    } catch (error: any) {
      console.error("Failed to fetch connections", error);
    } finally {
      setLoadingConnections(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchConnections();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please log in to view your profile");
    }
  }, [session, status]);

  const handleRespondToRequest = async (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`/connections/respond/${connectionId}`, { status });

      if (status === 'ACCEPTED') {
        const request = incomingRequests.find(req => req.id === connectionId);
        if (request) {
          setIncomingRequests(prev => prev.filter(req => req.id !== connectionId));

          const newConnection = {
            ...request,
            status: 'ACCEPTED' as const
          };
          setConnections(prev => [...prev, newConnection]);
        }
      } else if (status === 'REJECTED') {
        setIncomingRequests(prev => prev.filter(req => req.id !== connectionId));
      }

      setTimeout(() => {
        fetchConnections();
      }, 500);

    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update request");
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (!window.confirm("Are you sure you want to remove this connection?")) {
      return;
    }

    try {
      setDeletingConnectionId(connectionId);
      await api.delete(`/connections/${connectionId}`);

      setConnections(prev => prev.filter(conn => conn.id !== connectionId));

    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete connection");
    } finally {
      setDeletingConnectionId(null);
    }
  };

  // Safe default values
  const safePlans = profile?.travelPlans || [];
  const safeCountries = profile?.visitedCountries || [];
  const safeReviews = profile?.reviewsReceived || [];
  const safeInterests = profile?.interests || [];

  // Calculate stats
  const upcomingTrips = safePlans.filter((p: any) => new Date(p.endDate) > new Date());
  const pastTrips = safePlans.filter((p: any) => new Date(p.endDate) <= new Date());
  const averageRating = safeReviews.length > 0
    ? safeReviews.reduce((acc: number, review: any) => acc + review.rating, 0) / safeReviews.length
    : 0;

  // Loading state
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Error state
  if (error || !profile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Card className="max-w-md mx-auto border-red-100 bg-linear-to-br from-red-50 to-white shadow-xl">
              <CardContent className="pt-8 text-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 mx-auto bg-linear-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg"
                >
                  <UserIcon className="w-10 h-10 text-red-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-red-800 mb-3">Unable to load profile</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={fetchProfile}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 shadow-md"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`
            relative overflow-hidden rounded-3xl p-8 mb-8 shadow-2xl border border-white/50 backdrop-blur-sm
            ${profile.premium
              ? profile.subscriptionType === 'EXPLORER'
                ? 'bg-linear-to-br from-blue-50/80 via-white/50 to-indigo-100/30'
                : profile.subscriptionType === 'MONTHLY'
                  ? 'bg-linear-to-br from-purple-50/80 via-white/50 to-violet-100/30'
                  : 'bg-linear-to-br from-orange-50/80 via-white/50 to-amber-100/30'
              : 'bg-linear-to-br from-white via-blue-50/50 to-indigo-100/30'
            }
          `}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-400/5 via-transparent to-purple-400/5" />
          {profile.premium && profile.subscriptionType && (
            <div className={`absolute top-0 right-0 w-96 h-96 bg-linear-to-bl ${profile.subscriptionType === 'EXPLORER' ? 'from-blue-300/20 to-cyan-300/20' :
                profile.subscriptionType === 'MONTHLY' ? 'from-purple-300/20 to-violet-300/20' :
                  'from-orange-300/20 to-amber-300/20'
              } rounded-full -translate-y-48 translate-x-48`} />
          )}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-linear-to-tr from-amber-300/10 to-pink-300/10 rounded-full" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar with premium border */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="relative group"
            >
              <div className={`
                relative w-44 h-44 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden shrink-0
                ${profile.premium ? `
                  ${profile.subscriptionType === 'EXPLORER' ? 'ring-4 ring-blue-300 shadow-blue-200' : ''}
                  ${profile.subscriptionType === 'MONTHLY' ? 'ring-4 ring-purple-300 shadow-purple-200' : ''}
                  ${profile.subscriptionType === 'YEARLY' ? 'ring-4 ring-orange-300 shadow-orange-200' : ''}
                ` : ''}
              `}>
                {session?.user?.image ? (
                  // Use session image directly
                  <Image
                    src={session.user.image}
                    alt={profile.name}
                    fill
                    sizes="176px"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer" // Important for Google images
                  />
                ) : (
                  // Use Next.js Image for fallback
                  <Image
                    src={getImageSrc(profile.profileImage || "/placeholder-user.png")}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="176px"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Premium verification badge on avatar */}
              {profile.premium && profile.subscriptionType && (
                <div className={`
                  absolute -bottom-2 -right-2 
                  h-10 w-10 rounded-full 
                  flex items-center justify-center
                  border-4 border-white
                  shadow-lg
                  ${profile.subscriptionType === 'EXPLORER' ? 'bg-linear-to-r from-blue-500 to-cyan-500' : ''}
                  ${profile.subscriptionType === 'MONTHLY' ? 'bg-linear-to-r from-purple-500 to-violet-500' : ''}
                  ${profile.subscriptionType === 'YEARLY' ? 'bg-linear-to-r from-orange-500 to-amber-500' : ''}
                `}>
                  {profile.subscriptionType === 'EXPLORER' && <ShieldCheck className="h-5 w-5 text-white" />}
                  {profile.subscriptionType === 'MONTHLY' && <BadgeCheck className="h-5 w-5 text-white" />}
                  {profile.subscriptionType === 'YEARLY' && <Award className="h-5 w-5 text-white" />}
                </div>
              )}

              {/* Online status with pulse animation */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute bottom-6 right-6 w-7 h-7 bg-linear-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-2xl flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>

              {/* Camera icon on hover */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditOpen(true)}
                className="absolute inset-0 bg-linear-to-br from-black/70 to-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                <Camera className="w-10 h-10 text-white" />
              </motion.button>

            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                    {profile.name}
                  </h1>

                  {/* Premium Subscription Verified Badge */}
                  {renderSubscriptionBadge(profile)}

                  {/* High Rating Badge */}
                  {profile.rating > 4.5 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      <Badge className="bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white border-0 px-4 py-2 gap-2 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        Elite Traveler
                      </Badge>
                    </motion.div>
                  )}

                  {/* Status badge */}
                  {profile.status === 'ACTIVE' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      <Badge variant="outline" className="border-green-300 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 gap-2 shadow-sm">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </motion.div>
                        Active Now
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </span>

                  {profile.location && (
                    <span className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}

                  <span className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>

                  {/* Premium subscription details */}
                  {profile.premium && profile.subscriptionType && (
                    <span className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm
                      ${profile.subscriptionType === 'EXPLORER' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                      ${profile.subscriptionType === 'MONTHLY' ? 'bg-purple-50 text-purple-700 border border-purple-200' : ''}
                      ${profile.subscriptionType === 'YEARLY' ? 'bg-orange-50 text-orange-700 border border-orange-200' : ''}
                    `}>
                      {profile.subscriptionType === 'EXPLORER' && <Zap className="h-3 w-3" />}
                      {profile.subscriptionType === 'MONTHLY' && <Crown className="h-3 w-3" />}
                      {profile.subscriptionType === 'YEARLY' && <Gem className="h-3 w-3" />}
                      <span className="font-medium text-sm">
                        {profile.subscriptionType === 'EXPLORER' && 'Explorer Plan'}
                        {profile.subscriptionType === 'MONTHLY' && 'Adventurer Plan'}
                        {profile.subscriptionType === 'YEARLY' && 'Globetrotter Plan'}
                      </span>
                    </span>
                  )}
                </motion.div>

                <motion.p variants={fadeInUp} className="text-gray-700 text-lg leading-relaxed max-w-3xl bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
                  {profile.bio || "Passionate traveler exploring the world one destination at a time. Always looking for new adventures and connections!"}
                </motion.p>

                {/* Action buttons */}
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setIsEditOpen(true)}
                      className={`
                        shadow-lg hover:shadow-xl transition-all duration-300 group
                        ${profile.premium
                          ? profile.subscriptionType === 'EXPLORER'
                            ? 'bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                            : profile.subscriptionType === 'MONTHLY'
                              ? 'bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'
                              : 'bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                          : 'bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700'
                        }
                      `}
                    >
                      <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Edit Profile
                    </Button>
                  </motion.div>


                  {/* Premium upgrade button if not premium */}
                  {!profile.premium && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/pricing">
                        <Button className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                          <Crown className="w-4 h-4 mr-2" />
                          Go Premium
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <StatCard
            icon={<Plane className="w-7 h-7" />}
            label="Total Trips"
            value={safePlans.length.toString()}
            subtext={`${upcomingTrips.length} upcoming, ${pastTrips.length} past`}
            color="blue"
            index={0}
            premium={profile.premium}
            subscriptionType={profile.subscriptionType}
          />

          <StatCard
            icon={<Globe className="w-7 h-7" />}
            label="Countries"
            value={safeCountries.length.toString()}
            subtext="Visited"
            color="emerald"
            index={1}
            premium={profile.premium}
            subscriptionType={profile.subscriptionType}
          />

          <StatCard
            icon={<Star className="w-7 h-7" />}
            label="Rating"
            value={averageRating.toFixed(1)}
            subtext={`${safeReviews.length} reviews`}
            color="amber"
            index={2}
            premium={profile.premium}
            subscriptionType={profile.subscriptionType}
          />

          <StatCard
            icon={<TrendingUp className="w-7 h-7" />}
            label="Travel Score"
            value={calculateTravelScore(safeCountries.length, safePlans.length).toString()}
            subtext="Global rank"
            color="purple"
            index={3}
            premium={profile.premium}
            subscriptionType={profile.subscriptionType}
          />

          <StatCard
            icon={<UserCheck className="w-7 h-7" />}
            label="Connections"
            value={connections.length.toString()}
            subtext={`${incomingRequests.length} pending`}
            color="indigo"
            index={4}
            premium={profile.premium}
            subscriptionType={profile.subscriptionType}
          />
        </motion.div>

        {/* Premium Stats Card */}
        {profile.premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className={`
              border-2 shadow-xl overflow-hidden
              ${profile.subscriptionType === 'EXPLORER' ? 'border-blue-200 bg-linear-to-br from-blue-50/50 to-white' : ''}
              ${profile.subscriptionType === 'MONTHLY' ? 'border-purple-200 bg-linear-to-br from-purple-50/50 to-white' : ''}
              ${profile.subscriptionType === 'YEARLY' ? 'border-orange-200 bg-linear-to-br from-orange-50/50 to-white' : ''}
            `}>
              {/* Premium header linear */}
              {profile.premium && (
                <div className={`h-2 w-full bg-linear-to-r ${profile.subscriptionType === 'EXPLORER' ? 'from-blue-400 to-blue-500' :
                    profile.subscriptionType === 'MONTHLY' ? 'from-purple-500 to-purple-600' :
                      'from-orange-500 to-amber-600'
                  }`} />
              )}
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left side: Premium benefits */}
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <Crown className="h-6 w-6" />
                      Premium Member Benefits
                    </h3>
                    {renderPremiumStats(profile)}

                    {/* Additional premium features */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                        <SparklesIcon className={`
                          h-5 w-5
                          ${profile.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                            profile.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                              'text-orange-500'
                          }
                        `} />
                        <div>
                          <p className="font-medium text-sm">Premium Badge</p>
                          <p className="text-xs text-stone-500">Visible on profile</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                        <ShieldCheck className={`
                          h-5 w-5
                          ${profile.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                            profile.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                              'text-orange-500'
                          }
                        `} />
                        <div>
                          <p className="font-medium text-sm">Verified Status</p>
                          <p className="text-xs text-stone-500">Increased trust</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                        <Zap className={`
                          h-5 w-5
                          ${profile.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                            profile.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                              'text-orange-500'
                          }
                        `} />
                        <div>
                          <p className="font-medium text-sm">Priority Access</p>
                          <p className="text-xs text-stone-500">Faster connections</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                        <Gem className={`
                          h-5 w-5
                          ${profile.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                            profile.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                              'text-orange-500'
                          }
                        `} />
                        <div>
                          <p className="font-medium text-sm">Exclusive Features</p>
                          <p className="text-xs text-stone-500">Advanced tools</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Subscription info */}
                  <div className="space-y-6">
                    <div className={`p-6 rounded-xl text-white shadow-lg ${profile.subscriptionType === 'EXPLORER' ? 'bg-linear-to-br from-blue-500 to-cyan-500' :
                        profile.subscriptionType === 'MONTHLY' ? 'bg-linear-to-br from-purple-500 to-violet-500' :
                          'bg-linear-to-br from-orange-500 to-amber-500'
                      }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold">Current Plan</h4>
                        {profile.subscriptionType === 'EXPLORER' && <Zap className="h-6 w-6" />}
                        {profile.subscriptionType === 'MONTHLY' && <Crown className="h-6 w-6" />}
                        {profile.subscriptionType === 'YEARLY' && <Gem className="h-6 w-6" />}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-3xl font-bold">
                            {profile.subscriptionType === 'EXPLORER' && 'Explorer'}
                            {profile.subscriptionType === 'MONTHLY' && 'Adventurer'}
                            {profile.subscriptionType === 'YEARLY' && 'Globetrotter'}
                          </p>
                          <p className="text-sm opacity-90">Premium Plan</p>
                        </div>
                        {profile.subscriptionExpiresAt && (
                          <div className="pt-4 border-t border-white/30">
                            <p className="text-sm">Renews on</p>
                            <p className="font-semibold">
                              {new Date(profile.subscriptionExpiresAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <Link href="/pricing">
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Subscription
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="trips" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TabsList className="w-full bg-white/50 backdrop-blur-sm p-1 border border-white/20 rounded-2xl shadow-lg h-auto">
              {[
                { value: "trips", icon: <Compass className="w-4 h-4" />, label: "Trips" },
                { value: "connections", icon: <UserCheck className="w-4 h-4" />, label: "Connections" },
                { value: "reviews", icon: <MessageSquare className="w-4 h-4" />, label: "Reviews" },
                { value: "interests", icon: <Heart className="w-4 h-4" />, label: "Interests" },
                { value: "countries", icon: <Map className="w-4 h-4" />, label: "Countries" },
              ].map((tab, index) => (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <TabsTrigger
                    value={tab.value}
                    className={`
                      flex-1 py-3 rounded-xl data-[state=active]:border-b-2 data-[state=active]:shadow-lg transition-all duration-300
                      ${profile.premium
                        ? profile.subscriptionType === 'EXPLORER'
                          ? 'data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white'
                          : profile.subscriptionType === 'MONTHLY'
                            ? 'data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white'
                            : 'data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white'
                        : 'data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white'
                      }
                    `}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {/* Premium indicator on tabs */}
                    {profile.premium && (
                      <span className={`
                        ml-2 text-xs px-1.5 py-0.5 rounded
                        ${profile.subscriptionType === 'EXPLORER' ? 'bg-blue-100 text-blue-700' : ''}
                        ${profile.subscriptionType === 'MONTHLY' ? 'bg-purple-100 text-purple-700' : ''}
                        ${profile.subscriptionType === 'YEARLY' ? 'bg-orange-100 text-orange-700' : ''}
                      `}>
                        {tab.value === "trips" && safePlans.length}
                        {tab.value === "connections" && connections.length}
                        {tab.value === "reviews" && safeReviews.length}
                        {tab.value === "interests" && safeInterests.length}
                        {tab.value === "countries" && safeCountries.length}
                      </span>
                    )}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Trips Tab */}
              <TabsContent value="trips" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                      My Travels
                    </h3>
                    <p className="text-gray-600">Explore your travel journey</p>
                  </div>
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge variant="outline" className="gap-2 bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-300 shadow-sm">
                        <Clock className="w-3 h-3" />
                        Upcoming: {upcomingTrips.length}
                      </Badge>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge variant="outline" className="gap-2 bg-linear-to-r from-gray-50 to-blue-50 text-gray-700 border-gray-300 shadow-sm">
                        <History className="w-3 h-3" />
                        Past: {pastTrips.length}
                      </Badge>
                    </motion.div>
                    {profile.premium && (
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge className={`
                          gap-2 shadow-sm
                          ${profile.subscriptionType === 'EXPLORER' ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white' : ''}
                          ${profile.subscriptionType === 'MONTHLY' ? 'bg-linear-to-r from-purple-500 to-violet-500 text-white' : ''}
                          ${profile.subscriptionType === 'YEARLY' ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white' : ''}
                        `}>
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {safePlans.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <EmptyState
                      icon={<Compass className="w-16 h-16" />}
                      title="No trips yet"
                      description="Start your adventure by creating your first travel plan!"
                      action={
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link href={"/my-travel-plans"}>
                            <Button className={`
                              mt-6 shadow-lg
                              ${profile.premium
                                ? profile.subscriptionType === 'EXPLORER'
                                  ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                                  : profile.subscriptionType === 'MONTHLY'
                                    ? 'bg-linear-to-r from-purple-600 to-violet-600'
                                    : 'bg-linear-to-r from-orange-600 to-amber-600'
                                : 'bg-linear-to-r from-blue-600 to-indigo-600'
                              }
                            `}>
                              <MapPin className="w-4 h-4 mr-2" />
                              Create First Trip
                            </Button>
                          </Link>
                        </motion.div>
                      }
                    />
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Trips */}
                    {upcomingTrips.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className={`
                          border-white/20 backdrop-blur-sm shadow-xl h-full
                          ${profile.premium
                            ? profile.subscriptionType === 'EXPLORER'
                              ? 'bg-linear-to-br from-blue-50/50 to-indigo-50/30 border-blue-200'
                              : profile.subscriptionType === 'MONTHLY'
                                ? 'bg-linear-to-br from-purple-50/50 to-violet-50/30 border-purple-200'
                                : 'bg-linear-to-br from-orange-50/50 to-amber-50/30 border-orange-200'
                            : 'bg-linear-to-br from-blue-50/50 to-indigo-50/30'
                          }
                        `}>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3">
                              <div className={`
                                p-2 rounded-xl shadow-lg
                                ${profile.premium
                                  ? profile.subscriptionType === 'EXPLORER'
                                    ? 'bg-linear-to-r from-blue-400 to-cyan-400'
                                    : profile.subscriptionType === 'MONTHLY'
                                      ? 'bg-linear-to-r from-purple-400 to-violet-400'
                                      : 'bg-linear-to-r from-orange-400 to-amber-400'
                                  : 'bg-linear-to-r from-blue-400 to-indigo-400'
                                }
                              `}>
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div>Upcoming Trips</div>
                                <CardDescription>
                                  {upcomingTrips.length} planned adventures
                                </CardDescription>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <AnimatePresence>
                                {upcomingTrips.slice(0, 3).map((plan: any, index: number) => (
                                  <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <TripCard key={plan.id} plan={plan} type="upcoming" user={profile} />
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              {upcomingTrips.length > 3 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <Button variant="ghost" className="w-full mt-4">
                                    View All {upcomingTrips.length} Trips
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Past Trips */}
                    {pastTrips.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card className="border-white/20 bg-linear-to-br from-gray-50/50 to-blue-50/30 backdrop-blur-sm shadow-xl h-full">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3">
                              <div className="p-2 bg-linear-to-r from-gray-400 to-blue-400 rounded-xl shadow-lg">
                                <History className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div>Travel History</div>
                                <CardDescription>
                                  {pastTrips.length} completed journeys
                                </CardDescription>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <AnimatePresence>
                                {pastTrips.slice(0, 3).map((plan: any, index: number) => (
                                  <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <TripCard key={plan.id} plan={plan} type="past" user={profile} />
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              {pastTrips.length > 3 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <Link href="/dashboard/my-travel-plans">
                                    <Button variant="ghost" className="w-full mt-4">
                                      View All {pastTrips.length} Trips
                                    </Button>
                                  </Link>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Connections Tab */}
              <TabsContent value="connections" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                      My Connections
                    </h3>
                    <p className="text-gray-600">Build your travel network</p>
                  </div>
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge variant="outline" className="gap-2 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm">
                        <UserCheck className="w-3 h-3" />
                        Connected: {connections.length}
                      </Badge>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge variant="outline" className="gap-2 bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300 shadow-sm">
                        <UserPlus className="w-3 h-3" />
                        Pending: {incomingRequests.length}
                      </Badge>
                    </motion.div>
                    {profile.premium && (
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge className={`
                          gap-2 shadow-sm
                          ${profile.subscriptionType === 'EXPLORER' ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white' : ''}
                          ${profile.subscriptionType === 'MONTHLY' ? 'bg-linear-to-r from-purple-500 to-violet-500 text-white' : ''}
                          ${profile.subscriptionType === 'YEARLY' ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white' : ''}
                        `}>
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Pending Requests */}
                {incomingRequests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-white/20 bg-linear-to-br from-amber-50/50 to-orange-50/30 backdrop-blur-sm shadow-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 bg-linear-to-r from-amber-400 to-orange-400 rounded-xl shadow-lg">
                            <UserPlus className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div>Connection Requests ({incomingRequests.length})</div>
                            <CardDescription>
                              Review and respond to incoming connection requests
                            </CardDescription>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <AnimatePresence>
                            {incomingRequests.map((request, index) => (
                              <motion.div
                                key={request.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <ConnectionRequestCard
                                  request={request}
                                  onRespond={handleRespondToRequest}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Connected Users */}
                {connections.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <EmptyState
                      icon={<UserCheck className="w-16 h-16" />}
                      title="No connections yet"
                      description="Start connecting with other travelers to build your travel network!"
                      action={
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link href={"/explore-travelers"}>
                            <Button className={`
                              mt-6 shadow-lg
                              ${profile.premium
                                ? profile.subscriptionType === 'EXPLORER'
                                  ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                                  : profile.subscriptionType === 'MONTHLY'
                                    ? 'bg-linear-to-r from-purple-600 to-violet-600'
                                    : 'bg-linear-to-r from-orange-600 to-amber-600'
                                : 'bg-linear-to-r from-blue-600 to-indigo-600'
                              }
                            `}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Find Travelers
                            </Button>
                          </Link>
                        </motion.div>
                      }
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <Card className="border-white/20 bg-linear-to-br from-white/50 to-blue-50/30 backdrop-blur-sm shadow-xl">
                      <CardHeader>
                        <CardTitle>Travel Buddies ({connections.length})</CardTitle>
                        <CardDescription>
                          Travelers you're connected with
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <AnimatePresence>
                            {connections.map((connection, index) => (
                              <motion.div
                                key={connection.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                              >
                                <ConnectionCard
                                  connection={connection}
                                  currentUserId={session?.user?.id}
                                  onDelete={() => handleDeleteConnection(connection.id)}
                                  isDeleting={deletingConnectionId === connection.id}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                      Reviews & Ratings
                    </h3>
                    <p className="text-gray-600">Feedback from fellow travelers</p>
                  </div>
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-5xl font-bold bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
                    >
                      {averageRating.toFixed(1)}
                    </motion.div>
                    <Rating rating={averageRating} size={20} />
                    <div className="text-sm text-gray-500">{safeReviews.length} reviews</div>
                  </div>
                </motion.div>

                {safeReviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <EmptyState
                      icon={<MessageSquare className="w-16 h-16" />}
                      title="No reviews yet"
                      description="Be active in the community to receive reviews from other travelers!"
                    />
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {safeReviews.map((review: any, index: number) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <ReviewCard key={review.id} review={review} user={profile} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              {/* Interests Tab */}
              <TabsContent value="interests" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                      Travel Interests
                    </h3>
                    <p className="text-gray-600">What kind of traveler are you?</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => setIsEditOpen(true)} className={`
                      shadow-lg
                      ${profile.premium
                        ? profile.subscriptionType === 'EXPLORER'
                          ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                          : profile.subscriptionType === 'MONTHLY'
                            ? 'bg-linear-to-r from-purple-600 to-violet-600'
                            : 'bg-linear-to-r from-orange-600 to-amber-600'
                        : 'bg-linear-to-r from-blue-600 to-indigo-600'
                      }
                    `}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Interests
                    </Button>
                  </motion.div>
                </motion.div>

                {safeInterests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <EmptyState
                      icon={<Heart className="w-16 h-16" />}
                      title="Add your interests"
                      description="Let others know what kind of travel experiences you enjoy!"
                      action={
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={() => setIsEditOpen(true)} className={`
                            mt-6
                            ${profile.premium
                              ? profile.subscriptionType === 'EXPLORER'
                                ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                                : profile.subscriptionType === 'MONTHLY'
                                  ? 'bg-linear-to-r from-purple-600 to-violet-600'
                                  : 'bg-linear-to-r from-orange-600 to-amber-600'
                              : 'bg-linear-to-r from-blue-600 to-indigo-600'
                            }
                          `}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Add Interests
                          </Button>
                        </motion.div>
                      }
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className={`
                      border-white/20 backdrop-blur-sm shadow-xl
                      ${profile.premium
                        ? profile.subscriptionType === 'EXPLORER'
                          ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
                          : profile.subscriptionType === 'MONTHLY'
                            ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                            : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
                        : 'bg-linear-to-br from-white/50 to-pink-50/30'
                      }
                    `}>
                      <CardContent className="p-8">
                        <div className="flex flex-wrap gap-4 justify-center">
                          <AnimatePresence>
                            {safeInterests.map((interest: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 200, delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className={`
                                    px-6 py-3 text-base shadow-lg
                                    ${profile.premium
                                      ? profile.subscriptionType === 'EXPLORER'
                                        ? 'bg-linear-to-r from-blue-100 via-cyan-100 to-blue-100 text-blue-700 border-blue-200'
                                        : profile.subscriptionType === 'MONTHLY'
                                          ? 'bg-linear-to-r from-purple-100 via-violet-100 to-purple-100 text-purple-700 border-purple-200'
                                          : 'bg-linear-to-r from-orange-100 via-amber-100 to-orange-100 text-orange-700 border-orange-200'
                                      : 'bg-linear-to-r from-pink-100 via-rose-100 to-red-100 text-pink-700 border-pink-200'
                                    }
                                  `}
                                >
                                  <Heart className="w-4 h-4 mr-2" />
                                  {interest}
                                </Badge>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interest Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                    >
                      <Card className={`
                        border-white/20 backdrop-blur-sm
                        ${profile.premium
                          ? profile.subscriptionType === 'EXPLORER'
                            ? 'bg-linear-to-br from-blue-50/50 to-indigo-50/30 border-blue-200'
                            : profile.subscriptionType === 'MONTHLY'
                              ? 'bg-linear-to-br from-purple-50/50 to-violet-50/30 border-purple-200'
                              : 'bg-linear-to-br from-orange-50/50 to-amber-50/30 border-orange-200'
                          : 'border-white/20 bg-linear-to-br from-blue-50/50 to-indigo-50/30'
                        }
                      `}>
                        <CardContent className="p-6 text-center">
                          <div className={`
                            text-3xl font-bold
                            ${profile.premium
                              ? profile.subscriptionType === 'EXPLORER' ? 'text-blue-600' :
                                profile.subscriptionType === 'MONTHLY' ? 'text-purple-600' :
                                  'text-orange-600'
                              : 'text-blue-600'
                            }
                          `}>
                            {safeInterests.length}
                          </div>
                          <div className="text-sm text-gray-600">Total Interests</div>
                        </CardContent>
                      </Card>
                      <Card className="border-white/20 bg-linear-to-br from-green-50/50 to-emerald-50/30 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {Math.round((safeInterests.length / 20) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Profile Completion</div>
                        </CardContent>
                      </Card>
                      <Card className="border-white/20 bg-linear-to-br from-purple-50/50 to-pink-50/30 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {Math.min(5, Math.floor(safeInterests.length / 3))}
                          </div>
                          <div className="text-sm text-gray-600">Match Potential</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </TabsContent>

              {/* Countries Tab */}
              <TabsContent value="countries" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                      Travel Map
                    </h3>
                    <p className="text-gray-600">Your global footprint</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => setIsEditOpen(true)} className={`
                      shadow-lg
                      ${profile.premium
                        ? profile.subscriptionType === 'EXPLORER'
                          ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                          : profile.subscriptionType === 'MONTHLY'
                            ? 'bg-linear-to-r from-purple-600 to-violet-600'
                            : 'bg-linear-to-r from-orange-600 to-amber-600'
                        : 'bg-linear-to-r from-emerald-600 to-teal-600'
                      }
                    `}>
                      <Flag className="w-4 h-4 mr-2" />
                      Add Countries
                    </Button>
                  </motion.div>
                </motion.div>

                {safeCountries.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <EmptyState
                      icon={<Globe className="w-16 h-16" />}
                      title="No countries visited yet"
                      description="Start your travel journey and add the countries you've visited!"
                      action={
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={() => setIsEditOpen(true)} className={`
                            mt-6
                            ${profile.premium
                              ? profile.subscriptionType === 'EXPLORER'
                                ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                                : profile.subscriptionType === 'MONTHLY'
                                  ? 'bg-linear-to-r from-purple-600 to-violet-600'
                                  : 'bg-linear-to-r from-orange-600 to-amber-600'
                              : 'bg-linear-to-r from-blue-600 to-indigo-600'
                            }
                          `}>
                            <MapPin className="w-4 h-4 mr-2" />
                            Add Countries
                          </Button>
                        </motion.div>
                      }
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                  >
                    {/* Country Grid */}
                    <Card className={`
                      border-white/20 backdrop-blur-sm shadow-xl
                      ${profile.premium
                        ? profile.subscriptionType === 'EXPLORER'
                          ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
                          : profile.subscriptionType === 'MONTHLY'
                            ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                            : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
                        : 'bg-linear-to-br from-white/50 to-emerald-50/30'
                      }
                    `}>
                      <CardContent className="p-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <AnimatePresence>
                            {safeCountries.map((country: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge
                                  variant="outline"
                                  className={`
                                    w-full px-4 py-3 text-sm shadow-sm backdrop-blur-sm
                                    ${profile.premium
                                      ? profile.subscriptionType === 'EXPLORER'
                                        ? 'bg-white/80 border-blue-200 hover:bg-blue-50 text-blue-700'
                                        : profile.subscriptionType === 'MONTHLY'
                                          ? 'bg-white/80 border-purple-200 hover:bg-purple-50 text-purple-700'
                                          : 'bg-white/80 border-orange-200 hover:bg-orange-50 text-orange-700'
                                      : 'bg-white/80 border-emerald-200 hover:bg-emerald-50'
                                    }
                                  `}
                                >
                                  <CheckCircle className={`
                                    w-4 h-4 mr-2
                                    ${profile.premium
                                      ? profile.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                                        profile.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                                          'text-orange-500'
                                      : 'text-emerald-500'
                                    }
                                  `} />
                                  {country}
                                </Badge>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Progress Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card className={`
                          border-white/20 backdrop-blur-sm shadow-xl h-full
                          ${profile.premium
                            ? profile.subscriptionType === 'EXPLORER'
                              ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
                              : profile.subscriptionType === 'MONTHLY'
                                ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                                : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
                            : 'bg-linear-to-br from-white/50 to-blue-50/30'
                          }
                        `}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <div className={`
                                p-2 rounded-xl shadow-lg
                                ${profile.premium
                                  ? profile.subscriptionType === 'EXPLORER'
                                    ? 'bg-linear-to-r from-blue-400 to-cyan-400'
                                    : profile.subscriptionType === 'MONTHLY'
                                      ? 'bg-linear-to-r from-purple-400 to-violet-400'
                                      : 'bg-linear-to-r from-orange-400 to-amber-400'
                                  : 'bg-linear-to-r from-blue-400 to-indigo-400'
                                }
                              `}>
                                <Target className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div>Travel Progress</div>
                                <CardDescription>
                                  {safeCountries.length} out of 195 countries visited
                                </CardDescription>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <Progress value={(safeCountries.length / 195) * 100} className="h-3" />
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {((safeCountries.length / 195) * 100).toFixed(1)}% complete
                                </span>
                                <span className="text-gray-500">
                                  {195 - safeCountries.length} countries to go!
                                </span>
                              </div>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className={`
                                  h-1 bg-linear-to-r from-transparent to-transparent opacity-50
                                  ${profile.premium
                                    ? profile.subscriptionType === 'EXPLORER' ? 'via-blue-500' :
                                      profile.subscriptionType === 'MONTHLY' ? 'via-purple-500' :
                                        'via-orange-500'
                                    : 'via-blue-500'
                                  }
                                `}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Card className={`
                          border-white/20 backdrop-blur-sm shadow-xl h-full
                          ${profile.premium
                            ? profile.subscriptionType === 'EXPLORER'
                              ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
                              : profile.subscriptionType === 'MONTHLY'
                                ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                                : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
                            : 'bg-linear-to-br from-white/50 to-purple-50/30'
                          }
                        `}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <div className={`
                                p-2 rounded-xl shadow-lg
                                ${profile.premium
                                  ? profile.subscriptionType === 'EXPLORER'
                                    ? 'bg-linear-to-r from-blue-400 to-cyan-400'
                                    : profile.subscriptionType === 'MONTHLY'
                                      ? 'bg-linear-to-r from-purple-400 to-violet-400'
                                      : 'bg-linear-to-r from-orange-400 to-amber-400'
                                  : 'bg-linear-to-r from-purple-400 to-pink-400'
                                }
                              `}>
                                <Trophy className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div>Achievements</div>
                                <CardDescription>
                                  Your travel milestones
                                </CardDescription>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">World Explorer</span>
                                <span className="text-gray-500">{safeCountries.length}/195</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">Continents Visited</span>
                                <span className="text-gray-500">{Math.min(7, Math.floor(safeCountries.length / 5))}/7</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">Travel Streak</span>
                                <span className="text-gray-500">{safePlans.length} trips</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={profile}
        onSuccess={fetchProfile}
      />
    </motion.div>
  );
}

// Helper function
function calculateTravelScore(countries: number, trips: number): number {
  return Math.min(100, Math.round(countries * 10 + trips * 5));
}

// Updated TripCard Component with premium support
function TripCard({ plan, type, user }: { plan: any; type: 'upcoming' | 'past'; user?: UserProfile }) {
  const isUpcoming = type === 'upcoming';

  return (
    <motion.div whileHover={{ x: 5 }} className="group">
      <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <Image
            src={getImageSrc(plan.image)}
            alt={plan.destination}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="80px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          {/* Premium badge on trip card */}
          {user?.premium && (
            <div className="absolute top-2 left-2">
              <Badge className={`
                text-xs border-0 shadow-sm
                ${user.subscriptionType === 'EXPLORER' ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white' : ''}
                ${user.subscriptionType === 'MONTHLY' ? 'bg-linear-to-r from-purple-500 to-violet-500 text-white' : ''}
                ${user.subscriptionType === 'YEARLY' ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white' : ''}
              `}>
                Premium
              </Badge>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-900 truncate">{plan.destination}</h4>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={isUpcoming ? "default" : "outline"}
              className={isUpcoming
                ? user?.premium
                  ? user.subscriptionType === 'EXPLORER'
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white border-0"
                    : user.subscriptionType === 'MONTHLY'
                      ? "bg-linear-to-r from-purple-500 to-violet-500 text-white border-0"
                      : "bg-linear-to-r from-orange-500 to-amber-500 text-white border-0"
                  : "bg-linear-to-r from-blue-500 to-indigo-500 text-white border-0"
                : "border-gray-300"
              }
            >
              {isUpcoming ? "Upcoming" : "Completed"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="text-xs border-gray-300 bg-white/50">
              {plan.travelType}
            </Badge>
            <span className="text-sm text-gray-600 font-medium">${plan.budget?.toLocaleString() || '0'}</span>
            {plan.companions && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {plan.companions.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Updated ReviewCard Component with premium support
function ReviewCard({ review, user }: { review: any; user?: UserProfile }) {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className={`
        border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300
        ${user?.premium
          ? user.subscriptionType === 'EXPLORER'
            ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
            : user.subscriptionType === 'MONTHLY'
              ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
              : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
          : 'bg-linear-to-br from-white/50 to-amber-50/30'
        }
      `}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className={`
              w-14 h-14 border-3 border-white/80 shadow-lg
              ${user?.premium ?
                user.subscriptionType === 'EXPLORER' ? 'ring-2 ring-blue-300' :
                  user.subscriptionType === 'MONTHLY' ? 'ring-2 ring-purple-300' :
                    'ring-2 ring-orange-300'
                : ''
              }
            `}>
              <AvatarImage src={review.reviewer?.profileImage} alt={review.reviewer?.name} />
              <AvatarFallback className={`
                ${user?.premium
                  ? user.subscriptionType === 'EXPLORER' ? 'bg-linear-to-br from-blue-100 to-cyan-100 text-blue-700' :
                    user.subscriptionType === 'MONTHLY' ? 'bg-linear-to-br from-purple-100 to-violet-100 text-purple-700' :
                      'bg-linear-to-br from-orange-100 to-amber-100 text-orange-700'
                  : 'bg-linear-to-br from-amber-100 to-orange-100'
                }
              `}>
                {review.reviewer?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{review.reviewer?.name || "Traveler"}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Rating rating={review.rating} size={16} />
                  <span className="text-sm font-medium text-amber-600 ml-2">{review.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "{review.content}"
              </p>
              {review.trip && (
                <div className="mt-3 pt-3 border-t border-white/30">
                  <span className="text-sm text-gray-500">
                    Trip to {review.trip.destination}
                  </span>
                </div>
              )}
              {/* Premium badge on review */}
              {user?.premium && (
                <div className="mt-3">
                  <Badge className={`
                    text-xs
                    ${user.subscriptionType === 'EXPLORER' ? 'bg-blue-100 text-blue-700 border border-blue-200' : ''}
                    ${user.subscriptionType === 'MONTHLY' ? 'bg-purple-100 text-purple-700 border border-purple-200' : ''}
                    ${user.subscriptionType === 'YEARLY' ? 'bg-orange-100 text-orange-700 border border-orange-200' : ''}
                  `}>
                    Premium Review
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Updated Connection Card Component
function ConnectionCard({
  connection,
  currentUserId,
  onDelete,
  isDeleting
}: {
  connection: any,
  currentUserId?: string,
  onDelete: () => void,
  isDeleting: boolean
}) {
  const otherUser = connection.senderId === currentUserId ? connection.receiver : connection.sender;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="border-white/20 bg-linear-to-br from-white/60 to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
        <CardContent className="p-6 h-full">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ rotate: 5 }}>
              <Avatar className="w-16 h-16 border-3 border-white/80 shadow-lg">
                <AvatarImage src={otherUser?.profileImage} alt={otherUser?.name} />
                <AvatarFallback className="bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700">
                  {otherUser?.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 truncate">{otherUser?.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{otherUser?.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isDeleting}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-white/20 backdrop-blur-sm">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <MapPin className="w-4 h-4" />
                      View Trips
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-red-600 hover:text-red-700 focus:text-red-700"
                      onClick={onDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Remove Connection
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(connection.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Link href={`/PublicVisitProfile/${otherUser?.id}`}>
                <Button variant="outline" size="sm" className="cursor-pointer w-full border-gray-300 bg-white/50">
                  <UserRoundSearch className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Connection Request Card Component
function ConnectionRequestCard({ request, onRespond }: { request: any, onRespond: (id: string, status: 'ACCEPTED' | 'REJECTED') => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-5 rounded-2xl border border-white/30 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14 border-2 border-white/80 shadow-md">
          <AvatarImage src={request.sender?.profileImage} alt={request.sender?.name} />
          <AvatarFallback className="bg-linear-to-br from-amber-100 to-orange-100">
            {request.sender?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold text-gray-900">{request.sender?.name}</h4>
          <p className="text-sm text-gray-500">Sent {new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={() => onRespond(request.id, 'ACCEPTED')}
            className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
          >
            <UserCheck className="w-3 h-3 mr-2" />
            Accept
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRespond(request.id, 'REJECTED')}
            className="border-red-300 text-red-600 hover:bg-red-50 shadow-sm"
          >
            <UserX className="w-3 h-3 mr-2" />
            Decline
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Enhanced StatCard component with premium support
function StatCard({ icon, label, value, subtext, color = "blue", index, premium, subscriptionType }: any) {
  const colorClasses = {
    blue: "from-blue-400 to-indigo-500",
    emerald: "from-emerald-400 to-teal-500",
    amber: "from-amber-400 to-orange-500",
    purple: "from-purple-400 to-pink-500",
    indigo: "from-indigo-400 to-blue-500"
  };

  const bgClasses = {
    blue: "from-blue-50/50 to-indigo-50/30",
    emerald: "from-emerald-50/50 to-teal-50/30",
    amber: "from-amber-50/50 to-orange-50/30",
    purple: "from-purple-50/50 to-pink-50/30",
    indigo: "from-indigo-50/50 to-blue-50/30"
  };

  const colorKey = color as keyof typeof colorClasses;
  const bgKey = color as keyof typeof bgClasses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={cn(
        "border-white/20 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300",
        premium
          ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'border-blue-200 bg-linear-to-br from-blue-50/50 to-white/30' :
            subscriptionType === 'MONTHLY' && color === 'purple' ? 'border-purple-200 bg-linear-to-br from-purple-50/50 to-white/30' :
              subscriptionType === 'YEARLY' && color === 'amber' ? 'border-orange-200 bg-linear-to-br from-orange-50/50 to-white/30' :
                bgClasses[bgKey]
          : bgClasses[bgKey]
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className={cn(
                "p-3 rounded-2xl bg-opacity-10 backdrop-blur-sm",
                premium
                  ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'bg-linear-to-br from-blue-500 to-cyan-500' :
                    subscriptionType === 'MONTHLY' && color === 'purple' ? 'bg-linear-to-br from-purple-500 to-violet-500' :
                      subscriptionType === 'YEARLY' && color === 'amber' ? 'bg-linear-to-br from-orange-500 to-amber-500' :
                        `bg-linear-to-br ${colorClasses[colorKey]}`
                  : `bg-linear-to-br ${colorClasses[colorKey]}`
              )}
            >
              <div className={cn(
                "bg-clip-text text-transparent",
                premium
                  ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'text-linear bg-linear-to-br from-blue-600 to-cyan-600' :
                    subscriptionType === 'MONTHLY' && color === 'purple' ? 'text-linear bg-linear-to-br from-purple-600 to-violet-600' :
                      subscriptionType === 'YEARLY' && color === 'amber' ? 'text-linear bg-linear-to-br from-orange-600 to-amber-600' :
                        `text-linear bg-linear-to-br ${colorClasses[colorKey]}`
                  : `text-linear bg-linear-to-br ${colorClasses[colorKey]}`
              )}>
                {icon}
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              className="opacity-20"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </div>
          <div className="mt-6">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={cn(
                "text-4xl font-bold bg-clip-text text-transparent",
                premium
                  ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'bg-linear-to-br from-blue-600 to-cyan-600' :
                    subscriptionType === 'MONTHLY' && color === 'purple' ? 'bg-linear-to-br from-purple-600 to-violet-600' :
                      subscriptionType === 'YEARLY' && color === 'amber' ? 'bg-linear-to-br from-orange-600 to-amber-600' :
                        'bg-linear-to-br from-gray-900 to-gray-700'
                  : 'bg-linear-to-br from-gray-900 to-gray-700'
              )}
            >
              {value}
            </motion.div>
            <div className="text-sm font-semibold text-gray-700 mt-2">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{subtext}</div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "mt-4 h-1 w-full bg-linear-to-r from-transparent to-transparent opacity-20",
              premium
                ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'via-blue-500' :
                  subscriptionType === 'MONTHLY' && color === 'purple' ? 'via-purple-500' :
                    subscriptionType === 'YEARLY' && color === 'amber' ? 'via-orange-500' :
                      `via-${color}-500`
                : `via-${color}-500`
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced EmptyState component
function EmptyState({ icon, title, description, action }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card className="border-dashed border-white/40 bg-linear-to-br from-white/30 to-blue-50/20 backdrop-blur-sm shadow-xl">
        <CardContent className="py-16 text-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100/50 to-indigo-100/50 rounded-full flex items-center justify-center mb-8 shadow-inner"
          >
            <div className="text-linear bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {icon}
            </div>
          </motion.div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">{description}</p>
          {action && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {action}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced ProfileSkeleton component
function ProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Skeleton */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-100 to-gray-200/50 p-8 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <Skeleton className="w-44 h-44 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-12 w-64 bg-linear-to-r from-gray-300 to-gray-400" />
                <Skeleton className="h-6 w-48 bg-linear-to-r from-gray-300 to-gray-400" />
              </div>
              <Skeleton className="h-32 w-full rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-36 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
                <Skeleton className="h-12 w-28 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
            >
              <Skeleton className="h-40 rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
            </motion.div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-16 rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
          <Skeleton className="h-96 rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
        </div>
      </div>
    </motion.div>
  );
}