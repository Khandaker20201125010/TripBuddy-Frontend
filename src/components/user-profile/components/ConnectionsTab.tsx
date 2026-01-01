/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, UserPlus, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { ConnectionCard } from "./ConnectionCard";
import { ConnectionRequestCard } from "./ConnectionRequestCard";
import Link from "next/link";
import { UserProfile, Connection } from "../helpers/types";

interface ConnectionsTabProps {
  profile: UserProfile;
  connections: Connection[];
  incomingRequests: Connection[];
  session: any;
  onRespondToRequest: (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  onDeleteConnection: (connectionId: string) => Promise<void>;
}

export const ConnectionsTab: React.FC<ConnectionsTabProps> = ({
  profile,
  connections,
  incomingRequests,
  session,
  onRespondToRequest,
  onDeleteConnection
}) => {
  if (connections.length === 0 && incomingRequests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <EmptyState
          icon={<UserCheck className="w-16 h-16" />}
          title="No connections yet"
          description="Start connecting with other travelers to build your travel network!"
          action={
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/explore-travelers">
                <Button className={`
                  mt-6 shadow-lg
                  ${profile.premium
                    ? profile.subscriptionType === 'EXPLORER'
                      ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                      : profile.subscriptionType === 'MONTHLY'
                        ? 'bg-linear-to-r from-purple-600 to-violet-600'
                        : 'bg-linear-to-r from-orange-600 to-amber-600'
                    : 'bg-linear-to-r from-blue-600 to-indigo-600'
                  }
                `}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Travelers
                </Button>
              </Link>
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
            My Connections
          </h3>
          <p className="text-gray-600">Build your travel network</p>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Badge variant="outline" className="gap-2 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm">
              <UserCheck className="w-3 h-3" />
              Connected: {connections.length}
            </Badge>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Badge variant="outline" className="gap-2 bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300 shadow-sm">
              <UserPlus className="w-3 h-3" />
              Pending: {incomingRequests.length}
            </Badge>
          </motion.div>
          {profile.premium && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Badge className={`
                gap-2 shadow-sm
                ${profile.subscriptionType === 'EXPLORER' ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white' : ''}
                ${profile.subscriptionType === 'MONTHLY' ? 'bg-linear-to-r from-purple-500 to-violet-500 text-white' : ''}
                ${profile.subscriptionType === 'YEARLY' ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white' : ''}
              `}>
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Pending Requests */}
      {incomingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-white/20 bg-linear-to-br from-amber-50/50 to-orange-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-amber-400 to-orange-400 rounded-xl shadow-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div>Connection Requests ({incomingRequests.length})</div>
                  <CardDescription>
                    Review and respond to incoming connection requests
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {incomingRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ConnectionRequestCard
                        request={request}
                        onRespond={onRespondToRequest}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Connected Users */}
      {connections.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="border-white/20 bg-linear-to-br from-white/50 to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Travel Buddies ({connections.length})</CardTitle>
              <CardDescription>
                Travelers you're connected with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {connections.map((connection, index) => (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <ConnectionCard
                        connection={connection}
                        currentUserId={session?.user?.id}
                        onDelete={() => onDeleteConnection(connection.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};