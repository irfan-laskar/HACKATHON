import { Router } from 'express';
import {
  createFeedback,
  getPublicFeedbacks,
  toggleUpvote,
  getAdminFeedbacks,
  updateFeedbackStatus,
} from '../controllers/feedbackController';
import { authenticate, authorizeRoles, optionalAuth } from '../middleware/auth';

const router = Router();

// Public feedback submission (authenticated user attached if logged in)
router.post('/', optionalAuth, createFeedback);

// Public feedback community wall & stats
router.get('/', getPublicFeedbacks);

// Upvote / like feedback
router.post('/:id/upvote', optionalAuth, toggleUpvote);

// Admin-only endpoints
router.get('/admin/all', authenticate, authorizeRoles('admin'), getAdminFeedbacks);
router.put('/admin/:id', authenticate, authorizeRoles('admin'), updateFeedbackStatus);

export default router;
