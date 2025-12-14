'use client'
import { MapPin, BadgeCheck, MessageCircle, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/Rating'
import { Button } from '@/components/ui/button'
import { Traveler } from '@/components/shared/data/mockTravelers'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'

interface TravelerCardProps {
  traveler: Traveler
  index?: number
}

export function TravelerCard({ traveler, index = 0 }: TravelerCardProps) {
  // Ensure interests is always an array
  const interests = traveler.interests ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group h-full flex flex-col border-stone-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
        <div className="relative h-32 bg-stone-100 overflow-hidden">
          <Image
            width={300}
            height={128}
            src={traveler.coverImage || '/default-cover.jpg'}
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />  
        </div>

        <CardContent className="relative pt-12 pb-4 grow">
          <div className="absolute -top-10 left-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
              <AvatarImage src={traveler.avatar || '/default-avatar.png'} alt={traveler.name} />
              <AvatarFallback>{traveler.name?.slice(0, 2) || 'NA'}</AvatarFallback>
            </Avatar>
            {traveler.online && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />
            )}
          </div>

          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-lg text-stone-900">{traveler.name || 'Unknown'}</h3>
                {traveler.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-sm text-stone-500">{traveler.handle || '@unknown'}</p>
            </div>
            <Rating rating={traveler.rating ?? 0} size={14} />
          </div>

          <div className="flex items-center gap-1 text-sm text-stone-600 mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{traveler.location || 'Unknown'}</span>
          </div>

          <p className="text-sm text-stone-600 line-clamp-2 mb-4">{traveler.bio || ''}</p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {interests.slice(0, 3).map((interest) => (
              <Badge
                key={interest}
                variant="secondary"
                className="font-normal text-xs bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                {interest}
              </Badge>
            ))}
            {interests.length > 3 && (
              <Badge
                variant="secondary"
                className="font-normal text-xs bg-stone-100 text-stone-600"
              >
                +{interests.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-3 p-4 bg-stone-50/50 border-t border-stone-100">
          <Button variant="outline" size="sm" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button variant="gradient" size="sm" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
