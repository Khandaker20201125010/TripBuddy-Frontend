"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Image from "next/image"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to safely get image URL
const getSafeImageUrl = (src: string | Blob | undefined): string => {
  if (!src) return '/placeholder-user.png';
  
  // If it's a Blob (from URL.createObjectURL), convert to string
  if (src instanceof Blob) {
    return URL.createObjectURL(src);
  }
  
  // If it's already a full URL, return it
  if (src.startsWith('http')) {
    return src;
  }
  
  // If it's a relative path, prepend the API URL
  if (src.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${src}`;
  }
  
  // Default fallback
  return '/placeholder-user.png';
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, alt = "Avatar", ...props }, ref) => {
  const imageUrl = getSafeImageUrl(src as string | Blob | undefined);
  
  return (
    <AvatarPrimitive.Image
      ref={ref}
      src={imageUrl}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  >
    {children || <User className="h-4 w-4" />}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }