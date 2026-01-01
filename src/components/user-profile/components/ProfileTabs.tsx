/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import {
  Compass,
  UserCheck,
  MessageSquare,
  Heart,
  Map,
  
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripTab } from "./TripTab";
import { ConnectionsTab } from "./ConnectionsTab";
import { ReviewsTab } from "./ReviewsTab";
import { InterestsTab } from "./InterestsTab";
import { CountriesTab } from "./CountriesTab";
import { UserProfile, Connection } from "../helpers/types";

interface ProfileTabsProps {
  profile: UserProfile;
  connections: Connection[];
  incomingRequests: Connection[];
  session: any;
  activeTab: string;
  onTabChange: (value: string) => void;
  onEditClick: () => void;
  onRespondToRequest: (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  onDeleteConnection: (connectionId: string) => Promise<void>;
}

const tabs = [
  { value: "trips", icon: <Compass className="w-4 h-4" />, label: "Trips" },
  { value: "connections", icon: <UserCheck className="w-4 h-4" />, label: "Connections" },
  { value: "reviews", icon: <MessageSquare className="w-4 h-4" />, label: "Reviews" },
  { value: "interests", icon: <Heart className="w-4 h-4" />, label: "Interests" },
  { value: "countries", icon: <Map className="w-4 h-4" />, label: "Countries" },
];

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  connections,
  incomingRequests,
  session,
  activeTab,
  onTabChange,
  onEditClick,
  onRespondToRequest,
  onDeleteConnection
}) => {
  const tabCounts = {
    trips: profile?.travelPlans?.length || 0,
    connections: connections.length,
    reviews: profile?.reviewsReceived?.length || 0,
    interests: profile?.interests?.length || 0,
    countries: profile?.visitedCountries?.length || 0,
  };

  return (
    <Tabs defaultValue="trips" value={activeTab} onValueChange={onTabChange} className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TabsList className="w-full bg-white/50 backdrop-blur-sm p-1 border border-white/20 rounded-2xl shadow-lg h-auto">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <TabsTrigger
                value={tab.value}
                className={`
                  flex-1 py-3 rounded-xl data-[state=active]:border-b-2 data-[state=active]:shadow-lg transition-all duration-300
                  ${profile.premium
                    ? profile.subscriptionType === 'EXPLORER'
                      ? 'data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white'
                      : profile.subscriptionType === 'MONTHLY'
                        ? 'data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white'
                        : 'data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white'
                    : 'data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {/* Premium indicator on tabs */}
                {profile.premium && (
                  <span className={`
                    ml-2 text-xs px-1.5 py-0.5 rounded
                    ${profile.subscriptionType === 'EXPLORER' ? 'bg-blue-100 text-blue-700' : ''}
                    ${profile.subscriptionType === 'MONTHLY' ? 'bg-purple-100 text-purple-700' : ''}
                    ${profile.subscriptionType === 'YEARLY' ? 'bg-orange-100 text-orange-700' : ''}
                  `}>
                    {tabCounts[tab.value as keyof typeof tabCounts]}
                  </span>
                )}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </motion.div>

      {/* Remove AnimatePresence and use simple conditional rendering */}
      <div key={activeTab} className="tab-content">
        <TabsContent value="trips" className="space-y-8 m-0">
          <TripTab profile={profile} />
        </TabsContent>

        <TabsContent value="connections" className="space-y-8 m-0">
          <ConnectionsTab
            profile={profile}
            connections={connections}
            incomingRequests={incomingRequests}
            session={session}
            onRespondToRequest={onRespondToRequest}
            onDeleteConnection={onDeleteConnection}
          />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-8 m-0">
          <ReviewsTab profile={profile} />
        </TabsContent>

        <TabsContent value="interests" className="space-y-8 m-0">
          <InterestsTab profile={profile} onEditClick={onEditClick} />
        </TabsContent>

        <TabsContent value="countries" className="space-y-8 m-0">
          <CountriesTab profile={profile} onEditClick={onEditClick} />
        </TabsContent>
      </div>
    </Tabs>
  );
};