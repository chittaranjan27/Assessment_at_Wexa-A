import { findMatchingReviewers } from '../queries/reviewers';
import { detectConflicts } from '../queries/conflicts';
import { calculateSuitabilityScore } from '../scoring/reviewer-score';
import { ReviewerCandidate } from '../../types';

export async function getReviewerRecommendations(paperId: string): Promise<ReviewerCandidate[]> {
  // 1. Candidate discovery & Expertise matching
  const matchingCandidates = await findMatchingReviewers(paperId);

  const candidates: ReviewerCandidate[] = [];

  for (const match of matchingCandidates) {
    // 2. Suitability scoring
    const score = calculateSuitabilityScore(match.matchCount, match.matchingTopics);

    // 3. Conflict detection
    const conflicts = await detectConflicts(match.researcher.id, paperId);

    // 4. Eligibility filtering
    const eligible = conflicts.length === 0;

    // 5. Generate Explanation
    let explanation = '';
    if (eligible) {
      explanation = `Strong expertise overlap. Matches topics: ${match.matchingTopics.join(', ')}.`;
    } else {
      explanation = `Excluded due to conflicts. Highest severity: ${conflicts[0].severity}.`;
    }

    candidates.push({
      reviewer: match.researcher,
      score,
      matchingTopics: match.matchingTopics,
      eligible,
      conflicts,
      explanation
    });
  }

  // 6. Final ranking (Order by score descending)
  candidates.sort((a, b) => b.score - a.score);

  return candidates;
}
