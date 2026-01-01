import { User } from "./user";

export type TravelStatus = "upcoming" | "ongoing" | "completed";
export interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  image?: string | null;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  description?: string | null;
  visibility: boolean;
  status: TravelStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface TravelPlanFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  description?: string;
  visibility?: boolean;
  image?: File | string | null;
}
export interface Traveler {
  id: string;
  userId?: string;
  user?: User;
  name: string;
  handle: string;
  avatar: string;
  profileImage?: string;
  coverImage: string;
  bio: string;
  visitedCountries?: string[];
  interests: string[];
  role?: 'USER' | 'ADMIN';
  sentConnections?: { id: string; senderId: string; receiverId: string; status: string }[];
  receivedConnections?: { id: string; senderId: string; receiverId: string; status: string }[];
    connectionInfo?: {
    id: string;
    status: string;
    direction: 'sent' | 'received';
  };
  connectionStatus?: string | null;
  connectionDirection?: string | null;
  rating: number;
  online: boolean;
  verified: boolean;
  location: string;
  travelType: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
   status?: string;
}
