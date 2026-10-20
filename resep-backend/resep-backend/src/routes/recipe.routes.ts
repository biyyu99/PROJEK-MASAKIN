import { Router } from 'express';
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  getRecipes,
  updateRecipe,
} from '../controllers/recipe.controller';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Publik: siapa saja boleh melihat resep
router.get('/', getRecipes);
router.get('/:id', getRecipe);

// Butuh login. Field gambar bernama "image" (multipart/form-data)
router.post('/', requireAuth, upload.single('image'), createRecipe);
router.put('/:id', requireAuth, upload.single('image'), updateRecipe);
router.delete('/:id', requireAuth, deleteRecipe);

export default router;
