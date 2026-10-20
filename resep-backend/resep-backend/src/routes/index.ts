import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import recipeRoutes from './recipe.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/recipes', recipeRoutes);

export default router;
