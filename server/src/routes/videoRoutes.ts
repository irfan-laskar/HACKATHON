import { Router } from 'express';
import {
  getVideos,
  getVideoBySlug,
  uploadAndCreateVideo,
  getCreatorVideos,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController';
import { authenticate } from '../middleware/auth';
import { uploadMedia } from '../middleware/upload';

const router = Router();

router.get('/', getVideos);
router.get('/creator/dashboard', authenticate, getCreatorVideos);
router.get('/:slug', getVideoBySlug);
router.post(
  '/upload',
  authenticate,
  uploadMedia.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  uploadAndCreateVideo
);
router.put('/:id', authenticate, updateVideo);
router.delete('/:id', authenticate, deleteVideo);

export default router;
