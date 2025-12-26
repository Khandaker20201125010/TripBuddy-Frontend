/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, SparklesIcon, X } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation' // Added for redirection
import CheckoutForm from '@/components/payment/CheckoutForm'
import Swal from 'sweetalert2'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: 'Explorer',
    price: '$5',
    amount: 500,
    type: 'EXPLORER',
    period: '/week',
    description: 'Perfect for trying out the platform',
    features: ['Create 4 Travel Plan', 'Basic destination search', '10 Buddy requests/month', 'Public profile view'],
    cta: 'Join Weekly',
    highlighted: false,
  },
  {
    name: 'Adventurer',
    price: '$12',
    amount: 1200,
    type: 'MONTHLY',
    period: '/month',
    description: 'For active travelers seeking companions',
    features: ['Unlimited Travel Plans', 'Verified Badge', 'Unlimited Buddy requests',  'Priority search results'],
    cta: 'Join Monthly',
    highlighted: true,
  },
  {
    name: 'Globetrotter',
    price: '$99',
    amount: 9900,
    type: 'YEARLY',
    period: '/year',
    description: 'Best value for frequent world explorers',
    features: ['Everything in Adventurer', 'Ad-free experience', 'Exclusive Badges', 'Priority Support', 'Partner Discounts'],
    cta: 'Join Yearly',
    highlighted: false,
  },
]

interface PaymentModalProps {
    onClose: () => void;
}

export function PaymentModal({ onClose }: PaymentModalProps) {
  const router = useRouter() // Initialize router
  const { data: session, status, update } = useSession()
  const [clientSecret, setClientSecret] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [currentAmount, setCurrentAmount] = useState(0)
  
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const user = session?.user as any;
  const userPlan = user?.subscriptionType; 
  const isPremium = user?.premium;

  const getButtonProps = (planType: string, defaultCta: string, planName: string) => {
    if (!isPremium || !userPlan) return { label: defaultCta, disabled: false };

    const weights: Record<string, number> = { 'EXPLORER': 1, 'MONTHLY': 2, 'YEARLY': 3 };
    const currentUserWeight = weights[userPlan] || 0;
    const targetPlanWeight = weights[planType] || 0;

    if (userPlan === planType) return { label: 'Current Plan', disabled: true };
    if (targetPlanWeight > currentUserWeight) return { label: `Upgrade to ${planName}`, disabled: false };
    if (targetPlanWeight < currentUserWeight) return { label: 'Plan Active', disabled: true };

    return { label: defaultCta, disabled: false };
  }

  const handleCheckoutInit = async (plan: typeof plans[0]) => {
    setIsInitializing(true)

    // FIXED: Custom Auth Guard with redirect to /login
    if (status !== 'authenticated') {
      Swal.fire({
        title: 'Auth Required',
        text: 'Please log in to purchase a subscription.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#f97316',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to /login and pass current path as callbackUrl
          const currentPath = window.location.pathname;
          router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        }
      });
      setIsInitializing(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`, 
        },
        body: JSON.stringify({ subscriptionType: plan.type }),
      })

      const result = await res.json()
      if (result.success) {
        setClientSecret(result.data.clientSecret)
        setTransactionId(result.data.paymentId)
        setCurrentAmount(plan.amount)
        setIsStripeModalOpen(true)
      } else {
        Swal.fire('Error', result.message || 'Failed to initiate payment', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Connection error', 'error');
    } finally {
      setIsInitializing(false)
    }
  }

  const handlePaymentSuccess = async (txId: string) => {
    Swal.fire({ title: 'Verifying...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ transactionId: txId }),
      })

      const data = await res.json()
      if (data.success) {
        setIsStripeModalOpen(false)
        await update(); 
        Swal.fire('Success!', 'Your subscription is now active!', 'success').then(() => {
            onClose(); 
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Verification failed.', 'error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-stone-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10 z-10"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors z-20"
        >
          <X className="w-5 h-5 text-stone-600" />
        </button>

        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">Choose Your Journey</h2>
          <p className="text-lg text-stone-600">Unlock full access to find your perfect travel buddy</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch pb-8">
          {plans.map((plan, index) => {
            const { label, disabled } = getButtonProps(plan.type, plan.cta, plan.name);

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 flex flex-col border ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-xl scale-100 md:scale-105 border-orange-400 z-10' 
                    : 'bg-white text-gray-900 shadow-md border-stone-100'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md uppercase">
                    <SparklesIcon className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm opacity-80">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm opacity-90 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <CheckIcon className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-orange-100' : 'text-teal-600'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckoutInit(plan)}
                  disabled={isInitializing || disabled}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    plan.highlighted 
                      ? 'bg-white text-orange-600 hover:bg-orange-50 shadow-lg' 
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {isInitializing ? 'Processing...' : label}
                </button>
              </motion.div>
            )
          })}
        </div>

        {isStripeModalOpen && clientSecret && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative">
                  <button 
                    onClick={() => setIsStripeModalOpen(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                    <CheckoutForm 
                      transactionId={transactionId}
                      amount={currentAmount}
                      onSuccess={handlePaymentSuccess}
                      onClose={() => setIsStripeModalOpen(false)}
                    />
                  </Elements>
              </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}