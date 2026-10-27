import mysql from 'mysql2/promise';
import { env } from './env';

// Aiven memberikan DATABASE_URL (format: mysql://user:pass@host:port/db)
// Jika tidak ada, pakai field DB_* terpisah seperti biasa
const poolConfig = env.DATABASE_URL
  ? {
      uri: env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // wajib untuk Aiven
      waitForConnections: true,
      connectionLimit: 5, // Aiven free tier punya connection limit
      charset: 'utf8mb4',
    }
  : {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      charset: 'utf8mb4',
    };

export const pool = mysql.createPool(poolConfig as mysql.PoolOptions);

