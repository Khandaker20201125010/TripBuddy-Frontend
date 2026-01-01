import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card className="border-dashed border-white/40 bg-linear-to-br from-white/30 to-blue-50/20 backdrop-blur-sm shadow-xl">
        <CardContent className="py-16 text-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100/50 to-indigo-100/50 rounded-full flex items-center justify-center mb-8 shadow-inner"
          >
            <div className="text-linear bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {icon}
            </div>
          </motion.div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">{description}</p>
          {action && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {action}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};