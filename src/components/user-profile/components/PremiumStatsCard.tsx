import { motion } from "framer-motion";
import { Crown, Zap, Gem, Settings, SparklesIcon, ShieldCheck, } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { renderPremiumStats } from "../helpers/subscriptionUtils";
import { UserProfile } from "../helpers/types";

interface PremiumStatsCardProps {
  profile: UserProfile;
  onPremiumClick: () => void;
}

export const PremiumStatsCard: React.FC<PremiumStatsCardProps> = ({ profile, onPremiumClick }) => {
  if (!profile.premium) return null;

  return (
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onPremiumClick}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};