import { Router } from 'express';
import {
  getVideos,
  getVideoBySlug,
  uploadAndCreateVideo,
  getCreatorVideos,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { uploadMedia } from '../middleware/upload';

const router = Router();

router.get('/', getVideos);
router.get('/creator/dashboard', optionalAuth, getCreatorVideos);
router.get('/:slug', getVideoBySlug);

const uploadMiddleware = uploadMedia.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// Allow both POST / and POST /upload so any frontend call succeeds
router.post('/', optionalAuth, uploadMiddleware, uploadAndCreateVideo);
router.post('/upload', optionalAuth, uploadMiddleware, uploadAndCreateVideo);

router.put('/:id', authenticate, updateVideo);
router.delete('/:id', authenticate, deleteVideo);

export default router;
