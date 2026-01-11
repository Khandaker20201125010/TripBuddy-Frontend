// components/ui/NavbarAvatar.tsx
"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NavbarAvatarProps {
  src?: string | null | undefined 
  name?: string | null | undefined 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NavbarAvatar({ src, name, size = 'md', className }: NavbarAvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U'

  // Helper function to validate image source
  const getValidImageSrc = (): string | null => {
    if (!src) return null
    
    const srcStr = String(src)
    
    // Check if src is a valid URL or path
    const isValid = srcStr && 
      srcStr.trim() !== '' && 
      srcStr !== 'undefined' && 
      !srcStr.includes('null') &&
      (srcStr.startsWith('http') || 
       srcStr.startsWith('data:') || 
       srcStr.startsWith('/'))
    
    return isValid ? srcStr : null
  }

  const validImageSrc = getValidImageSrc()
  const shouldShowImage = validImageSrc && !imageError

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden flex items-center justify-center",
      sizeClasses[size],
      className,
      !shouldShowImage && "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
    )}>
      {shouldShowImage ? (
        <Image
          src={validImageSrc}
          alt={name || 'User avatar'}
          fill
          className="object-cover"
          sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px'}
          referrerPolicy="no-referrer"
          onError={() => {
            console.error('Image failed to load:', validImageSrc);
            setImageError(true)
          }}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}