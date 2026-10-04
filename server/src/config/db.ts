import { Pool, PoolConfig } from 'pg';

const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres_secure_dev_password',
  database: process.env.DB_NAME || 'fullstack_db',
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '5000', 10),
};

export const pool = new Pool(dbConfig);

// Log pool errors
pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]:', err.message);
});

// Helper for queries with execution duration logging
export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SQL Query] duration=${duration}ms rows=${res.rowCount}`);
  }
  return res;
};

// Check DB connection status and latency
export const checkDbConnection = async (): Promise<{ healthy: boolean; latencyMs: number; error?: string }> => {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT 1 as ping, NOW() as current_time');
    const latencyMs = Date.now() - start;
    if (res.rows && res.rows.length > 0) {
      return { healthy: true, latencyMs };
    }
    return { healthy: false, latencyMs, error: 'Empty response from database' };
  } catch (error) {
    const latencyMs = Date.now() - start;
    const msg = error instanceof Error ? error.message : 'Unknown database error';
    return { healthy: false, latencyMs, error: msg };
  }
};

// Graceful shutdown helper
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('[PostgreSQL]: Connection pool closed cleanly.');
  } catch (err) {
    console.error('[PostgreSQL]: Error closing connection pool:', err);
  }
};
