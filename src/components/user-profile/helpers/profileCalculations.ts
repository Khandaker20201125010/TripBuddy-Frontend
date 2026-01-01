/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculateTravelScore = (countries: number, trips: number): number => {
  return Math.min(100, Math.round(countries * 10 + trips * 5));
};

export const getUpcomingTrips = (trips: any[]) => {
  return trips.filter((p: any) => new Date(p.endDate) > new Date());
};

export const getPastTrips = (trips: any[]) => {
  return trips.filter((p: any) => new Date(p.endDate) <= new Date());
};

export const calculateAverageRating = (reviews: any[]): number => {
  if (reviews.length === 0) return 0;
  return reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length;
};

export const getProgressPercentage = (current: number, total: number): number => {
  return Math.round((current / total) * 100);
};

export const getProfileStats = (profile: any) => {
  const safePlans = profile?.travelPlans || [];
  const safeCountries = profile?.visitedCountries || [];
  const safeReviews = profile?.reviewsReceived || [];
  const safeInterests = profile?.interests || [];
  const connections = profile?.connections || [];

  const upcomingTrips = getUpcomingTrips(safePlans);
  const pastTrips = getPastTrips(safePlans);
  const averageRating = calculateAverageRating(safeReviews);
  const travelScore = calculateTravelScore(safeCountries.length, safePlans.length);

  return {
    totalTrips: safePlans.length,
    upcomingTrips: upcomingTrips.length,
    pastTrips: pastTrips.length,
    countriesVisited: safeCountries.length,
    averageRating,
    totalReviews: safeReviews.length,
    travelScore,
    interestsCount: safeInterests.length,
    connectionsCount: connections.length,
    profileCompletion: Math.round((safeInterests.length / 20) * 100)
  };
};