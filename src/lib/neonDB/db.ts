import "server-only";
import { Pool, neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Resolves the database connection string from DATABASE_URL.
 */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }
  return url;
}

/**
 * Optional HTTP client getter for serverless tagged template queries.
 * Ideal for lightweight single-statement queries without connection pooling overhead.
 */
export function getSql(): NeonQueryFunction<false, false> {
  return neon(getDatabaseUrl());
}

/**
 * Drizzle ORM Database Instance
 * Fully typed with application schemas and relations, powered by Neon HTTP driver.
 */
export const db = drizzle(getSql(), { schema });
export { schema };

/**
 * Neon WebSocket Connection Pool
 * Compatible with pg.Pool interface, supports stateful transactions and connection limits.
 */
export const pool = new Pool({
  connectionString: getDatabaseUrl(),
  max: 10, // reasonable connection limit for serverless / edge workloads
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Standard query parameter options.
 * Note: PostgreSQL uses $1, $2, $3 placeholders instead of MySQL's ?.
 */
export interface QueryOptions {
  query: string;
  values?: any[];
}

/**
 * Executes a single parameterized query using a pooled connection.
 * Automatically acquires and releases the connection back to the pool.
 *
 * @example
 * const users = await query({
 *   query: "SELECT * FROM public.user_profiles WHERE age >= $1 AND location = $2",
 *   values: [21, "Kathmandu 🇳🇵"]
 * });
 */
export async function query<T = any>({
  query: text,
  values = [],
}: QueryOptions): Promise<T[]> {
  try {
    const sql = getSql();
    const result = await sql.query(text, values);
    return result as T[];
  } catch (error) {
    console.error("Neon Postgres Query Error:", error);
    throw error;
  }
}

export interface QueryTransactionsOptions {
  queries: string[];
  values?: any[][];
}

/**
 * Executes a sequence of queries inside an atomic transaction.
 * If any query fails, automatically rolls back all changes and returns false.
 *
 * @example
 * const success = await queryTransactions({
 *   queries: [
 *     "UPDATE user_profiles SET super_likes = super_likes - $1 WHERE user_id = $2",
 *     "INSERT INTO user_transactions (user_id, amount, type) VALUES ($1, $2, $3)"
 *   ],
 *   values: [
 *     [1, "user-123"],
 *     ["user-123", 1, "super_like_spent"]
 *   ]
 * });
 */
export async function queryTransactions({
  queries,
  values = [],
}: QueryTransactionsOptions): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      const v = values[i] || [];
      await client.query(q, v);
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    console.error("Neon Postgres Transaction Error:", error);
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback Error:", rollbackErr);
    }
    return false;
  } finally {
    client.release();
  }
}

/**
 * Wraps an asynchronous callback in an interactive PostgreSQL transaction.
 * Automatically executes BEGIN, commits on success, rolls back on error,
 * and guarantees connection release back to the pool.
 *
 * @param fn - A callback that receives a connection-bound `connQuery` function.
 *
 * @example
 * const result = await withTransaction(async (connQuery) => {
 *   const sender = await connQuery({
 *     query: "UPDATE user_profiles SET super_likes = super_likes - $1 WHERE user_id = $2 RETURNING super_likes",
 *     values: [2, senderId]
 *   });
 *   if (!sender[0] || sender[0].super_likes < 0) {
 *     throw new Error("Insufficient Super Likes!"); // triggers automatic ROLLBACK
 *   }
 *   await connQuery({
 *     query: "UPDATE user_profiles SET super_likes = super_likes + $1 WHERE user_id = $2",
 *     values: [2, receiverId]
 *   });
 *   return sender[0];
 * });
 */
export async function withTransaction<T>(
  fn: (connQuery: <R = any>(options: QueryOptions) => Promise<R[]>) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Scoped query function bound strictly to this transaction client
    const connQuery = async <R = any>({
      query: text,
      values = [],
    }: QueryOptions): Promise<R[]> => {
      const result = await client.query(text, values);
      return result.rows as R[];
    };

    const result = await fn(connQuery);

    await client.query("COMMIT");
    return result;
  } catch (err) {
    console.error("withTransaction failed, rolling back:", err);
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    throw err;
  } finally {
    client.release();
  }
}

