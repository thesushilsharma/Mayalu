import neo4j from 'neo4j-driver';

const SCHEMA_STATEMENTS = [
  // 1. Constraints (Idempotent with IF NOT EXISTS)
  'CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.userId IS UNIQUE',
  'CREATE CONSTRAINT interest_name_unique IF NOT EXISTS FOR (i:Interest) REQUIRE i.name IS UNIQUE',
  'CREATE CONSTRAINT value_name_unique IF NOT EXISTS FOR (v:Value) REQUIRE v.name IS UNIQUE',
  'CREATE CONSTRAINT lifestyle_name_unique IF NOT EXISTS FOR (l:Lifestyle) REQUIRE l.name IS UNIQUE',
  'CREATE CONSTRAINT heritage_name_unique IF NOT EXISTS FOR (c:CulturalHeritage) REQUIRE c.name IS UNIQUE',
  'CREATE CONSTRAINT dealbreaker_name_unique IF NOT EXISTS FOR (d:Dealbreaker) REQUIRE d.name IS UNIQUE',

  // 2. Indexes for fast discovery & filtering
  'CREATE INDEX user_location_idx IF NOT EXISTS FOR (u:User) ON (u.location)',
  'CREATE INDEX user_gender_idx IF NOT EXISTS FOR (u:User) ON (u.gender)'
];

async function setupSchema() {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_DATABASE || 'e8cd6554';

  console.log(`Connecting to ${uri} as ${username} on db ${database}...`);
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionPoolSize: 5,
    disableLosslessIntegers: true
  });

  try {
    for (const stmt of SCHEMA_STATEMENTS) {
      console.log(`Executing: ${stmt}`);
      await driver.executeQuery(stmt, {}, { database });
    }
    console.log('✅ All Neo4j constraints & indexes successfully created and verified!');
  } catch (err) {
    console.error('❌ Schema setup error:', err);
  } finally {
    await driver.close();
  }
}

setupSchema();
