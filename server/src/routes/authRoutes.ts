import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  becomeCreator,
  toggleFollow,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/become-creator', authenticate, becomeCreator);
router.post('/follow/:id', authenticate, toggleFollow);

export default router;
