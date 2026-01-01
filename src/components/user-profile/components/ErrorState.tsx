import { motion } from "framer-motion";
import { UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Card className="max-w-md mx-auto border-red-100 bg-linear-to-br from-red-50 to-white shadow-xl">
            <CardContent className="pt-8 text-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto bg-linear-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg"
              >
                <UserIcon className="w-10 h-10 text-red-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-red-800 mb-3">Unable to load profile</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100 shadow-md"
                >
                  Try Again
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};