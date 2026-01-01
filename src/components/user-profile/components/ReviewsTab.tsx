/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ReviewCard } from "./ReviewCard";
import { Rating } from "@/components/ui/Rating";
import { calculateAverageRating } from "../helpers/profileCalculations";
import { UserProfile } from "../helpers/types";

interface ReviewsTabProps {
    profile: UserProfile;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ profile }) => {
    const safeReviews = profile?.reviewsReceived || [];
    const averageRating = calculateAverageRating(safeReviews);

    if (safeReviews.length === 0) {
        return (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {safeReviews.map((review: any, index: number) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <ReviewCard review={review} user={profile} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};