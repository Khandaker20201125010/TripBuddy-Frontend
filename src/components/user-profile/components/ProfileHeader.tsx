/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Mail,
  Camera,
  Edit3,
  Crown,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  BadgeCheck,
  Award,
  Zap,
  Gem
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { renderSubscriptionBadge } from "../helpers/subscriptionUtils";
import { UserProfile } from "../helpers/types";
import { getImageSrc, getInitials } from "@/helpers/getImageSrc ";

interface ProfileHeaderProps {
  profile: UserProfile;
  session: any;
  onEditClick: () => void;
  onPremiumClick: () => void;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  session,
  onEditClick,
  onPremiumClick
}) => {
  return (
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
      <div className="absolute inset-0 bg-linear-to-br from-blue-400/5 via-transparent to-purple-400/5" />
      {profile.premium && profile.subscriptionType && (
        <div className={`absolute top-0 right-0 w-96 h-96 bg-linear-to-bl ${profile.subscriptionType === 'EXPLORER' ? 'from-blue-300/20 to-cyan-300/20' :
          profile.subscriptionType === 'MONTHLY' ? 'from-purple-300/20 to-violet-300/20' :
            'from-orange-300/20 to-amber-300/20'
          } rounded-full -translate-y-48 translate-x-48`} />
      )}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-linear-to-tr from-amber-300/10 to-pink-300/10 rounded-full" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8">
        {/* Avatar Section */}
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
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={session.user.image}
                  alt={profile.name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Image
                src={getImageSrc(profile.profileImage || "/images/userProfile.jpg")}
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

          {/* Online status */}
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
            onClick={onEditClick}
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
                  onClick={onEditClick}
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
                  <Button 
                    onClick={onPremiumClick} 
                    className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Go Premium
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};