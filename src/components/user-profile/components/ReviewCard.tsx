/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "../helpers/types";

interface ReviewCardProps {
  review: any;
  user?: UserProfile;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, user }) => {
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
};