import dotenv from 'dotenv'

dotenv.config({ quiet: true });

export const ENV = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    NODE_ENV: process.env.NODE_ENV,
    NEON_DB_URI: process.env.NEON_DB_URI,
    ARCJET_KEY: process.env.ARCJET_KEY,
    ARCJET_MODE: process.env.ARCJET_MODE,
    ARCJET_ENV: process.env.ARCJET_ENV
}