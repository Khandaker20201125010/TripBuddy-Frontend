export type TravelStatus = 'upcoming' | 'ongoing' | 'completed';

export function getPlanStatus(
  startDate: string | Date,
  endDate: string | Date
): TravelStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'ongoing';
}
