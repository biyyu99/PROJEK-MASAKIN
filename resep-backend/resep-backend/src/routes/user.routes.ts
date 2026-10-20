import { Router } from 'express';
import { getMyProfile, getMyRecipes, updateMyProfile } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.get('/me/recipes', getMyRecipes);

export default router;
