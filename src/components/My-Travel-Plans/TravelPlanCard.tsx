/* eslint-disable react/no-unescaped-entities */
'use client'

import { TravelPlan } from '@/types/travel'
import { Calendar, DollarSign, MapPin, Edit2, Trash2, Eye,  User } from 'lucide-react'
import { Badge } from '../ui/badge' // Assuming you have this
import { Button } from '../ui/button' // Assuming you have this
import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'

interface Props {
  plan: TravelPlan
  isOwner: boolean // New prop to check ownership
  onEdit?: (plan: TravelPlan) => void // Made optional
  onDelete?: (plan: TravelPlan) => void // Made optional
}

export function TravelPlanCard({ plan, isOwner, onEdit, onDelete }: Props) {
const userName = plan.user?.name || 'Unknown User';

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image / Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg flex items-center text-gray-900">
            <MapPin className="w-5 h-5 mr-2 text-amber-600" />
            {plan.destination}
          </h3>
          {/* Show who created the plan */}
          <div className="flex items-center mt-2">
            <div className="text-sm text-gray-500 flex items-center">
              <User className="w-4 h-4 mr-1" />
              {userName|| 'Unknown User'}
              {isOwner && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">You</span>}
            </div>
          </div>
        </div>
        <Badge variant={plan.status === 'upcoming' ? 'default' : 'secondary'}>
          {plan.status}
        </Badge>
      </div>

      {/* Details Section */}
      <div className="text-sm text-gray-600 space-y-3 grow">
        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {new Date(plan.startDate).toLocaleDateString()} –{' '}
            {new Date(plan.endDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
          <span>${plan.budget}</span>
        </div>

        {plan.description && (
          <p className="text-gray-500 line-clamp-2 mt-2 italic text-xs">
            "{plan.description}"
          </p>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-gray-100">

        {/* Everyone sees View Details */}
        <Link href={`/travel-plans/${plan.id}`} className="flex-1">
          <Button variant="outline" className="w-full text-xs">
            <Eye className="w-3 h-3 mr-2" />
            View Details
          </Button>
        </Link>

        {/* Only Owner sees Edit/Delete */}
        {isOwner && onEdit && onDelete && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(plan)}
              className="hover:text-amber-600"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(plan)}
              className="hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}