export const universities = [
  { id: 'univ-001', name: 'Stanford University', country: 'USA' },
  { id: 'univ-002', name: 'MIT', country: 'USA' },
  { id: 'univ-003', name: 'University of Oxford', country: 'UK' },
  { id: 'univ-004', name: 'ETH Zurich', country: 'Switzerland' },
  { id: 'univ-005', name: 'National University of Singapore', country: 'Singapore' },
  { id: 'univ-006', name: 'Tsinghua University', country: 'China' },
  { id: 'univ-007', name: 'University of Toronto', country: 'Canada' },
  { id: 'univ-008', name: 'University of Melbourne', country: 'Australia' }
];

export const conferences = [
  { id: 'conf-001', name: 'NeurIPS', year: 2023 },
  { id: 'conf-002', name: 'ICML', year: 2023 },
  { id: 'conf-003', name: 'CVPR', year: 2023 },
  { id: 'conf-004', name: 'ACL', year: 2023 },
  { id: 'conf-005', name: 'KDD', year: 2023 }
];

export const topics = [
  { id: 'topic-001', name: 'Graph Neural Networks' },
  { id: 'topic-002', name: 'Fraud Detection' },
  { id: 'topic-003', name: 'Natural Language Processing' },
  { id: 'topic-004', name: 'Computer Vision' },
  { id: 'topic-005', name: 'Reinforcement Learning' },
  { id: 'topic-006', name: 'Large Language Models' },
  { id: 'topic-007', name: 'Knowledge Graphs' },
  { id: 'topic-008', name: 'Recommendation Systems' },
  { id: 'topic-009', name: 'Data Mining' },
  { id: 'topic-010', name: 'Optimization' },
  { id: 'topic-011', name: 'Time Series Analysis' },
  { id: 'topic-012', name: 'Bioinformatics' },
  { id: 'topic-013', name: 'Robotics' },
  { id: 'topic-014', name: 'Computer Graphics' },
  { id: 'topic-015', name: 'Cybersecurity' },
  { id: 'topic-016', name: 'Quantum Computing' },
  { id: 'topic-017', name: 'Software Engineering' },
  { id: 'topic-018', name: 'Distributed Systems' },
  { id: 'topic-019', name: 'Human-Computer Interaction' },
  { id: 'topic-020', name: 'Information Retrieval' }
];

export const researchers = Array.from({ length: 45 }, (_, i) => ({
  id: `researcher-${(i + 1).toString().padStart(3, '0')}`,
  name: `Researcher ${i + 1}`,
  email: `researcher${i + 1}@example.com`,
  title: i % 3 === 0 ? 'Professor' : (i % 3 === 1 ? 'Postdoc' : 'PhD Student'),
  bio: `Research interests include various topics in computer science.`
}));

// Customize some specific researchers for conflicts
researchers[0].name = 'Dr. Priya Mehta'; // researcher-001
researchers[1].name = 'Dr. Rahul Singh'; // researcher-002
researchers[2].name = 'Dr. Alice Chen'; // researcher-003
researchers[3].name = 'Dr. Bob Smith'; // researcher-004

export const papers = Array.from({ length: 30 }, (_, i) => ({
  id: `paper-${(i + 1).toString().padStart(3, '0')}`,
  title: `Research Paper ${i + 1} on Advanced Topics`,
  abstract: `This paper explores various methods and algorithms related to paper ${i + 1}.`,
  year: 2020 + (i % 4),
  doi: `10.1234/paper.${i + 1}`
}));

// Relationships

export const researcherUniversity = researchers.map((r, i) => ({
  researcherId: r.id,
  universityId: universities[i % universities.length].id
}));

// Specifically force Same-University Conflict
// Paper author: researcher-003, Reviewer candidate: researcher-002
researcherUniversity[1].universityId = 'univ-001'; // Rahul (002) is at univ-001
researcherUniversity[2].universityId = 'univ-001'; // Alice (003) is at univ-001

export const researcherTopic = researchers.flatMap((r, i) => {
  const t1 = topics[i % topics.length].id;
  const t2 = topics[(i + 3) % topics.length].id;
  return [
    { researcherId: r.id, topicId: t1 },
    { researcherId: r.id, topicId: t2 }
  ];
});

// Force topic match for reviewer candidates
researcherTopic.push({ researcherId: 'researcher-001', topicId: 'topic-001' }); // Priya matches GNN
researcherTopic.push({ researcherId: 'researcher-002', topicId: 'topic-001' }); // Rahul matches GNN

export const paperTopic = papers.flatMap((p, i) => {
  const t1 = topics[i % topics.length].id;
  const t2 = topics[(i + 2) % topics.length].id;
  return [
    { paperId: p.id, topicId: t1 },
    { paperId: p.id, topicId: t2 }
  ];
});

// Target paper-001 topics
paperTopic.push({ paperId: 'paper-001', topicId: 'topic-001' });
paperTopic.push({ paperId: 'paper-001', topicId: 'topic-002' });


export const paperAuthor = papers.flatMap((p, i) => {
  const authors = [];
  authors.push({ paperId: p.id, researcherId: researchers[i % researchers.length].id });
  if (i % 2 === 0) {
    authors.push({ paperId: p.id, researcherId: researchers[(i + 5) % researchers.length].id });
  }
  return authors;
});

// Set Authors for target paper
paperAuthor.push({ paperId: 'paper-001', researcherId: 'researcher-003' }); // Alice is author of paper-001

// Setup Co-author conflict: Reviewer (Priya, 001) co-authored paper-002 with Author (Alice, 003)
paperAuthor.push({ paperId: 'paper-002', researcherId: 'researcher-001' });
paperAuthor.push({ paperId: 'paper-002', researcherId: 'researcher-003' });

export const advisorRelationships = [
  // Advisor Conflict: Bob (004) advised Alice (003)
  { advisorId: 'researcher-004', adviseeId: 'researcher-003' },
  { advisorId: 'researcher-010', adviseeId: 'researcher-011' },
  { advisorId: 'researcher-020', adviseeId: 'researcher-021' }
];
// Bob is also an expert in topic-001 to show up in candidates
researcherTopic.push({ researcherId: 'researcher-004', topicId: 'topic-001' });


export const paperCitations = papers.slice(5).map((p, i) => ({
  sourceId: p.id,
  targetId: papers[i % 5].id
}));

export const paperConference = papers.map((p, i) => ({
  paperId: p.id,
  conferenceId: conferences[i % conferences.length].id
}));
