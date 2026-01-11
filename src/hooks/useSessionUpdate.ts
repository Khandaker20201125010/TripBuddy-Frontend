// hooks/useSessionUpdate.ts
'use client'

import { useSession } from 'next-auth/react'

export const useSessionUpdate = () => {
  const { data: session, update } = useSession()

  const updateSessionImage = async (newImageUrl: string) => {
    if (!session?.user) return false
    
    try {
      // Update the session with new image
      await update({
        ...session,
        user: {
          ...session.user,
          image: newImageUrl,
          picture: newImageUrl, // Update both image and picture for compatibility
        }
      })
      
      // Force a refresh of the session
      await fetch('/api/auth/session?update=' + Date.now())
      
      return true
    } catch (error) {
      console.error('Failed to update session image:', error)
      return false
    }
  }

  const updateSessionName = async (newName: string) => {
    if (!session?.user) return false
    
    try {
      await update({
        ...session,
        user: {
          ...session.user,
          name: newName
        }
      })
      return true
    } catch (error) {
      console.error('Failed to update session name:', error)
      return false
    }
  }

  return {
    updateSessionImage,
    updateSessionName,
    session
  }
}