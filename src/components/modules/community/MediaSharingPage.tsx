"use client"
import React, { useState, memo } from 'react'
import { FilterType, Photo, PhotoComment } from '@/types/commnunity'

import { PhotoDetailModal } from './PhotoDetailModal'
import { PhotoGrid } from './PhotoGrid'
import { FilterBar } from './FilterBar'
import { PhotoUpload } from './PhotoUpload'
// Mock Comments Data
const MOCK_COMMENTS: {
  [photoId: string]: PhotoComment[]
} = {
  '1': [
    {
      id: 'c1',
      photoId: '1',
      author: 'Mike T.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      content: 'Absolutely stunning! Bali is on my bucket list.',
      timestamp: '2 hours ago',
      likes: 5,
    },
    {
      id: 'c2',
      photoId: '1',
      author: 'Emma W.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      content:
        'The colors in this photo are incredible! What camera did you use?',
      timestamp: '5 hours ago',
      likes: 3,
    },
  ],
  '3': [
    {
      id: 'c3',
      photoId: '3',
      author: 'David L.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      content: 'Paris never gets old. Beautiful capture!',
      timestamp: '1 day ago',
      likes: 8,
    },
  ],
}
// Mock Data
const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tripName: 'Bali Retreat',
    location: 'Ubud, Indonesia',
    date: 'Oct 2023',
    likes: 124,
    isLiked: false,
    photographer: 'Sarah J.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    aspectRatio: 'portrait',
    comments: MOCK_COMMENTS['1'] || [],
    shares: 23,
    caption:
      'Found paradise in the rice terraces of Ubud. The morning mist rolling over the green fields was absolutely magical. This place has my heart! 🌾✨',
    timestamp: '3 hours ago',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80',
    tripName: 'Alpine Adventure',
    location: 'Swiss Alps',
    date: 'Sep 2023',
    likes: 89,
    isLiked: true,
    photographer: 'Mike T.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    aspectRatio: 'landscape',
    comments: [],
    shares: 15,
    caption:
      'Hiking through the Swiss Alps was a dream come true. Every turn revealed a more breathtaking view than the last.',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tripName: 'Parisian Dreams',
    location: 'Paris, France',
    date: 'Aug 2023',
    likes: 256,
    isLiked: false,
    photographer: 'Emma W.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    aspectRatio: 'portrait',
    comments: MOCK_COMMENTS['3'] || [],
    shares: 45,
    caption:
      'Golden hour at the Eiffel Tower never disappoints. The city of lights truly lives up to its name! 🗼💫',
    timestamp: '2 days ago',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tripName: 'Coastal Escape',
    location: 'Amalfi Coast, Italy',
    date: 'Jul 2023',
    likes: 167,
    isLiked: true,
    photographer: 'David L.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    aspectRatio: 'landscape',
    comments: [],
    shares: 31,
    caption:
      'The Amalfi Coast stole my heart with its colorful villages and crystal-clear waters. Already planning my return!',
    timestamp: '3 days ago',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tripName: 'Mountain Haze',
    location: 'Rocky Mountains, USA',
    date: 'Jun 2023',
    likes: 92,
    isLiked: false,
    photographer: 'Alex R.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    aspectRatio: 'landscape',
    comments: [],
    shares: 12,
    caption:
      'Camping under the stars in the Rockies. Nature therapy at its finest.',
    timestamp: '5 days ago',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80',
    tripName: 'Forest Whispers',
    location: 'Black Forest, Germany',
    date: 'May 2023',
    likes: 78,
    isLiked: false,
    photographer: 'Sophie M.',
    photographerAvatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    aspectRatio: 'portrait',
    comments: [],
    shares: 8,
    caption:
      'Lost in the enchanting Black Forest. Every path leads to a new fairy tale.',
    timestamp: '1 week ago',
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    tripName: 'Greek Summer',
    location: 'Santorini, Greece',
    date: 'Sep 2023',
    likes: 312,
    isLiked: true,
    photographer: 'Chris P.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    aspectRatio: 'square',
    comments: [],
    shares: 67,
    caption:
      'Santorini sunsets are pure magic. The blue domes against the golden sky create the perfect postcard moment.',
    timestamp: '1 week ago',
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80',
    tripName: 'Urban Jungle',
    location: 'Chicago, USA',
    date: 'Oct 2023',
    likes: 145,
    isLiked: false,
    photographer: 'Tom H.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    aspectRatio: 'portrait',
    comments: [],
    shares: 19,
    caption:
      "City lights and skyscrapers. Chicago's architecture never ceases to amaze me.",
    timestamp: '2 weeks ago',
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    tripName: 'Desert Road',
    location: 'Arizona, USA',
    date: 'Nov 2023',
    likes: 189,
    isLiked: true,
    photographer: 'Lisa K.',
    photographerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    aspectRatio: 'landscape',
    comments: [],
    shares: 28,
    caption:
      "Road tripping through Arizona's desert landscapes. The open road calls and I must go! 🚗🌵",
    timestamp: '2 weeks ago',
  },
]
export function MediaSharingPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedPhoto(null), 200)
  }
  const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              ...updates,
            }
          : photo,
      ),
    )
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto((prev) =>
        prev
          ? {
              ...prev,
              ...updates,
            }
          : null,
      )
    }
  }
  const filteredPhotos = photos.filter((photo) => {
    if (activeFilter === 'All') return true
    const location = photo.location.toLowerCase()
    const trip = photo.tripName.toLowerCase()
    if (activeFilter === 'Beach')
      return (
        location.includes('bali') ||
        location.includes('coast') ||
        location.includes('greece')
      )
    if (activeFilter === 'Mountain')
      return (
        location.includes('alps') ||
        location.includes('mountains') ||
        trip.includes('mountain')
      )
    if (activeFilter === 'City')
      return (
        location.includes('paris') ||
        location.includes('chicago') ||
        location.includes('tokyo')
      )
    if (activeFilter === 'Forest')
      return location.includes('forest') || location.includes('jungle')
    return true
  })
  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6 tracking-wide uppercase">
            Share Your Journey
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 tracking-tight leading-tight">
            Capture the world,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
              share the memory.
            </span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload your favorite travel moments and inspire others to explore.
            Join a community of wanderers sharing their stories one photo at a
            time.
          </p>

          <PhotoUpload />
        </div>
      </div>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-8 self-start px-2">
            Recent Adventures
          </h2>
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <PhotoGrid photos={filteredPhotos} onPhotoClick={handlePhotoClick} />
        </div>
      </main>
      {/* Photo Detail Modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdatePhoto={handleUpdatePhoto}
      />
    </div>
  )
}
