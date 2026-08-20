import { getDriver } from '../db/driver';

export interface DashboardStats {
  papers: number;
  researchers: number;
  topics: number;
  universities: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (p:Paper)
      WITH count(p) as papers
      MATCH (r:Researcher)
      WITH papers, count(r) as researchers
      MATCH (t:Topic)
      WITH papers, researchers, count(t) as topics
      MATCH (u:University)
      RETURN papers, researchers, topics, count(u) as universities
    `);

    if (result.records.length === 0) {
      return { papers: 0, researchers: 0, topics: 0, universities: 0 };
    }

    const record = result.records[0];
    return {
      papers: record.get('papers').low,
      researchers: record.get('researchers').low,
      topics: record.get('topics').low,
      universities: record.get('universities').low,
    };
  } finally {
    await session.close();
  }
}
