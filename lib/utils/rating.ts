export function formatRating(rating: number): string {
  return rating === 0 ? "N/A" : rating.toString();
} 