import { defineConfig } from 'drizzle-kit';

import { ENV } from './src/config/env.js';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.NEON_DB_URI,
  },
});
