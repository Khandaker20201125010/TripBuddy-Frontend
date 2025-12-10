/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPinIcon, Loader2 } from "lucide-react";

const aiBoxVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const suggestionCardVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay: 0.3 + i * 0.15 },
  }),
};

export default function AISuggestions() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const handleAIRequest = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/suggestion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: input }),
        }
      );

      const data = await res.json();

      setSuggestions(data.data.ai.suggestions);
      setPlans(data.data.availablePlans);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const findPlan = (id: string) => plans.find((p: any) => p.id === id);

  return (
    <motion.div
      variants={aiBoxVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-(--color-card) rounded-3xl shadow-xl shadow-(--color-charcoal)/10 overflow-hidden border border-(--color-sand-dark)"
    >
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500/80 to-(--color-sunset) p-6">
        <div className="text-white font-semibold text-lg flex items-center gap-2">
          <MapPinIcon className="w-5 h-5" />
          AI Travel Match
        </div>

        <p className="text-white/70 text-sm mt-1">
          Describe your mood, symptoms, or travel vibe.
        </p>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: I'm stressed and want nature"
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none backdrop-blur-sm"
          />
          <button
            onClick={handleAIRequest}
            className="px-6 py-3 bg-white text-(--color-blue) font-semibold rounded-xl hover:bg-(--color-sand) transition"
          >
            Go
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 space-y-4">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-(--color-coral)" />
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <p className="text-center text-(--color-charcoal)/60 py-10">
            Enter something above to get AI suggestions ✨
          </p>
        )}

        {!loading &&
          suggestions.map((s, i) => {
            const plan = findPlan(s.id);
            if (!plan) return null;

            return (
              <motion.div
                key={s.id}
                custom={i}
                variants={suggestionCardVariants}
                initial="hidden"
                animate="visible"
                className="p-4 rounded-2xl bg-(--color-sand)/30 hover:bg-(--color-sand) shadow group cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={plan.image || "/placeholder.jpg"}
                    alt={plan.destination}
                    width={60}
                    height={60}
                    className="rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-(--color-charcoal) font-semibold text-lg">
                      {plan.destination}
                    </h3>
                    <p className="text-sm text-(--color-charcoal)/60 mt-1">
                      {plan.description.substring(0, 70)}...
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-(--color-coral)">
                      {s.matchScore}
                    </div>
                    <div className="text-xs text-(--color-charcoal)/50">
                      score
                    </div>
                  </div>
                </div>

                <p className="text-xs mt-2 text-(--color-charcoal)/50">
                  {s.reason}
                </p>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
}
