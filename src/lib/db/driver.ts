import neo4j, { Driver } from 'neo4j-driver';

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error('Database connection details are missing from environment variables.');
}

// Prevent multiple driver instances in Next.js development hot-reloads
const globalForNeo4j = globalThis as unknown as {
  neo4jDriver: Driver | undefined;
};

export function getDriver(): Driver {
  if (!globalForNeo4j.neo4jDriver) {
    globalForNeo4j.neo4jDriver = neo4j.driver(
      uri as string,
      neo4j.auth.basic(username as string, password as string),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000 // 2 minutes
      }
    );
  }
  return globalForNeo4j.neo4jDriver;
}

export async function closeDriver(): Promise<void> {
  if (globalForNeo4j.neo4jDriver) {
    await globalForNeo4j.neo4jDriver.close();
    globalForNeo4j.neo4jDriver = undefined;
  }
}
