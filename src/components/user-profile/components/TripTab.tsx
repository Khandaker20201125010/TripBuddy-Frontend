/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Clock, History, MapPin, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { TripCard } from "./TripCard";
import Link from "next/link";
import { getUpcomingTrips, getPastTrips } from "../helpers/profileCalculations";
import { UserProfile } from "../helpers/types";

interface TripTabProps {
    profile: UserProfile;
}

export const TripTab: React.FC<TripTabProps> = ({ profile }) => {
    const safePlans = profile?.travelPlans || [];
    const upcomingTrips = getUpcomingTrips(safePlans);
    const pastTrips = getPastTrips(safePlans);

    if (safePlans.length === 0) {
        return (
            <motion.div
                key="empty-trips"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
            >
                <EmptyState
                    icon={<MapPin className="w-16 h-16" />}
                    title="No trips yet"
                    description="Start your adventure by creating your first travel plan!"
                    action={
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/my-travel-plans">
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
        );
    }

    return (
        <motion.div
            key="trips-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
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

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* Upcoming Trips */}
                {upcomingTrips.length > 0 && (
                    <motion.div
                        key="upcoming-trips"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
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
                                    {upcomingTrips.slice(0, 3).map((plan: any, index: number) => (
                                        <motion.div
                                            key={`upcoming-${plan.id}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: 0.1 + (index * 0.1) }}
                                        >
                                            <TripCard plan={plan} type="upcoming" user={profile} />
                                        </motion.div>
                                    ))}
                                    {upcomingTrips.length > 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
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
                        key="past-trips"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
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
                                    {pastTrips.slice(0, 3).map((plan: any, index: number) => (
                                        <motion.div
                                            key={`past-${plan.id}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: 0.1 + (index * 0.1) }}
                                        >
                                            <TripCard plan={plan} type="past" user={profile} />
                                        </motion.div>
                                    ))}
                                    {pastTrips.length > 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
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
            </motion.div>
        </motion.div>
    );
};