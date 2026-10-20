import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';
import { ListRecipesQuery } from '../validators/recipe.validator';

const SORT_SQL: Record<ListRecipesQuery['sort'], string> = {
  newest: 'r.created_at DESC, r.id DESC',
  oldest: 'r.created_at ASC, r.id ASC',
  fastest: 'r.cook_time_minutes ASC, r.id DESC',
};

// Karakter % dan _ punya arti khusus di LIKE, jadi di-escape
const escapeLike = (text: string) => text.replace(/[\\%_]/g, '\\$&');

/**
 * Daftar resep dengan pencarian, filter, sorting, dan pagination.
 * Jika userId diisi, hanya resep milik user itu yang diambil.
 */
export async function listRecipes(query: ListRecipesQuery, userId?: number) {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (userId !== undefined) {
    where.push('r.user_id = ?');
    params.push(userId);
  }

  if (query.search) {
    const like = `%${escapeLike(query.search)}%`;
    where.push(`(
      r.title LIKE ?
      OR r.description LIKE ?
      OR EXISTS (
        SELECT 1 FROM recipe_ingredients i
        WHERE i.recipe_id = r.id AND i.name LIKE ?
      )
    )`);
    params.push(like, like, like);
  }

  if (query.category_id !== undefined) {
    where.push('r.category_id = ?');
    params.push(query.category_id);
  }

  if (query.difficulty) {
    where.push('r.difficulty = ?');
    params.push(query.difficulty);
  }

  if (query.max_time !== undefined) {
    where.push('r.cook_time_minutes <= ?');
    params.push(query.max_time);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM recipes r ${whereSql}`,
    params,
  );
  const total = Number(countRows[0].total);

  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
        r.id, r.title, r.description, r.image_url,
        r.cook_time_minutes, r.servings, r.difficulty,
        r.category_id, c.name AS category_name,
        r.user_id AS author_id, u.name AS author_name,
        r.created_at
     FROM recipes r
     JOIN users u ON u.id = r.user_id
     LEFT JOIN categories c ON c.id = r.category_id
     ${whereSql}
     ORDER BY ${SORT_SQL[query.sort]}
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset],
  );

  return {
    data: rows,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      total_pages: Math.ceil(total / query.limit),
    },
  };
}

/** Detail satu resep lengkap dengan bahan dan langkah. */
export async function getRecipeDetail(recipeId: number) {
  const [recipes] = await pool.query<RowDataPacket[]>(
    `SELECT
        r.id, r.title, r.description, r.image_url,
        r.cook_time_minutes, r.servings, r.difficulty,
        r.category_id, c.name AS category_name,
        r.user_id AS author_id, u.name AS author_name,
        r.created_at, r.updated_at
     FROM recipes r
     JOIN users u ON u.id = r.user_id
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.id = ?`,
    [recipeId],
  );

  if (recipes.length === 0) {
    throw new AppError(404, 'Resep tidak ditemukan');
  }

  const [ingredients] = await pool.query<RowDataPacket[]>(
    `SELECT name, quantity FROM recipe_ingredients
     WHERE recipe_id = ? ORDER BY position ASC`,
    [recipeId],
  );

  const [steps] = await pool.query<RowDataPacket[]>(
    `SELECT step_number, instruction FROM recipe_steps
     WHERE recipe_id = ? ORDER BY step_number ASC`,
    [recipeId],
  );

  return { ...recipes[0], ingredients, steps };
}
