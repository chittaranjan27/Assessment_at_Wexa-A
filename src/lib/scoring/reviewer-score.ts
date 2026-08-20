export function calculateSuitabilityScore(matchCount: number, matchingTopics: string[]): number {
  // Simple scoring model for demonstration
  // Base score from number of matching topics (e.g., 20 points per topic)
  let score = matchCount * 20;

  // Capping at 95 to allow for other potential signals in a real system
  if (score > 95) score = 95;
  if (score < 10) score = 10;

  // In a real application, you might add weight to specific topics,
  // recency of publications, or citation count.
  return score;
}
