export interface Traveler {
  id: string
  name: string
  handle: string
  avatar: string
  location: string
  bio: string
  interests: string[]
  rating: number
  reviewCount: number
  verified: boolean
  online: boolean
  languages: string[]
  nextDestination?: string
  coverImage: string
}

export const travelers: Traveler[] = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    handle: '@elenawanders',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    location: 'Barcelona, Spain',
    bio: 'Digital nomad & photographer capturing hidden gems around Europe. Always looking for the best coffee spots.',
    interests: ['Photography', 'Coffee', 'Architecture', 'Hiking'],
    rating: 4.9,
    reviewCount: 124,
    verified: true,
    online: true,
    languages: ['English', 'Spanish', 'French'],
    nextDestination: 'Kyoto, Japan',
    coverImage:
      'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '2',
    name: 'Kenji Sato',
    handle: '@kenjitravels',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    location: 'Tokyo, Japan',
    bio: "Foodie traveler seeking the world's best street food. Local guide in Tokyo on weekends.",
    interests: ['Food', 'Culture', 'History', 'Nightlife'],
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    online: false,
    languages: ['Japanese', 'English'],
    nextDestination: 'Mexico City, Mexico',
    coverImage:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    handle: '@sarahj',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    location: 'London, UK',
    bio: 'Solo female traveler exploring South America. Love hiking and sustainable travel.',
    interests: ['Solo Travel', 'Hiking', 'Nature', 'Sustainability'],
    rating: 5.0,
    reviewCount: 42,
    verified: true,
    online: true,
    languages: ['English', 'German'],
    nextDestination: 'Patagonia, Chile',
    coverImage:
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '4',
    name: 'Marcus Chen',
    handle: '@marcus_c',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    location: 'Singapore',
    bio: 'Adventure seeker and scuba diver. Exploring the depths of the ocean one dive at a time.',
    interests: ['Diving', 'Adventure', 'Beaches', 'Luxury'],
    rating: 4.7,
    reviewCount: 56,
    verified: false,
    online: false,
    languages: ['English', 'Mandarin', 'Malay'],
    nextDestination: 'Raja Ampat, Indonesia',
    coverImage:
      'https://images.unsplash.com/photo-1544551763-46a42a457133?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '5',
    name: 'Amara Diallo',
    handle: '@amaratrips',
    avatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150',
    location: 'Dakar, Senegal',
    bio: 'Cultural explorer and musician. Connecting with locals through music and art.',
    interests: ['Music', 'Art', 'Culture', 'Festivals'],
    rating: 4.9,
    reviewCount: 15,
    verified: true,
    online: true,
    languages: ['French', 'Wolof', 'English'],
    nextDestination: 'New Orleans, USA',
    coverImage:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: '6',
    name: 'Lucas Silva',
    handle: '@lucas_brazil',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
    location: 'Rio de Janeiro, Brazil',
    bio: 'Surfer and van lifer. Chasing waves and good vibes along the coast.',
    interests: ['Surfing', 'Van Life', 'Camping', 'Beaches'],
    rating: 4.6,
    reviewCount: 34,
    verified: false,
    online: true,
    languages: ['Portuguese', 'English', 'Spanish'],
    nextDestination: 'Gold Coast, Australia',
    coverImage:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800&h=400',
  },
]

export const recommendedTravelers = [travelers[0], travelers[2], travelers[4]]
export const topRatedTravelers = [
  travelers[2],
  travelers[0],
  travelers[1],
  travelers[4],
]
export const recentlyActiveTravelers = [
  travelers[0],
  travelers[5],
  travelers[3],
]
