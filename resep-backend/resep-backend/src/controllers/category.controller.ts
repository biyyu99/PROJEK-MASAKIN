import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const getCategories = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name FROM categories ORDER BY name ASC',
  );
  res.json({ data: rows });
});
