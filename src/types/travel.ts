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
