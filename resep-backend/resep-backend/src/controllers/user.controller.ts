import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { listRecipes } from '../services/recipe.service';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { updateProfileSchema } from '../validators/auth.validator';
import { listRecipesQuerySchema } from '../validators/recipe.validator';

async function findProfile(userId: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.created_at,
            (SELECT COUNT(*) FROM recipes WHERE user_id = u.id) AS recipe_count
     FROM users u
     WHERE u.id = ?`,
    [userId],
  );
  if (rows.length === 0) {
    throw new AppError(401, 'Akun tidak ditemukan. Silakan login ulang');
  }
  return rows[0];
}

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await findProfile(req.user!.id);
  res.json({ data: profile });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name } = updateProfileSchema.parse(req.body);
  await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, req.user!.id]);

  const profile = await findProfile(req.user!.id);
  res.json({ message: 'Profil berhasil diperbarui', data: profile });
});

export const getMyRecipes = asyncHandler(async (req, res) => {
  const query = listRecipesQuerySchema.parse(req.query);
  const result = await listRecipes(query, req.user!.id);
  res.json(result);
});
