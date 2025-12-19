export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;  // From API
  status?: string; // From API
  bio?: string | null; // From API
  profileImage?: string;
  profileImageFileName?: string; // From API
  interests: string[];
  visitedCountries: string[];
  rating: number;
  premium: boolean;
  subscriptionExpiresAt?: string | null; // From API
  needPasswordChange?: boolean; // From API
  createdAt?: string; // From API
  updatedAt?: string; // From API
}