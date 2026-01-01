import { motion } from "framer-motion";
import { UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Connection } from "../helpers/types";

interface ConnectionRequestCardProps {
  request: Connection;
  onRespond: (id: string, status: 'ACCEPTED' | 'REJECTED') => void;
}

export const ConnectionRequestCard: React.FC<ConnectionRequestCardProps> = ({
  request,
  onRespond
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-5 rounded-2xl border border-white/30 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14 border-2 border-white/80 shadow-md">
          <AvatarImage src={request.sender?.profileImage} alt={request.sender?.name} />
          <AvatarFallback className="bg-linear-to-br from-amber-100 to-orange-100">
            {request.sender?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold text-gray-900">{request.sender?.name}</h4>
          <p className="text-sm text-gray-500">Sent {new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={() => onRespond(request.id, 'ACCEPTED')}
            className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
          >
            <UserCheck className="w-3 h-3 mr-2" />
            Accept
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRespond(request.id, 'REJECTED')}
            className="border-red-300 text-red-600 hover:bg-red-50 shadow-sm"
          >
            <UserX className="w-3 h-3 mr-2" />
            Decline
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};