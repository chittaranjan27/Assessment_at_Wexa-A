import { getDriver } from '../db/driver';
import { Researcher } from '../../types';

export interface MatchingReviewerResult {
  researcher: Researcher;
  matchingTopics: string[];
  matchCount: number;
}

export async function findMatchingReviewers(paperId: string): Promise<MatchingReviewerResult[]> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (p:Paper {id: $paperId})-[:HAS_TOPIC]->(t:Topic)<-[:EXPERT_IN]-(r:Researcher)
      // Exclude authors of the paper from being reviewers
      WHERE NOT (r)-[:AUTHORED]->(p)
      RETURN r as researcher, collect(DISTINCT t.name) as matchingTopics, count(DISTINCT t) as matchCount
      ORDER BY matchCount DESC
    `, { paperId });

    return result.records.map(record => ({
      researcher: record.get('researcher').properties as Researcher,
      matchingTopics: record.get('matchingTopics'),
      matchCount: record.get('matchCount').low
    }));
  } finally {
    await session.close();
  }
}
