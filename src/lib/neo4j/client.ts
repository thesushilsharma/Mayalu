import neo4j, { Driver } from "neo4j-driver";

declare global {
  // eslint-disable-next-line no-var
  var __neo4jDriver: Driver | undefined;
}

const URI = process.env.NEO4J_URI || "neo4j+s://e8cd6554.databases.neo4j.io";
const USERNAME = process.env.NEO4J_USERNAME || "e8cd6554";
const PASSWORD = process.env.NEO4J_PASSWORD || "";
export const DEFAULT_NEO4J_DATABASE = process.env.NEO4J_DATABASE || "e8cd6554";

/**
 * Singleton Neo4j Driver instance for Next.js App Router.
 * Configured per neo4j-driver-javascript-skill:
 * - Connection pooling limited for serverless
 * - disableLosslessIntegers enabled for clean JS number JSON serialization
 */
export function getNeo4jDriver(): Driver {
  if (process.env.NODE_ENV === "production") {
    return neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD), {
      maxConnectionPoolSize: 10,
      disableLosslessIntegers: true,
    });
  }

  // Prevent multiple driver instances during development hot-reloads
  if (!globalThis.__neo4jDriver) {
    globalThis.__neo4jDriver = neo4j.driver(
      URI,
      neo4j.auth.basic(USERNAME, PASSWORD),
      {
        maxConnectionPoolSize: 10,
        disableLosslessIntegers: true,
      }
    );
  }

  return globalThis.__neo4jDriver;
}

export const Neo4jInstance = getNeo4jDriver();

/**
 * Verify driver connectivity fast on startup / health checks
 */
export async function verifyNeo4jConnectivity(): Promise<boolean> {
  try {
    const driver = getNeo4jDriver();
    await driver.verifyConnectivity();
    return true;
  } catch (error) {
    console.warn("⚠️ Neo4j connectivity warning:", error);
    return false;
  }
}

/**
 * Safe Cypher Query execution with parameterized inputs and default database
 */
export async function executeCypher<T = any>(
  query: string,
  parameters: Record<string, any> = {},
  database: string = DEFAULT_NEO4J_DATABASE
) {
  const driver = getNeo4jDriver();
  return driver.executeQuery(query, parameters, { database });
}
