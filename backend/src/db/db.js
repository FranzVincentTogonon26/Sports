import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { ENV } from '../config/env.js'

const pool = new Pool({
  connectionString: ENV.NEON_DB_URI,
});

export const db = drizzle(pool);