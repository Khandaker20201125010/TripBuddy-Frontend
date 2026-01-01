import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Skeleton */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-100 to-gray-200/50 p-8 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <Skeleton className="w-44 h-44 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-12 w-64 bg-linear-to-r from-gray-300 to-gray-400" />
                <Skeleton className="h-6 w-48 bg-linear-to-r from-gray-300 to-gray-400" />
              </div>
              <Skeleton className="h-32 w-full rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-36 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
                <Skeleton className="h-12 w-28 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
            >
              <Skeleton className="h-40 rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
            </motion.div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-16 rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
          <Skeleton className="h-96 rounded-2xl bg-linear-to-r from-gray-300 to-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};