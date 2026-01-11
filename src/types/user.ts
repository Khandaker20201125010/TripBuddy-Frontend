/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/types/user.ts
export interface User {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  role?: string;
  status?: string;
  bio?: string | null;
  profileImage?: string;
  profileImageFileName?: string;
  interests?: string[]; // Changed to optional
  visitedCountries?: string[]; // Changed to optional
  rating?: number;
  premium?: boolean;
  subscriptionExpiresAt?: string | null;
  needPasswordChange?: boolean;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  city?: string;
  country?: string;
  timezone?: string;
  locationUpdatedAt?: string;
 
  // Add these lines:
  sentConnections?: { id: string; senderId: string; receiverId: string; status: string }[];
  receivedConnections?: { id: string; senderId: string; receiverId: string; status: string }[];
  connectionInfo?: {
    id: string;
    status: string;
    direction: 'sent' | 'received';
  };
  createdAt?: string;
  updatedAt?: string;
}

// Add UserProfile interface that extends User
export interface UserProfile extends User {
  travelPlans?: any[];
  joinedTrips?: any[];
  reviewsReceived?: any[];
  // Make required fields from User optional for UserProfile
  interests: string[]; // Make it required again
  visitedCountries: string[]; // Make it required again
  rating: number; // Make it required
}

