import { Router } from 'express';
import {
  getPlatformStats,
  getAdminUsers,
  updateUserRole,
  toggleSuspendUser,
  getModerationQueue,
  resolveReport,
} from '../controllers/adminController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(authenticate, authorizeRoles('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/suspend', toggleSuspendUser);
router.get('/reports', getModerationQueue);
router.put('/reports/:id/resolve', resolveReport);

export default router;
