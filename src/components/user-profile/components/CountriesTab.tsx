import { motion, AnimatePresence } from "framer-motion";
import { Globe, Flag, MapPin, Target, Trophy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "./EmptyState";
import { UserProfile } from "../helpers/types";

interface CountriesTabProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export const CountriesTab: React.FC<CountriesTabProps> = ({ profile, onEditClick }) => {
  const safeCountries = profile?.visitedCountries || [];

  if (safeCountries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <EmptyState
          icon={<Globe className="w-16 h-16" />}
          title="No countries visited yet"
          description="Start your travel journey and add the countries you've visited!"
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
                <MapPin className="w-4 h-4 mr-2" />
                Add Countries
              </Button>
            </motion.div>
          }
        />
      </motion.div>
    );
  }

  const progressPercentage = Math.round((safeCountries.length / 195) * 100);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
            Travel Map
          </h3>
          <p className="text-gray-600">Your global footprint</p>
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
              : 'bg-linear-to-r from-emerald-600 to-teal-600'
            }
          `}>
            <Flag className="w-4 h-4 mr-2" />
            Add Countries
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {/* Country Grid */}
        <Card className={`
          border-white/20 backdrop-blur-sm shadow-xl
          ${profile.premium
            ? profile.subscriptionType === 'EXPLORER'
              ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
              : profile.subscriptionType === 'MONTHLY'
                ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
            : 'bg-linear-to-br from-white/50 to-emerald-50/30'
          }
        `}>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence>
                {safeCountries.map((country: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      variant="outline"
                      className={`
                        w-full px-4 py-3 text-sm shadow-sm backdrop-blur-sm
                        ${profile.premium
                          ? profile.subscriptionType === 'EXPLORER'
                            ? 'bg-white/80 border-blue-200 hover:bg-blue-50 text-blue-700'
                            : profile.subscriptionType === 'MONTHLY'
                              ? 'bg-white/80 border-purple-200 hover:bg-purple-50 text-purple-700'
                              : 'bg-white/80 border-orange-200 hover:bg-orange-50 text-orange-700'
                          : 'bg-white/80 border-emerald-200 hover:bg-emerald-50'
                        }
                      `}
                    >
                      <CheckCircle className={`
                        w-4 h-4 mr-2
                        ${profile.premium
                          ? profile.subscriptionType === 'EXPLORER' ? 'text-blue-500' :
                            profile.subscriptionType === 'MONTHLY' ? 'text-purple-500' :
                              'text-orange-500'
                          : 'text-emerald-500'
                        }
                      `} />
                      {country}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Progress Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`
              border-white/20 backdrop-blur-sm shadow-xl h-full
              ${profile.premium
                ? profile.subscriptionType === 'EXPLORER'
                  ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
                  : profile.subscriptionType === 'MONTHLY'
                    ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                    : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
                : 'bg-linear-to-br from-white/50 to-blue-50/30'
              }
            `}>
              <CardHeader>
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
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div>Travel Progress</div>
                    <CardDescription>
                      {safeCountries.length} out of 195 countries visited
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {progressPercentage.toFixed(1)}% complete
                    </span>
                    <span className="text-gray-500">
                      {195 - safeCountries.length} countries to go!
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className={`
                      h-1 bg-linear-to-r from-transparent to-transparent opacity-50
                      ${profile.premium
                        ? profile.subscriptionType === 'EXPLORER' ? 'via-blue-500' :
                          profile.subscriptionType === 'MONTHLY' ? 'via-purple-500' :
                            'via-orange-500'
                        : 'via-blue-500'
                      }
                    `}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className={`
              border-white/20 backdrop-blur-sm shadow-xl h-full
              ${profile.premium
                ? profile.subscriptionType === 'EXPLORER'
                  ? 'bg-linear-to-br from-blue-50/50 to-white/30 border-blue-200'
                  : profile.subscriptionType === 'MONTHLY'
                    ? 'bg-linear-to-br from-purple-50/50 to-white/30 border-purple-200'
                    : 'bg-linear-to-br from-orange-50/50 to-white/30 border-orange-200'
                : 'bg-linear-to-br from-white/50 to-purple-50/30'
              }
            `}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-xl shadow-lg
                    ${profile.premium
                      ? profile.subscriptionType === 'EXPLORER'
                        ? 'bg-linear-to-r from-blue-400 to-cyan-400'
                        : profile.subscriptionType === 'MONTHLY'
                          ? 'bg-linear-to-r from-purple-400 to-violet-400'
                          : 'bg-linear-to-r from-orange-400 to-amber-400'
                      : 'bg-linear-to-r from-purple-400 to-pink-400'
                    }
                  `}>
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div>Achievements</div>
                    <CardDescription>
                      Your travel milestones
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">World Explorer</span>
                    <span className="text-gray-500">{safeCountries.length}/195</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Continents Visited</span>
                    <span className="text-gray-500">{Math.min(7, Math.floor(safeCountries.length / 5))}/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Travel Streak</span>
                    <span className="text-gray-500">{profile?.travelPlans?.length || 0} trips</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};