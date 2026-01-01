/* eslint-disable @typescript-eslint/no-explicit-any */
import { Zap, Crown, Gem, Shield, BadgeCheck, Award } from "lucide-react";

export interface UserProfile {
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
  subscriptionType?: SubscriptionType;
  subscriptionExpiresAt?: string;
}

export interface Connection {
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

export interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    profileImage?: string;
  };
  trip?: {
    destination: string;
  };
}

export type SubscriptionType = 'EXPLORER' | 'MONTHLY' | 'YEARLY';

export interface SubscriptionBadgeConfig {
  icon: React.ComponentType<any>;
  label: string;
  verifiedLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  linear: string;
  badgeIcon: React.ComponentType<any>;
  level: number;
}

export const SUBSCRIPTION_BADGES: Record<SubscriptionType, SubscriptionBadgeConfig> = {
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