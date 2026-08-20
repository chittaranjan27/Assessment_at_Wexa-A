import { getDriver } from '../db/driver';
import { Conflict, Researcher, Paper, University } from '../../types';

export async function detectConflicts(reviewerId: string, paperId: string): Promise<Conflict[]> {
  const driver = getDriver();
  const session = driver.session();
  const conflicts: Conflict[] = [];

  try {
    // 1. Co-author conflict
    const coAuthorResult = await session.run(`
      MATCH (reviewer:Researcher {id: $reviewerId})-[:AUTHORED]->(sharedPaper:Paper)<-[:AUTHORED]-(author:Researcher)-[:AUTHORED]->(targetPaper:Paper {id: $paperId})
      WHERE reviewer.id <> author.id
      RETURN author, sharedPaper
    `, { reviewerId, paperId });

    if (coAuthorResult.records.length > 0) {
      coAuthorResult.records.forEach(record => {
        conflicts.push({
          type: 'CO_AUTHOR',
          severity: 'CRITICAL',
          explanation: 'Reviewer has co-authored a paper with one of the authors of the submitted paper.',
          relatedResearcher: record.get('author').properties as Researcher,
          sharedPaper: record.get('sharedPaper').properties as Paper
        });
      });
    }

    // 2. Same-university conflict
    const universityResult = await session.run(`
      MATCH (reviewer:Researcher {id: $reviewerId})-[:AFFILIATED_WITH]->(u:University)<-[:AFFILIATED_WITH]-(author:Researcher)-[:AUTHORED]->(targetPaper:Paper {id: $paperId})
      WHERE reviewer.id <> author.id
      RETURN author, u as university
    `, { reviewerId, paperId });

    if (universityResult.records.length > 0) {
      universityResult.records.forEach(record => {
        conflicts.push({
          type: 'SAME_UNIVERSITY',
          severity: 'HIGH',
          explanation: 'Reviewer and paper author are affiliated with the same university.',
          relatedResearcher: record.get('author').properties as Researcher,
          university: record.get('university').properties as University
        });
      });
    }

    // 3. Advisor conflict (Either direction)
    const advisorResult = await session.run(`
      MATCH (reviewer:Researcher {id: $reviewerId})
      MATCH (author:Researcher)-[:AUTHORED]->(targetPaper:Paper {id: $paperId})
      WHERE (reviewer)-[:ADVISED_BY]->(author) OR (author)-[:ADVISED_BY]->(reviewer)
      RETURN author
    `, { reviewerId, paperId });

    if (advisorResult.records.length > 0) {
      advisorResult.records.forEach(record => {
        conflicts.push({
          type: 'ADVISOR',
          severity: 'CRITICAL',
          explanation: 'There is a direct advisor/advisee relationship between the reviewer and paper author.',
          relatedResearcher: record.get('author').properties as Researcher
        });
      });
    }

    return conflicts;
  } finally {
    await session.close();
  }
}
