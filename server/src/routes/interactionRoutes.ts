import { Router } from 'express';
import {
  toggleLike,
  getLikeStatus,
  getComments,
  createComment,
  deleteComment,
  reportContent,
} from '../controllers/interactionController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/like', authenticate, toggleLike);
router.get('/like-status', optionalAuth, getLikeStatus);
router.get('/comments', getComments);
router.post('/comments', authenticate, createComment);
router.delete('/comments/:id', authenticate, deleteComment);
router.post('/report', authenticate, reportContent);

export default router;
