import app from './app';
import { pool } from './config/db';
import { env } from './config/env';

async function start() {
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log('Terhubung ke database MySQL');
  } catch (error) {
    console.error('Gagal terhubung ke database. Cek MySQL dan isi file .env');
    console.error(error);
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`Server berjalan di http://localhost:${env.PORT}`);
  });
}

start();
