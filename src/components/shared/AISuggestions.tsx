/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPinIcon, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// --- Framer Motion Variants ---
const aiBoxVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const suggestionCardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function AISuggestions() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const handleAIRequest = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSuggestions([]); // Clear previous results
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travelPlan/suggestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: input }),
      });
      
      const result = await res.json();
      
      if (result.success && result.data) {
        // Based on your backend code: result.data.ai.suggestions and result.data.availablePlans
        setSuggestions(result.data.ai.suggestions || []);
        setPlans(result.data.availablePlans || []);
      }
    } catch (err) {
      console.error("AI Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanClick = (planId: string) => {
    if (!planId) {
      console.error("No Plan ID found");
      return;
    }

    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      router.push(`/my-travel-plans/${planId}`);
    }
  };

  const findPlan = (id: string) => plans.find((p: any) => p.id === id);

  return (
    <motion.div
      variants={aiBoxVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-(--color-card) rounded-2xl md:rounded-3xl shadow-xl shadow-(--color-charcoal)/10 overflow-hidden border border-(--color-sand-dark)"
    >
      {/* Header & Input Section */}
      <div className="bg-linear-to-r from-orange-500/80 to-(--color-sunset) p-4 md:p-6">
        <div className="text-white font-semibold text-base md:text-lg flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 md:w-5 md:h-5" />
          AI Travel Matcher
        </div>
        <p className="text-orange-100 text-xs md:text-sm mt-1">
          Tell us how you feel, and we'll find the perfect trip.
        </p>
        
        <div className="mt-3 md:mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAIRequest()}
            placeholder="e.g. I'm exhausted and need a quiet beach..."
            className="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl bg-white/20 text-white placeholder-white/70 outline-none backdrop-blur-md border border-white/30 focus:bg-white/30 transition-all text-sm md:text-base"
          />
          <button
            onClick={handleAIRequest}
            disabled={loading}
            className="px-4 py-2 md:px-6 md:py-3 bg-white text-orange-600 font-bold rounded-lg md:rounded-xl hover:bg-orange-50 transition active:scale-95 disabled:opacity-50 text-sm md:text-base whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : "Go"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 md:py-12 text-stone-400">
            <Loader2 className="animate-spin w-8 h-8 md:w-10 md:h-10 mb-2 text-orange-500" />
            <p className="text-xs md:text-sm font-medium">Consulting the travel AI...</p>
          </div>
        )}

        {!loading && suggestions.length === 0 && !input && (
          <div className="text-center py-8 md:py-10 text-stone-400">
            <h1 className="text-sm md:text-base">Enter something above to get AI suggestions ✨</h1>
            <p className="text-xs md:text-sm mt-1">And Your personalized matches will appear here.</p>
          </div>
        )}

        {!loading && suggestions.map((s, i) => {
          const plan = findPlan(s.id);
          if (!plan) return null;

          return (
            <motion.div
              key={plan.id}
              custom={i}
              variants={suggestionCardVariants}
              initial="hidden"
              animate="visible"
              onClick={() => handlePlanClick(plan.id)}
              className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-stone-50 border border-stone-100 hover:border-orange-200 hover:bg-orange-50/50 shadow-sm group cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0">
                  <Image
                    src={plan.image || "/default-cover.jpg"}
                    alt={plan.destination}
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="rounded-lg md:rounded-xl object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-stone-800 font-bold text-sm md:text-base truncate">
                    {plan.destination}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                    {plan.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg md:text-xl font-black text-orange-600">
                    {s.matchScore}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                    Match
                  </div>
                </div>
              </div>
              
              {/* AI Reasoning Tag */}
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-stone-200/60">
                <p className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-bold text-orange-600">AI Logic:</span> {s.reason}
                </p>
              </div>
            </motion.div>
          );
        })}
        
        {!loading && suggestions.length === 0 && input && (
           <div className="text-center py-8 md:py-10 text-stone-500 text-sm md:text-base">
             No specific matches found. Try describing a different vibe!
           </div>
        )}
      </div>
    </motion.div>
  );
}