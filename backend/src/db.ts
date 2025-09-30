import { Pool } from 'pg';

// Debug logging for ECS
console.log('Database connection config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS ? '***' : 'undefined',
  port: process.env.DB_PORT,
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

export default pool;

// Test connectivity on startup (non-blocking)
(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    console.log('Database connected successfully!');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();
