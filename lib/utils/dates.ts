/**
 * Calculate countdown to a future date
 * @param raceDate Target date to count down to
 * @returns Formatted countdown string (e.g., "3d 4h 30m")
 */
export function calculateCountdown(raceDate: Date): string {
  const now = new Date();
  const diff = raceDate.getTime() - now.getTime();
  
  if (diff < 0) return 'Race completed';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m`;
}