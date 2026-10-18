import neo4j from 'neo4j-driver';

async function inspect() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
    { maxConnectionPoolSize: 5 }
  );

  const database = process.env.NEO4J_DATABASE || 'e8cd6554';

  try {
    const counts = await driver.executeQuery(
      'MATCH (n) RETURN labels(n) AS labels, count(n) AS count',
      {},
      { database }
    );
    console.log('Nodes in database:', counts.records.map(r => ({
      labels: r.get('labels'),
      count: r.get('count').toNumber()
    })));

    const constraints = await driver.executeQuery(
      'SHOW CONSTRAINTS YIELD name, type, labelsOrTypes, properties RETURN name, type, labelsOrTypes, properties',
      {},
      { database }
    );
    console.log('Constraints:', constraints.records.map(r => ({
      name: r.get('name'),
      type: r.get('type'),
      labels: r.get('labelsOrTypes'),
      properties: r.get('properties')
    })));

    await driver.close();
  } catch (err) {
    console.error('Inspect error:', err);
    await driver.close();
  }
}

inspect();
