'use client' // Necessary for useState

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

import { Sparkles } from 'lucide-react';
import { PaymentModal } from '@/components/payment/PaymentModal';

const Subscription = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <>
      <div className="bg-emerald-700 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg">Become a Verified Traveler</h3>
          </div>
          <p className="text-emerald-100 text-sm mb-6">
            Get the blue badge, unlock exclusive features, and find buddies faster.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPricingOpen(true)}
            className="w-full bg-white text-emerald-800 hover:bg-emerald-50 font-semibold"
          >
            Apply Now
          </Button>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-600 rounded-full opacity-50 blur-2xl" />
      </div>

      {/* Conditionally render the modal */}
      {isPricingOpen && (
        <PaymentModal onClose={() => setIsPricingOpen(false)} />
      )}
    </>
  );
};

export default Subscription;