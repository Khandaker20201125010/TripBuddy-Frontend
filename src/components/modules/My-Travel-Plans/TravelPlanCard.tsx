/* eslint-disable react/no-unescaped-entities */
'use client'

import { TravelPlan } from '@/types/travel'
import { Calendar, DollarSign, MapPin, Edit2, Trash2, Eye, User, Image as ImageIcon } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  plan: TravelPlan
  isOwner: boolean
  onEdit?: (plan: TravelPlan) => void
  onDelete?: (plan: TravelPlan) => void
}

export function TravelPlanCard({ plan, isOwner, onEdit, onDelete }: Props) {
  const userName = plan.user?.name || 'Unknown User'
  const [imageError, setImageError] = useState(false)

  // Format dates nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Format budget with commas
  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  // Get status badge variant
  const getStatusVariant = () => {
    switch (plan.status) {
      case 'upcoming': return 'default'
      case 'ongoing': return 'secondary'
      case 'completed': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group">

      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50">
        {plan.image && !imageError ? (
          <>
            <Image
              src={plan.image}
              alt={`Travel destination: ${plan.destination}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
            <div className="relative w-16 h-16 mb-3">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full"></div>
              <ImageIcon className="relative w-8 h-8 text-amber-400 mx-auto mt-4" />
            </div>
            <p className="text-sm text-gray-500 text-center">No travel image</p>
            <p className="text-xs text-gray-400 mt-1">{plan.destination}</p>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={getStatusVariant()} className="font-medium capitalize shadow-sm">
            {plan.status}
          </Badge>
        </div>

        {/* Owner Badge */}
        {isOwner && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500 text-white border-amber-600 shadow-sm">
              You
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Destination Header */}
        <div className="mb-4">
          <h3 className="font-bold text-lg flex items-center text-gray-900 mb-2">
            <MapPin className="w-5 h-5 mr-2 text-amber-600 flex-shrink-0" />
            <span className="truncate">{plan.destination}</span>
          </h3>

          {/* User Info */}
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1 text-gray-400" />
            <span className="font-medium truncate">{userName}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500 capitalize">{plan.travelType}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="text-sm text-gray-600 space-y-3 grow">

          {/* Dates */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700 mb-1">Travel Dates</p>
              <p className="text-gray-600">
                {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
              </p>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700 mb-1">Budget</p>
              <p className="text-gray-600">{formatBudget(plan.budget)}</p>
            </div>
          </div>

          {/* Description */}
          {plan.description && (
            <div className="mt-2 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
              <p className="text-gray-500 line-clamp-3 italic">
                "{plan.description}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-gray-100">

          {/* View Details Button */}
          <Link href={`/my-travel-plans/${plan.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full text-sm border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>

          {/* Edit/Delete Buttons (Owner only) */}
          {isOwner && onEdit && onDelete && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(plan)}
                className="hover:bg-amber-50 hover:text-amber-600 border border-gray-200"
                title="Edit plan"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(plan)}
                className="hover:bg-red-50 hover:text-red-600 border border-gray-200"
                title="Delete plan"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}