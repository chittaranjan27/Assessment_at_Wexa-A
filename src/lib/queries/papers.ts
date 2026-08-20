import { getDriver } from '../db/driver';
import { PaperDetails, Paper, Researcher, Topic, Conference } from '../../types';

export async function getPaperDetails(paperId: string): Promise<PaperDetails | null> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (p:Paper {id: $paperId})
      OPTIONAL MATCH (a:Researcher)-[:AUTHORED]->(p)
      OPTIONAL MATCH (p)-[:HAS_TOPIC]->(t:Topic)
      OPTIONAL MATCH (p)-[:SUBMITTED_TO]->(c:Conference)
      RETURN p, collect(DISTINCT a) as authors, collect(DISTINCT t) as topics, c as conference
    `, { paperId });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const paperNode = record.get('p').properties as Paper;
    
    // Nodes might be null if there are no authors/topics/conferences due to OPTIONAL MATCH
    const authorsNodes = record.get('authors') || [];
    const authors = authorsNodes
      .filter((n: any) => n !== null)
      .map((n: any) => n.properties as Researcher);
      
    const topicsNodes = record.get('topics') || [];
    const topics = topicsNodes
      .filter((n: any) => n !== null)
      .map((n: any) => n.properties as Topic);

    const confNode = record.get('conference');
    const conference = confNode ? confNode.properties as Conference : null;

    return {
      ...paperNode,
      authors,
      topics,
      conference
    };
  } finally {
    await session.close();
  }
}

export async function getAllPapers(): Promise<Paper[]> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (p:Paper)
      RETURN p
      ORDER BY p.year DESC, p.title ASC
    `);

    return result.records.map(record => record.get('p').properties as Paper);
  } finally {
    await session.close();
  }
}
