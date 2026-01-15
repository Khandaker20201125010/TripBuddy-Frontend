"use client"
import { useState } from "react";
import { PaymentModal } from "../../payment/PaymentModal";

export function PremiumCTA() {

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  return (
    <div className="bg-emerald-700 text-white rounded-xl p-6">
      <h3 className="font-bold mb-2">Go Premium ✨</h3>
      <p className="text-sm mb-4">
        Unlock verified badge, priority matching, and unlimited requests.
      </p>
      <button onClick={() => setIsPricingOpen(true)} className="bg-white text-emerald-800 w-full py-2 rounded">
        Upgrade Now
      </button>

      {isPricingOpen && (
        <PaymentModal onClose={() => setIsPricingOpen(false)} />
      )}
    </div>
  );
}
