import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { getRecipeDetail, listRecipes } from '../services/recipe.service';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { deleteImage, uploadImage, UploadedImage } from '../utils/imageUpload';
import { idParamSchema } from '../validators/common.validator';
import {
  createRecipeSchema,
  listRecipesQuerySchema,
  updateRecipeSchema,
} from '../validators/recipe.validator';

// ---------- helper ----------

async function assertCategoryExists(categoryId: number) {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ?', [
    categoryId,
  ]);
  if (rows.length === 0) {
    throw new AppError(400, 'Kategori tidak ditemukan');
  }
}

/** Ambil resep dan pastikan yang meminta adalah pemiliknya. */
async function getOwnedRecipe(recipeId: number, userId: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, user_id, image_public_id FROM recipes WHERE id = ?',
    [recipeId],
  );
  const recipe = rows[0];

  if (!recipe) {
    throw new AppError(404, 'Resep tidak ditemukan');
  }
  if (recipe.user_id !== userId) {
    throw new AppError(403, 'Kamu tidak punya akses untuk mengubah resep ini');
  }
  return recipe;
}

async function insertIngredients(
  conn: PoolConnection,
  recipeId: number,
  ingredients: { name: string; quantity: string }[],
) {
  const values = ingredients.map((item, index) => [recipeId, item.name, item.quantity, index + 1]);
  await conn.query(
    'INSERT INTO recipe_ingredients (recipe_id, name, quantity, position) VALUES ?',
    [values],
  );
}

async function insertSteps(conn: PoolConnection, recipeId: number, steps: string[]) {
  const values = steps.map((instruction, index) => [recipeId, index + 1, instruction]);
  await conn.query(
    'INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES ?',
    [values],
  );
}

// ---------- handler ----------

export const getRecipes = asyncHandler(async (req, res) => {
  const query = listRecipesQuerySchema.parse(req.query);
  const result = await listRecipes(query);
  res.json(result);
});

export const getRecipe = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const recipe = await getRecipeDetail(id);
  res.json({ data: recipe });
});

export const createRecipe = asyncHandler(async (req, res) => {
  const body = createRecipeSchema.parse(req.body);
  const userId = req.user!.id;

  if (body.category_id !== undefined) {
    await assertCategoryExists(body.category_id);
  }

  let image: UploadedImage | null = null;
  if (req.file) {
    image = await uploadImage(req.file.buffer);
  }

  const conn = await pool.getConnection();
  let recipeId = 0;

  try {
    await conn.beginTransaction();

    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO recipes
        (user_id, category_id, title, description, cook_time_minutes, servings, difficulty, image_url, image_public_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.category_id ?? null,
        body.title,
        body.description ?? null,
        body.cook_time_minutes,
        body.servings,
        body.difficulty,
        image?.url ?? null,
        image?.publicId ?? null,
      ],
    );
    recipeId = result.insertId;

    await insertIngredients(conn, recipeId, body.ingredients);
    await insertSteps(conn, recipeId, body.steps);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    // Database gagal, jadi gambar yang sudah terlanjur diupload dihapus lagi
    if (image) await deleteImage(image.publicId);
    throw error;
  } finally {
    conn.release();
  }

  const recipe = await getRecipeDetail(recipeId);
  res.status(201).json({ message: 'Resep berhasil dibuat', data: recipe });
});

export const updateRecipe = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const body = updateRecipeSchema.parse(req.body);

  const existing = await getOwnedRecipe(id, req.user!.id);

  if (Object.keys(body).length === 0 && !req.file) {
    throw new AppError(400, 'Tidak ada data yang diubah');
  }

  if (body.category_id !== undefined) {
    await assertCategoryExists(body.category_id);
  }

  let newImage: UploadedImage | null = null;
  if (req.file) {
    newImage = await uploadImage(req.file.buffer);
  }

  // Susun query UPDATE hanya untuk field yang dikirim
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  const simpleFields = [
    'title',
    'description',
    'cook_time_minutes',
    'servings',
    'difficulty',
    'category_id',
  ] as const;

  for (const field of simpleFields) {
    if (body[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(body[field] as string | number);
    }
  }
  if (newImage) {
    fields.push('image_url = ?', 'image_public_id = ?');
    values.push(newImage.url, newImage.publicId);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (fields.length > 0) {
      await conn.query(`UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    }

    // Bahan dan langkah diganti seluruhnya jika dikirim
    if (body.ingredients) {
      await conn.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);
      await insertIngredients(conn, id, body.ingredients);
    }
    if (body.steps) {
      await conn.query('DELETE FROM recipe_steps WHERE recipe_id = ?', [id]);
      await insertSteps(conn, id, body.steps);
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    if (newImage) await deleteImage(newImage.publicId);
    throw error;
  } finally {
    conn.release();
  }

  // Gambar lama baru dihapus setelah database berhasil diperbarui
  if (newImage) await deleteImage(existing.image_public_id);

  const recipe = await getRecipeDetail(id);
  res.json({ message: 'Resep berhasil diperbarui', data: recipe });
});

export const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const existing = await getOwnedRecipe(id, req.user!.id);

  // Bahan dan langkah ikut terhapus otomatis (ON DELETE CASCADE)
  await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
  await deleteImage(existing.image_public_id);

  res.json({ message: 'Resep berhasil dihapus' });
});
