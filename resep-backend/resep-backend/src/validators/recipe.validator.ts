import { z } from 'zod';

// Saat request berupa multipart/form-data (ada upload gambar), semua field datang
// sebagai string. Untuk ingredients dan steps, Flutter mengirimnya sebagai JSON string.
// Helper ini mengubah JSON string menjadi array sebelum divalidasi.
const jsonArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      return value; // biar gagal di validasi tipe dengan pesan yang jelas
    }
  }, schema);

const difficultyEnum = z.enum(['mudah', 'sedang', 'sulit']);

const ingredientSchema = z.object({
  name: z.string().trim().min(1, 'Nama bahan wajib diisi').max(150),
  quantity: z.string().trim().min(1, 'Takaran bahan wajib diisi').max(80),
});

export const createRecipeSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter').max(150, 'Judul maksimal 150 karakter'),
  description: z.string().trim().max(2000, 'Deskripsi maksimal 2000 karakter').optional(),
  cook_time_minutes: z.coerce.number().int().min(1, 'Waktu masak minimal 1 menit').max(10000),
  servings: z.coerce.number().int().min(1, 'Porsi minimal 1').max(100),
  difficulty: difficultyEnum,
  category_id: z.coerce.number().int().positive().optional(),
  ingredients: jsonArray(
    z.array(ingredientSchema).min(1, 'Minimal 1 bahan').max(100, 'Maksimal 100 bahan'),
  ),
  steps: jsonArray(
    z
      .array(z.string().trim().min(1, 'Langkah tidak boleh kosong').max(2000))
      .min(1, 'Minimal 1 langkah')
      .max(100, 'Maksimal 100 langkah'),
  ),
});

// Untuk update, semua field opsional (kirim hanya yang ingin diubah)
export const updateRecipeSchema = createRecipeSchema.partial();

export const listRecipesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  difficulty: difficultyEnum.optional(),
  max_time: z.coerce.number().int().positive().optional(),
  sort: z.enum(['newest', 'oldest', 'fastest']).default('newest'),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type ListRecipesQuery = z.infer<typeof listRecipesQuerySchema>;
