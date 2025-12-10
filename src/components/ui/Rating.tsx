import React from 'react'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '../../lib/utils'
interface RatingProps {
  rating: number
  max?: number
  size?: number
  className?: string
  showText?: boolean
  reviewCount?: number
}
export function Rating({
  rating,
  max = 5,
  size = 16,
  className,
  showText = false,
  reviewCount,
}: RatingProps) {
  const stars = []
  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-yellow-400 text-yellow-400"
        />,
      )
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarHalf
          key={i}
          size={size}
          className="fill-yellow-400 text-yellow-400"
        />,
      )
    } else {
      stars.push(<Star key={i} size={size} className="text-stone-300" />)
    }
  }
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">{stars}</div>
      {showText && (
        <span className="ml-1 text-sm font-medium text-stone-700">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-stone-500 font-normal ml-1">
              ({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
