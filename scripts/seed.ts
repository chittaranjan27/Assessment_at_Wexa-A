import { config } from 'dotenv';
import neo4j, { Driver } from 'neo4j-driver';
import {
  universities,
  conferences,
  topics,
  researchers,
  papers,
  researcherUniversity,
  researcherTopic,
  paperTopic,
  paperAuthor,
  advisorRelationships,
  paperCitations,
  paperConference
} from '../data/seed-data';

// Load environment variables from .env
config();

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  console.error('Database connection details are missing from environment variables.');
  process.exit(1);
}

const driver: Driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

async function runSeed() {
  const session = driver.session();
  console.log('Connecting to CognoDB...');
  
  try {
    // 1. Verify connection
    await session.run('RETURN 1');
    console.log('Connection verified.');

    // 2. Clear existing data
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');

    // 3. Create Constraints (optional, may not be fully supported on all Neo4j versions, wrapped in try-catch)
    console.log('Creating constraints...');
    const constraints = [
      'CREATE CONSTRAINT researcher_id IF NOT EXISTS FOR (r:Researcher) REQUIRE r.id IS UNIQUE',
      'CREATE CONSTRAINT paper_id IF NOT EXISTS FOR (p:Paper) REQUIRE p.id IS UNIQUE',
      'CREATE CONSTRAINT topic_id IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE',
      'CREATE CONSTRAINT university_id IF NOT EXISTS FOR (u:University) REQUIRE u.id IS UNIQUE',
      'CREATE CONSTRAINT conference_id IF NOT EXISTS FOR (c:Conference) REQUIRE c.id IS UNIQUE',
    ];
    for (const query of constraints) {
      try {
        await session.run(query);
      } catch (e) {
        console.warn('Constraint creation skipped or failed:', (e as Error).message);
      }
    }

    // 4. Create Nodes
    console.log('Creating Universities...');
    for (const u of universities) {
      await session.run('CREATE (n:University {id: $id, name: $name, country: $country})', u);
    }

    console.log('Creating Conferences...');
    for (const c of conferences) {
      await session.run('CREATE (n:Conference {id: $id, name: $name, year: $year})', c);
    }

    console.log('Creating Topics...');
    for (const t of topics) {
      await session.run('CREATE (n:Topic {id: $id, name: $name})', t);
    }

    console.log('Creating Researchers...');
    for (const r of researchers) {
      await session.run('CREATE (n:Researcher {id: $id, name: $name, email: $email, title: $title, bio: $bio})', r);
    }

    console.log('Creating Papers...');
    for (const p of papers) {
      await session.run('CREATE (n:Paper {id: $id, title: $title, abstract: $abstract, year: $year, doi: $doi})', p);
    }

    // 5. Create Relationships
    console.log('Creating Relationships...');

    // Researcher -AFFILIATED_WITH-> University
    for (const ru of researcherUniversity) {
      await session.run(`
        MATCH (r:Researcher {id: $researcherId}), (u:University {id: $universityId})
        MERGE (r)-[:AFFILIATED_WITH]->(u)
      `, ru);
    }

    // Researcher -EXPERT_IN-> Topic
    for (const rt of researcherTopic) {
      await session.run(`
        MATCH (r:Researcher {id: $researcherId}), (t:Topic {id: $topicId})
        MERGE (r)-[:EXPERT_IN]->(t)
      `, rt);
    }

    // Paper -HAS_TOPIC-> Topic
    for (const pt of paperTopic) {
      await session.run(`
        MATCH (p:Paper {id: $paperId}), (t:Topic {id: $topicId})
        MERGE (p)-[:HAS_TOPIC]->(t)
      `, pt);
    }

    // Researcher -AUTHORED-> Paper
    for (const pa of paperAuthor) {
      await session.run(`
        MATCH (r:Researcher {id: $researcherId}), (p:Paper {id: $paperId})
        MERGE (r)-[:AUTHORED]->(p)
      `, pa);
    }

    // Researcher -ADVISED_BY-> Researcher (Wait, requirement says advisor/advisee. ADVISED_BY implies Advisee -> Advisor)
    for (const ar of advisorRelationships) {
      await session.run(`
        MATCH (advisee:Researcher {id: $adviseeId}), (advisor:Researcher {id: $advisorId})
        MERGE (advisee)-[:ADVISED_BY]->(advisor)
      `, ar);
    }

    // Paper -CITES-> Paper
    for (const pc of paperCitations) {
      await session.run(`
        MATCH (source:Paper {id: $sourceId}), (target:Paper {id: $targetId})
        MERGE (source)-[:CITES]->(target)
      `, pc);
    }

    // Paper -SUBMITTED_TO-> Conference
    for (const pconf of paperConference) {
      await session.run(`
        MATCH (p:Paper {id: $paperId}), (c:Conference {id: $conferenceId})
        MERGE (p)-[:SUBMITTED_TO]->(c)
      `, pconf);
    }

    // 6. Verify counts
    console.log('Verifying data...');
    const nodeCount = await session.run('MATCH (n) RETURN count(n) as count');
    const relCount = await session.run('MATCH ()-[r]->() RETURN count(r) as count');
    
    console.log(`Seed complete: ${nodeCount.records[0].get('count').low} nodes and ${relCount.records[0].get('count').low} relationships created.`);

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

runSeed();
