import { getDriver } from '../db/driver';
import { GraphData, GraphNode, GraphRelationship } from '../../types';

export async function getRelationshipGraph(paperId: string, reviewerId: string): Promise<GraphData> {
  const driver = getDriver();
  const session = driver.session();

  try {
    // We want to find paths up to 3 hops between the reviewer and the paper
    // or paths from reviewer to paper authors.
    const result = await session.run(`
      MATCH path = shortestPath((reviewer:Researcher {id: $reviewerId})-[*1..4]-(targetPaper:Paper {id: $paperId}))
      RETURN path
      UNION
      MATCH (author:Researcher)-[:AUTHORED]->(targetPaper:Paper {id: $paperId})
      MATCH path = shortestPath((reviewer:Researcher {id: $reviewerId})-[*1..3]-(author))
      WHERE reviewer.id <> author.id
      RETURN path
    `, { paperId, reviewerId });

    const nodesMap = new Map<string, GraphNode>();
    const relationshipsMap = new Map<string, GraphRelationship>();

    result.records.forEach(record => {
      const path = record.get('path');
      if (path) {
        path.segments.forEach((segment: any) => {
          const start = segment.start;
          const end = segment.end;
          const relationship = segment.relationship;

          if (!nodesMap.has(start.identity.toString())) {
            nodesMap.set(start.identity.toString(), {
              id: start.properties.id,
              label: start.properties.name || start.properties.title || start.properties.id,
              type: start.labels[0]
            });
          }

          if (!nodesMap.has(end.identity.toString())) {
            nodesMap.set(end.identity.toString(), {
              id: end.properties.id,
              label: end.properties.name || end.properties.title || end.properties.id,
              type: end.labels[0]
            });
          }

          const relId = relationship.identity.toString();
          if (!relationshipsMap.has(relId)) {
            relationshipsMap.set(relId, {
              source: start.properties.id,
              target: end.properties.id,
              type: relationship.type
            });
          }
        });
      }
    });

    return {
      nodes: Array.from(nodesMap.values()),
      relationships: Array.from(relationshipsMap.values())
    };
  } finally {
    await session.close();
  }
}
