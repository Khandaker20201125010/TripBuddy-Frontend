import React, { useState, lazy } from 'react'
import { Heart, MapPin, Share2, MessageCircle, Clock } from 'lucide-react'
import { Photo } from '@/types/commnunity'
import Image from 'next/image'

interface PhotoCardProps {
    photo: Photo
    onPhotoClick: (photo: Photo) => void
}
export function PhotoCard({ photo, onPhotoClick }: PhotoCardProps) {
    const [isLiked, setIsLiked] = useState(photo.isLiked)
    const [likes, setLikes] = useState(photo.likes)
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLiked) {
            setLikes((prev) => prev - 1)
        } else {
            setLikes((prev) => prev + 1)
        }
        setIsLiked(!isLiked)
    }
    const handleCardClick = () => {
        onPhotoClick(photo)
    }
    return (
        <div
            onClick={handleCardClick}
            className="group relative mb-6 break-inside-avoid rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 ease-out cursor-pointer"
        >
            {/* Header - Photographer Info */}
            <div className="p-4 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-3">
                    <Image
                        width={40}
                        height={40}
                        src={photo.photographerAvatar}
                        alt={photo.photographer}
                        className="w-10 h-10 rounded-full border-2 border-stone-200"
                    />
                    <div>
                        <p className="font-semibold text-stone-900 text-sm">
                            {photo.photographer}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                            <Clock className="w-3 h-3" />
                            <span>{photo.timestamp}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Image
                    width={500}
                    height={300}
                    src={photo.url}
                    alt={photo.tripName}
                    className={`w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${photo.aspectRatio === 'portrait' ? 'aspect-[3/4]' : photo.aspectRatio === 'landscape' ? 'aspect-4/3' : 'aspect-square'}`}
                    loading="lazy"
                />
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Trip Info */}
                <div className="mb-3">
                    <h3 className="font-bold text-lg text-stone-900 mb-1">
                        {photo.tripName}
                    </h3>
                    <div className="flex items-center text-sm text-stone-600">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{photo.location}</span>
                        <span className="mx-2 text-stone-400">•</span>
                        <span>{photo.date}</span>
                    </div>
                </div>

                {/* Caption */}
                {photo.caption && (
                    <p className="text-stone-700 text-sm mb-3 line-clamp-2">
                        {photo.caption}
                    </p>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1.5 text-sm font-medium hover:text-pink-600 transition-colors"
                        >
                            <Heart
                                className={`w-5 h-5 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-stone-600'}`}
                            />
                            <span className="text-stone-700">{likes}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-stone-700">
                                {photo.comments?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
                            <Share2 className="w-5 h-5" />
                            <span className="text-stone-700">{photo.shares || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
