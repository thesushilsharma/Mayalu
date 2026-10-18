import neo4j from 'neo4j-driver';

const INTERESTS = [
  { name: 'Himalayan Treks', category: 'Outdoors & Adventure' },
  { name: 'Specialty Coffee', category: 'Culinary & Chai' },
  { name: 'Indie Cinema', category: 'Arts & Culture' },
  { name: 'Momo Crawls', category: 'Culinary & Chai' },
  { name: 'Acoustic Pop', category: 'Music & Sound' },
  { name: 'Morning Chiya', category: 'Culinary & Chai' },
  { name: 'Photography', category: 'Arts & Culture' },
  { name: 'Bouldering', category: 'Outdoors & Adventure' },
  { name: 'Meditation & Mindfulness', category: 'Wellness' },
  { name: 'Nepali Literature', category: 'Arts & Culture' },
  { name: 'Tech Innovation', category: 'Intellectual' }
];

const VALUES = [
  { name: 'Mutual Empathy', category: 'Emotional' },
  { name: 'Shared Growth', category: 'Philosophical' },
  { name: 'Family First', category: 'Cultural & Family' },
  { name: 'Radical Honesty', category: 'Interpersonal' },
  { name: 'Emotional Intelligence', category: 'Emotional' },
  { name: 'Spiritual Depth', category: 'Spiritual' },
  { name: 'Financial Responsibility', category: 'Practical' }
];

const LIFESTYLES = [
  { name: 'Daily Dal Bhat', type: 'Dietary & Habit' },
  { name: 'Weekend Trekker', type: 'Recreation' },
  { name: 'Remote Nomad', type: 'Workstyle' },
  { name: 'Early Morning Riser', type: 'Daily Rhythm' }
];

const HERITAGES = [
  { name: 'Kathmandu Valley', type: 'region' },
  { name: 'Pokhara', type: 'region' },
  { name: 'Kashyap', type: 'gotra' },
  { name: 'Newar', type: 'culture' },
  { name: 'Chhetri', type: 'culture' }
];

async function seedGraph() {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_DATABASE || 'e8cd6554';

  console.log(`Connecting to Neo4j...`);
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionPoolSize: 5,
    disableLosslessIntegers: true
  });

  try {
    // 1. Seed Interests (using UNWIND as per neo4j-driver-javascript-skill)
    console.log('Seeding Interests...');
    await driver.executeQuery(
      `UNWIND $interests AS item
       MERGE (i:Interest {name: item.name})
       SET i.category = item.category`,
      { interests: INTERESTS },
      { database }
    );

    // 2. Seed Values
    console.log('Seeding Values...');
    await driver.executeQuery(
      `UNWIND $values AS item
       MERGE (v:Value {name: item.name})
       SET v.category = item.category`,
      { values: VALUES },
      { database }
    );

    // 3. Seed Lifestyles
    console.log('Seeding Lifestyles...');
    await driver.executeQuery(
      `UNWIND $lifestyles AS item
       MERGE (l:Lifestyle {name: item.name})
       SET l.type = item.type`,
      { lifestyles: LIFESTYLES },
      { database }
    );

    // 4. Seed Cultural Heritage
    console.log('Seeding Heritage...');
    await driver.executeQuery(
      `UNWIND $heritages AS item
       MERGE (c:CulturalHeritage {name: item.name})
       SET c.type = item.type`,
      { heritages: HERITAGES },
      { database }
    );

    // 5. Seed Core Matching Showcase Users: "demo_current_user" (You) and "demo_top_match" (Your Match)
    console.log('Seeding Demo Users and Bridge Relationships...');
    await driver.executeQuery(
      `
      MERGE (u1:User {userId: 'demo_user_you'})
      SET u1.firstName = 'You',
          u1.age = 26,
          u1.gender = 'Non-binary',
          u1.location = 'Kathmandu / Remote',
          u1.bio = 'Designer & tech nomad passionate about Himalayan trails, slow mornings, and deep conversation.',
          u1.relationshipIntent = 'Long-term partnership',
          u1.dalBhatFrequency = 'Daily (Power of 24 Hours)',
          u1.updatedAt = datetime()

      MERGE (u2:User {userId: 'demo_user_match'})
      SET u2.firstName = 'Ananya',
          u2.matchLabel = 'Your Match',
          u2.age = 25,
          u2.gender = 'Female',
          u2.location = 'Pokhara / Lakeside',
          u2.bio = 'Architect who loves third-wave espresso, indie film screenings, and Annapurna circuit treks.',
          u2.relationshipIntent = 'Long-term partnership',
          u2.dalBhatFrequency = 'Daily (Power of 24 Hours)',
          u2.updatedAt = datetime()

      // Connect You (u1) to bridge interests and values with weights
      WITH u1, u2
      MATCH (i1:Interest {name: 'Himalayan Treks'})
      MATCH (i2:Interest {name: 'Specialty Coffee'})
      MATCH (i3:Interest {name: 'Indie Cinema'})
      MATCH (v1:Value {name: 'Mutual Empathy'})
      MATCH (v2:Value {name: 'Shared Growth'})
      MATCH (l1:Lifestyle {name: 'Daily Dal Bhat'})

      MERGE (u1)-[r1:PASSIONATE_ABOUT]->(i1) SET r1.weight = 0.95, r1.affinity = 0.98
      MERGE (u1)-[r2:PASSIONATE_ABOUT]->(i2) SET r2.weight = 0.90, r2.affinity = 0.92
      MERGE (u1)-[r3:PASSIONATE_ABOUT]->(i3) SET r3.weight = 0.88, r3.affinity = 0.85
      MERGE (u1)-[rv1:EMBODIES]->(v1) SET rv1.importance = 0.96, rv1.alignment = 0.99
      MERGE (u1)-[rv2:EMBODIES]->(v2) SET rv2.importance = 0.94, rv2.alignment = 0.97
      MERGE (u1)-[rl1:PRACTICES]->(l1)

      // Connect Your Match (u2) to the exact same bridge nodes
      MERGE (u2)-[r4:PASSIONATE_ABOUT]->(i1) SET r4.weight = 0.98, r4.affinity = 0.99
      MERGE (u2)-[r5:PASSIONATE_ABOUT]->(i2) SET r5.weight = 0.92, r5.affinity = 0.94
      MERGE (u2)-[r6:PASSIONATE_ABOUT]->(i3) SET r6.weight = 0.85, r6.affinity = 0.89
      MERGE (u2)-[rv3:EMBODIES]->(v1) SET rv3.importance = 0.95, rv3.alignment = 0.98
      MERGE (u2)-[rv4:EMBODIES]->(v2) SET rv4.importance = 0.96, rv4.alignment = 0.96
      MERGE (u2)-[rl2:PRACTICES]->(l1)

      // Continuous Graph Learning: Record positive engagement and interaction topology
      MERGE (u1)-[sw:SWIPED_RIGHT]->(u2)
      SET sw.timestamp = datetime(), sw.compatibilityScore = 0.964

      MERGE (u1)-[m:MATCHED_WITH]->(u2)
      SET m.harmonyIndex = 0.964,
          m.commonInterests = 3,
          m.commonValues = 2,
          m.commonClusters = ['Himalayan Treks', 'Specialty Coffee', 'Indie Cinema', 'Mutual Empathy', 'Shared Growth'],
          m.updatedAt = datetime()
      `,
      {},
      { database }
    );

    console.log('✅ Neo4j Knowledge Graph successfully seeded with rich nodes, bridge edges, and learning interactions!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await driver.close();
  }
}

seedGraph();
