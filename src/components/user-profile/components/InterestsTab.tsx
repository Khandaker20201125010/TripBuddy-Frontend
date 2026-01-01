import { motion, AnimatePresence } from "framer-motion";
import { Heart, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { UserProfile } from "../helpers/types";

interface InterestsTabProps {
    profile: UserProfile;
    onEditClick: () => void;
}

export const InterestsTab: React.FC<InterestsTabProps> = ({ profile, onEditClick }) => {
    const safeInterests = profile?.interests || [];

    if (safeInterests.length === 0) {
        return (
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
                            <Button onClick={onEditClick} className={`
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
        );
    }

    return (
        <div className="space-y-8">
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
                    <Button onClick={onEditClick} className={`
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
        </div>
    );
};