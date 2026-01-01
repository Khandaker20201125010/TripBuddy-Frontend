import { SUBSCRIPTION_BADGES, SubscriptionType, UserProfile } from "./types";
import { ShieldCheck, BadgeCheck, Award, Crown, Zap, Gem, CheckCircle } from "lucide-react";

export const renderSubscriptionBadge = (userData: UserProfile | null) => {
  if (!userData?.premium) return null;

  const subscriptionType = userData.subscriptionType as SubscriptionType | undefined;
  const config = subscriptionType
    ? SUBSCRIPTION_BADGES[subscriptionType]
    : SUBSCRIPTION_BADGES.MONTHLY;

  const Icon = config.icon;
  const BadgeIcon = config.badgeIcon;

  return (
    <div
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
    </div>
  );
};

export const renderPremiumStats = (userData: UserProfile | null) => {
  if (!userData?.premium) return null;

  const subscriptionType = userData.subscriptionType as SubscriptionType | undefined;
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

export const getSubscriptionDetails = (userData: UserProfile | null) => {
  if (!userData?.premium) return null;
  
  const subscriptionType = userData.subscriptionType as SubscriptionType | undefined;
  const config = subscriptionType
    ? SUBSCRIPTION_BADGES[subscriptionType]
    : SUBSCRIPTION_BADGES.MONTHLY;

  return {
    name: config.label,
    icon: config.icon,
    color: config.color,
    bgColor: config.bgColor,
    linear: config.linear,
    verifiedLabel: config.verifiedLabel
  };
};