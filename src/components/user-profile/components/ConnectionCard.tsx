import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, MapPin, Trash2, MoreVertical, UserRoundSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Connection } from "../helpers/types";

// Create a motion version of the Button component
const MotionButton = motion(Button);

interface ConnectionCardProps {
  connection: Connection;
  currentUserId?: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  currentUserId,
  onDelete,
  isDeleting = false
}) => {
  const otherUser = connection.senderId === currentUserId ? connection.receiver : connection.sender;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="border-white/20 bg-linear-to-br from-white/60 to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
        <CardContent className="p-6 h-full">
          <div className="flex items-start gap-4">
            <motion.div whileHover={{ rotate: 5 }} className="shrink-0">
              <Avatar className="w-16 h-16 border-3 border-white/80 shadow-lg">
                <AvatarImage src={otherUser?.profileImage} alt={otherUser?.name} />
                <AvatarFallback className="bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700">
                  {otherUser?.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 truncate" title={otherUser?.name}>
                    {otherUser?.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate mt-1" title={otherUser?.email}>
                    {otherUser?.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MotionButton
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      disabled={isDeleting}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </MotionButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-white/20 backdrop-blur-sm">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <MapPin className="w-4 h-4" />
                      View Trips
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-red-600 hover:text-red-700 focus:text-red-700"
                      onClick={onDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Remove Connection
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="outline" className="bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shrink-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <span className="text-xs text-gray-500 shrink-0">
                  {new Date(connection.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link href={`/PublicVisitProfile/${otherUser?.id}`} className="block">
              <MotionButton
                variant="outline"
                size="sm"
                className="cursor-pointer w-full border-gray-300 bg-white/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserRoundSearch className="w-4 h-4 mr-2" />
                View Profile
              </MotionButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};