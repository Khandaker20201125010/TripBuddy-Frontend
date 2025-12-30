/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/payment/CheckoutForm.tsx
'use client'
import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Swal from 'sweetalert2'


export default function CheckoutForm({ transactionId, amount, onSuccess, onClose }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      Swal.fire({
        title: 'Payment Failed',
        text: error.message || 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonColor: '#0d9488'
      });
      setIsLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(transactionId);
    }
  }

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      {/* Scrollable Container Fix */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold">Checkout</h2>
            <p className="text-teal-600 font-bold text-lg">${(amount / 100).toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-2xl">✕</button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement options={{ layout: 'accordion' }} />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">For testing:</p>
              <p className="text-xs text-blue-600">
                Use card: <span className="font-mono">4242 4242 4242 4242</span>
              </p>
              <p className="text-xs text-blue-600">
                Exp: Any future date | CVC: Any 3 digits
              </p>
            </div>
            <button
              disabled={isLoading || !stripe || !elements}
              className="w-full mt-8 bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : `Pay Now`}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">Secure encrypted payment via Stripe</p>
        </div>
      </div>
    </div>
  )
}