import { User } from "./user";

export type TravelStatus = "upcoming" | "ongoing" | "completed";
export interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  image?: string;
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
  image?: File; 
}
export interface Traveler {
  id: string;
  userId?: string;
  name: string;
  handle: string;
  avatar: string;
  profileImage?: string;
  coverImage: string;
  bio: string;
  visitedCountries?: string[];
  interests: string[];
  role?: 'USER' | 'ADMIN';
  sentConnections?: { status: string }[];
  receivedConnections?: { status: string }[];
  rating: number;
  online: boolean;
  verified: boolean;
  location: string;
  travelType: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}