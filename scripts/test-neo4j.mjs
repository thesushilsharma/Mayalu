import neo4j from 'neo4j-driver';

async function testWithDatabase(databaseName) {
  console.log(`\nTesting with user: e8cd6554, database: ${JSON.stringify(databaseName)}...`);
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
    { maxConnectionPoolSize: 5 }
  );

  try {
    const queryConfig = databaseName ? { database: databaseName } : {};
    const { records } = await driver.executeQuery(
      'RETURN "Namaste Mayalu Neo4j Knowledge Graph!" AS greeting, datetime() AS now',
      {},
      queryConfig
    );
    console.log('🎉 SUCCESS! Query result:', records[0].get('greeting'), records[0].get('now').toString());

    // Let's also check current database name if possible
    try {
      const dbResult = await driver.executeQuery('SHOW DATABASES', {}, queryConfig);
      console.log('Databases found:', dbResult.records.map(r => r.get('name')));
    } catch (e) {
      console.log('SHOW DATABASES not allowed or failed:', e.message);
    }

    await driver.close();
    return true;
  } catch (err) {
    console.error(`❌ Failed with db=${databaseName}:`, err.message);
    await driver.close();
    return false;
  }
}

async function main() {
  // Test with undefined (default database on Aura)
  let ok = await testWithDatabase(undefined);
  if (!ok) {
    // Test with instance ID database
    await testWithDatabase(process.env.NEO4J_USERNAME);
  }
}

main();
