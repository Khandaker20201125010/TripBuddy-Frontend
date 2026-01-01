// components/ui/NavbarAvatar.tsx (Simplified fix)
"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface NavbarAvatarProps {
  src?: string | null | undefined 
  name?: string | null | undefined 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NavbarAvatar({ src, name, size = 'md', className }: NavbarAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U'

  // Convert null to undefined for cleaner checks
  const imageSrc = src || undefined;
  
  // Check if src is valid and not empty
  const hasValidImage = imageSrc && 
    imageSrc !== '' && 
    imageSrc !== 'undefined' && 
    !imageSrc.includes('null') &&
    (imageSrc.startsWith('http') || imageSrc.startsWith('data:') || imageSrc.startsWith('/'))

  if (hasValidImage) {
    return (
      <div className={cn(
        "relative rounded-full overflow-hidden",
        sizeClasses[size],
        className
      )}>
        <Image
          src={imageSrc}
          alt={name || 'User avatar'}
          fill
          className="object-cover"
          sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px'}
          referrerPolicy="no-referrer"
          onError={(e) => {
            console.error('Image failed to load:', imageSrc);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium",
      sizeClasses[size],
      className
    )}>
      {initials}
    </div>
  )
}