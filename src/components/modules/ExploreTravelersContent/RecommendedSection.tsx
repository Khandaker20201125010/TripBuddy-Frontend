/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  LogIn, 
  AlertCircle, 
  RefreshCw,
  Users,
  MapPin,
  Star
} from 'lucide-react'
import { TravelerCard } from './TravelerCard'
import { Button } from '@/components/ui/button'
import { useSession, signIn } from 'next-auth/react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface RecommendedSectionProps {
  travelers: any[]
  loading?: boolean
  error?: string | null
  isAuthenticated?: boolean
  onRetry?: () => void
}

export function RecommendedSection({ 
  travelers, 
  loading = false,
  error = null,
  isAuthenticated = false,
  onRetry
}: RecommendedSectionProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    if (onRetry) {
      setRetrying(true)
      try {
        await onRetry()
      } finally {
        setRetrying(false)
      }
    }
  }

  // 🔐 Handle View All click
  const handleViewAll = async () => {
    if (!session && !isAuthenticated) {
      const result = await Swal.fire({
        title: 'Login Required',
        text: 'Please login to view all travel plans.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        confirmButtonColor: '#ea580c',
      })

      if (result.isConfirmed) {
        router.push('/login')
      }
      return
    }

    // ✅ Logged in → navigate
    router.push('/my-travel-plans')
  }

  // 1. Loading State
  if (loading || retrying) {
    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            {retrying ? 'Refreshing recommendations...' : 'Finding travelers you might connect with...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg bg-stone-50/50">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // 2. Not Authenticated State
  if (!isAuthenticated) {
    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-600" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Login to see travelers matched with your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Discover Travelers Like You
            </h3>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              Get personalized travel buddy recommendations based on your interests, travel history, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to View Recommendations
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-stone-300 hover:bg-stone-50">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 3. Error State
  if (error) {
    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Recommended for You
          </CardTitle>
          <CardDescription>Unable to load recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                className="bg-linear-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white"
                disabled={retrying}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
                {retrying ? 'Retrying...' : 'Try Again'}
              </Button>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="border-stone-300 hover:bg-stone-50">
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 4. No Recommendations State (Authenticated but empty)
  if (!travelers || travelers.length === 0) {
    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            Complete your profile to get better recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              Add your travel interests, visited countries, and travel plans to get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/profile">
                <Button className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                  Complete Your Profile
                </Button>
              </Link>
              <Link href="/explore-travelers">
                <Button variant="outline" className="border-stone-300 hover:bg-stone-50">
                  Browse All Travelers
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 5. Data State (Success)
  return (
    <Card className="border-stone-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              Travelers who match your interests and travel style
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer"
            onClick={handleViewAll}
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {travelers.slice(0, 3).map((traveler) => (
            <Link 
              key={traveler.id} 
              href={`/PublicVisitProfile/${traveler.id}`}
              className="group block"
            >
              <div className="p-4 border border-stone-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarImage src={traveler.avatar} alt={traveler.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700">
                      {traveler.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-stone-900 truncate group-hover:text-orange-700 transition-colors">
                        {traveler.name}
                      </h4>
                      {traveler.rating > 0 && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{traveler.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-stone-500 mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{traveler.location}</span>
                    </div>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-2 group-hover:text-stone-700">
                      {traveler.bio}
                    </p>
                    {traveler.interests && traveler.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {traveler.interests.slice(0, 2).map((interest: string, idx: number) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                          >
                            {interest}
                          </Badge>
                        ))}
                        {traveler.interests.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0.5 text-stone-500"
                          >
                            +{traveler.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {travelers.length > 3 && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              className="border-stone-300 hover:bg-stone-50 cursor-pointer"
              onClick={handleViewAll}
            >
              View {travelers.length - 3} more recommendations
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}