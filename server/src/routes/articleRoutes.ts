import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', authenticate, createArticle);
router.put('/:id', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

export default router;
