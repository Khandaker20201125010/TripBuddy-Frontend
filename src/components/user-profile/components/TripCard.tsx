/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { UserProfile } from "../helpers/types";
import { getImageSrc } from "@/helpers/getImageSrc ";

interface TripCardProps {
  plan: any;
  type: 'upcoming' | 'past';
  user?: UserProfile;
}

export const TripCard: React.FC<TripCardProps> = ({ plan, type, user }) => {
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
};