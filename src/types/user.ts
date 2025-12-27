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
  interests: string[];
  visitedCountries: string[];
  rating: number;
  premium: boolean;
  subscriptionExpiresAt?: string | null;
  needPasswordChange?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Add these lines:
    sentConnections?: { id: string; senderId: string; receiverId: string; status: string }[];
  receivedConnections?: { id: string; senderId: string; receiverId: string; status: string }[];
  connectionInfo?: {
    id: string;
    status: string;
    direction: 'sent' | 'received';
  };
}