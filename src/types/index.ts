export interface Researcher {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  year: number;
  doi: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
}

export interface Conference {
  id: string;
  name: string;
  year: number;
}

export interface PaperDetails extends Paper {
  authors: Researcher[];
  topics: Topic[];
  conference: Conference | null;
}

export interface Conflict {
  type: 'CO_AUTHOR' | 'SAME_UNIVERSITY' | 'ADVISOR';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NONE';
  explanation: string;
  relatedResearcher?: Researcher;
  sharedPaper?: Paper;
  university?: University;
}

export interface ReviewerCandidate {
  reviewer: Researcher;
  score: number;
  matchingTopics: string[];
  eligible: boolean;
  conflicts: Conflict[];
  explanation: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphRelationship {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}
