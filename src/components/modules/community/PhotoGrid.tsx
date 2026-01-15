import React from 'react'

import { PhotoCard } from './PhotoCard'
import { Photo } from '@/types/commnunity'
interface PhotoGridProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}
export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 text-lg">
          No photos found for this category.
        </p>
      </div>
    )
  }
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-4 md:px-0 pb-20">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onPhotoClick={onPhotoClick} />
      ))}
    </div>
  )
}
