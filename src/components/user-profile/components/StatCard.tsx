import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: "blue" | "emerald" | "amber" | "purple" | "indigo";
  index: number;
  premium?: boolean;
  subscriptionType?: string;
}

const colorClasses = {
  blue: "from-blue-400 to-indigo-500",
  emerald: "from-emerald-400 to-teal-500",
  amber: "from-amber-400 to-orange-500",
  purple: "from-purple-400 to-pink-500",
  indigo: "from-indigo-400 to-blue-500"
};

const bgClasses = {
  blue: "from-blue-50/50 to-indigo-50/30",
  emerald: "from-emerald-50/50 to-teal-50/30",
  amber: "from-amber-50/50 to-orange-50/30",
  purple: "from-purple-50/50 to-pink-50/30",
  indigo: "from-indigo-50/50 to-blue-50/30"
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color = "blue",
  index,
  premium,
  subscriptionType
}) => {
  const colorKey = color as keyof typeof colorClasses;
  const bgKey = color as keyof typeof bgClasses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={cn(
        "border-white/20 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300",
        premium
          ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'border-blue-200 bg-linear-to-br from-blue-50/50 to-white/30' :
            subscriptionType === 'MONTHLY' && color === 'purple' ? 'border-purple-200 bg-linear-to-br from-purple-50/50 to-white/30' :
              subscriptionType === 'YEARLY' && color === 'amber' ? 'border-orange-200 bg-linear-to-br from-orange-50/50 to-white/30' :
                bgClasses[bgKey]
          : bgClasses[bgKey]
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className={cn(
                "p-3 rounded-2xl bg-opacity-10 backdrop-blur-sm",
                premium
                  ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'bg-linear-to-br from-blue-500 to-cyan-500' :
                    subscriptionType === 'MONTHLY' && color === 'purple' ? 'bg-linear-to-br from-purple-500 to-violet-500' :
                      subscriptionType === 'YEARLY' && color === 'amber' ? 'bg-linear-to-br from-orange-500 to-amber-500' :
                        `bg-linear-to-br ${colorClasses[colorKey]}`
                  : `bg-linear-to-br ${colorClasses[colorKey]}`
              )}
            >
              <div className={cn(
                "bg-clip-text text-transparent",
                premium
                  ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'text-linear bg-linear-to-br from-blue-600 to-cyan-600' :
                    subscriptionType === 'MONTHLY' && color === 'purple' ? 'text-linear bg-linear-to-br from-purple-600 to-violet-600' :
                      subscriptionType === 'YEARLY' && color === 'amber' ? 'text-linear bg-linear-to-br from-orange-600 to-amber-600' :
                        `text-linear bg-linear-to-br ${colorClasses[colorKey]}`
                  : `text-linear bg-linear-to-br ${colorClasses[colorKey]}`
              )}>
                {icon}
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              className="opacity-20"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </div>
          <div className="mt-6">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={cn(
                "text-4xl font-bold bg-clip-text text-transparent",
                premium
                  ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'bg-linear-to-br from-blue-600 to-cyan-600' :
                    subscriptionType === 'MONTHLY' && color === 'purple' ? 'bg-linear-to-br from-purple-600 to-violet-600' :
                      subscriptionType === 'YEARLY' && color === 'amber' ? 'bg-linear-to-br from-orange-600 to-amber-600' :
                        'bg-linear-to-br from-gray-900 to-gray-700'
                  : 'bg-linear-to-br from-gray-900 to-gray-700'
              )}
            >
              {value}
            </motion.div>
            <div className="text-sm font-semibold text-gray-700 mt-2">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{subtext}</div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "mt-4 h-1 w-full bg-linear-to-r from-transparent to-transparent opacity-20",
              premium
                ? subscriptionType === 'EXPLORER' && color === 'blue' ? 'via-blue-500' :
                  subscriptionType === 'MONTHLY' && color === 'purple' ? 'via-purple-500' :
                    subscriptionType === 'YEARLY' && color === 'amber' ? 'via-orange-500' :
                      `via-${color}-500`
                : `via-${color}-500`
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};