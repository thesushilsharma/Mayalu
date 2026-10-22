import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

async function runSeedSql() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sqlPath = path.resolve('scripts/seed.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('⚡ Executing scripts/seed.sql against Neon PostgreSQL using Pool...');

  try {
    const client = await pool.connect();
    try {
      await client.query(sqlContent);
      console.log('✅ scripts/seed.sql executed successfully!');
    } finally {
      client.release();
    }

    const { rows } = await pool.query('SELECT count(*)::int as count FROM public.user_profiles');
    console.log(`📊 Total profiles in database: ${rows[0].count}`);
  } catch (err) {
    console.error('❌ Failed to execute seed SQL:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeedSql();
