export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  interests: string[];
  visitedCountries: string[];
  rating: number;
  premium: boolean;
}
