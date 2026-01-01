import { motion } from "framer-motion";
import { Plane, Globe, Star, TrendingUp, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { getProfileStats } from "../helpers/profileCalculations";
import { UserProfile } from "../helpers/types";
import { StatCard } from "./StatCard";

interface ProfileStatsProps {
  profile: UserProfile | null;
  connectionsCount: number;
  incomingRequestsCount: number;
}

type StatCardColor = "blue" | "emerald" | "amber" | "purple" | "indigo";

interface StatCardData {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: StatCardColor;
  index: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  profile,
  connectionsCount,
  incomingRequestsCount
}) => {
  if (!profile) return null;

  const stats = getProfileStats(profile);
  
  const statCards: StatCardData[] = [
    {
      icon: <Plane className="w-7 h-7" />,
      label: "Total Trips",
      value: stats.totalTrips.toString(),
      subtext: `${stats.upcomingTrips} upcoming, ${stats.pastTrips} past`,
      color: "blue",
      index: 0
    },
    {
      icon: <Globe className="w-7 h-7" />,
      label: "Countries",
      value: stats.countriesVisited.toString(),
      subtext: "Visited",
      color: "emerald",
      index: 1
    },
    {
      icon: <Star className="w-7 h-7" />,
      label: "Rating",
      value: stats.averageRating.toFixed(1),
      subtext: `${stats.totalReviews} reviews`,
      color: "amber",
      index: 2
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      label: "Travel Score",
      value: stats.travelScore.toString(),
      subtext: "Global rank",
      color: "purple",
      index: 3
    },
    {
      icon: <UserCheck className="w-7 h-7" />,
      label: "Connections",
      value: connectionsCount.toString(),
      subtext: `${incomingRequestsCount} pending`,
      color: "indigo",
      index: 4
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
    >
      {statCards.map((stat) => (
        <StatCard
          key={stat.label}
          {...stat}
          premium={profile.premium}
          subscriptionType={profile.subscriptionType}
        />
      ))}
    </motion.div>
  );
};

export const ProfileStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
  );
};