import neo4j from 'neo4j-driver';

async function testQuery() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
  );
  const database = process.env.NEO4J_DATABASE || 'e8cd6554';

  const query = `
    CYPHER 25
    MATCH (u1:User {userId: $userId1})
    MATCH (u2:User {userId: $userId2})

    // 1. Shared Interests
    OPTIONAL MATCH (u1)-[r1:PASSIONATE_ABOUT]->(i:Interest)<-[r2:PASSIONATE_ABOUT]-(u2)
    WITH u1, u2, collect(DISTINCT {
      name: i.name,
      category: 'interest',
      group: i.category,
      weight1: coalesce(r1.weight, 0.8),
      weight2: coalesce(r2.weight, 0.8)
    }) AS rawInterests

    // Filter out null matches if no shared interests
    WITH u1, u2, [item IN rawInterests WHERE item.name IS NOT NULL] AS sharedInterests

    // 2. Shared Values
    OPTIONAL MATCH (u1)-[rv1:EMBODIES]->(v:Value)<-[rv2:EMBODIES]-(u2)
    WITH u1, u2, sharedInterests, collect(DISTINCT {
      name: v.name,
      category: 'value',
      group: v.category,
      weight1: coalesce(rv1.importance, 0.9),
      weight2: coalesce(rv2.importance, 0.9)
    }) AS rawValues
    WITH u1, u2, sharedInterests, [item IN rawValues WHERE item.name IS NOT NULL] AS sharedValues

    // 3. Shared Lifestyles
    OPTIONAL MATCH (u1)-[:PRACTICES]->(l:Lifestyle)<-[:PRACTICES]-(u2)
    WITH u1, u2, sharedInterests, sharedValues, collect(DISTINCT {
      name: l.name,
      category: 'lifestyle',
      group: l.type
    }) AS rawLifestyles
    WITH u1, u2, sharedInterests, sharedValues, [item IN rawLifestyles WHERE item.name IS NOT NULL] AS sharedLifestyles

    // 4. Graph Learning history
    OPTIONAL MATCH (u1)-[m:MATCHED_WITH]-(u2)
    OPTIONAL MATCH (u1)-[ch:CHATTED_WITH]-(u2)

    RETURN
      u1.userId AS user1Id,
      u1.firstName AS user1Name,
      u2.userId AS user2Id,
      u2.firstName AS user2Name,
      sharedInterests,
      sharedValues,
      sharedLifestyles,
      m.harmonyIndex AS harmonyIndex,
      coalesce(ch.messageCount, 0) AS chatCount
  `;

  try {
    const result = await driver.executeQuery(
      query,
      { userId1: 'demo_user_you', userId2: 'demo_user_match' },
      { database }
    );
    console.log('QueryResult:', JSON.stringify(result.records[0].toObject(), null, 2));
  } catch (err) {
    console.error('Test query error:', err);
  } finally {
    await driver.close();
  }
}

testQuery();
