/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { Button } from '../ui/button' // Adjust path if needed
import api from '@/lib/axios'
import Swal from 'sweetalert2'
import { Star } from 'lucide-react'

interface ReviewModalProps {
  plan: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewFormModal({ plan, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
        Swal.fire("Rating Required", "Please click a star to rate.", "warning");
        return;
    }

    setSubmitting(true)
    try {
      // NOTE: Ensure your backend route is correct. 
      // If your Router defines it as router.post("/", ...) inside ReviewRoutes, 
      // then the path here is usually "/reviews" or "/review" depending on app.ts
      await api.post('/review', { 
        travelPlanId: plan.id,
        rating,
        content
      })
      
      Swal.fire("Success", "Review submitted!", "success")
      onSuccess(); // Refresh the page data
      onClose();   // Close modal
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit review";
      Swal.fire("Error", msg, "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 space-y-4 bg-white rounded-xl">
      <div className="text-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Rate Your Trip</h2>
        <p className="text-sm text-gray-500">
            Trip to {plan.destination} with <span className="font-semibold">{plan.user?.name}</span>
        </p>
      </div>
      
      <div className="flex justify-center py-2 gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            onClick={() => setRating(star)} 
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
            type="button"
          >
            <Star 
                size={32}
                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-100"} 
            />
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-gray-400 mb-2">
        {rating > 0 ? `${rating} Stars` : "Tap a star to rate"}
      </p>

      <textarea 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none bg-gray-50 text-sm"
        placeholder="How was the experience? Share some details..." 
        rows={4}
        value={content} 
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  )
}