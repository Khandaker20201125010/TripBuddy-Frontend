export interface Photo {
  id: string
  url: string
  tripName: string
  location: string
  date: string
  likes: number
  isLiked: boolean
  photographer: string
  photographerAvatar: string
  aspectRatio: 'portrait' | 'landscape' | 'square'
  comments: PhotoComment[]
  shares: number
  caption: string
  timestamp: string
}
export interface PhotoComment {
  id: string
  photoId: string
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  likes: number
}

export type FilterType = 'All' | 'Beach' | 'City' | 'Mountain' | 'Forest'
