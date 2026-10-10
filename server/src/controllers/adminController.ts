import { Request, Response } from 'express';
import User from '../models/User';
import Article from '../models/Article';
import Video from '../models/Video';
import Report from '../models/Report';
import { AuthRequest } from '../middleware/auth';
import { inMemoryDB, isMongooseReady } from '../services/dataStore';

// @route   GET /api/admin/stats
export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    if (isMongooseReady()) {
      const totalUsers = await User.countDocuments();
      const totalCreators = await User.countDocuments({ role: 'creator' });
      const totalArticles = await Article.countDocuments();
      const totalVideos = await Video.countDocuments();
      const pendingReports = await Report.countDocuments({ status: 'pending' });

      const videoViewsAgg = await Video.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$viewsCount' }, totalLikes: { $sum: '$likesCount' } } },
      ]);
      const articleViewsAgg = await Article.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$viewsCount' }, totalLikes: { $sum: '$likesCount' } } },
      ]);

      const totalVideoViews = videoViewsAgg[0]?.totalViews || 0;
      const totalArticleViews = articleViewsAgg[0]?.totalViews || 0;

      const recentUsers = await User.find().select('-password').sort('-createdAt').limit(5);
      const recentReports = await Report.find({ status: 'pending' })
        .populate('reporter', 'name email')
        .sort('-createdAt')
        .limit(5);

      return res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalCreators,
          totalArticles,
          totalVideos,
          pendingReports,
          totalViews: totalVideoViews + totalArticleViews,
          totalVideoViews,
          totalArticleViews,
        },
        recentUsers,
        recentReports,
      });
    } else {
      const totalUsers = inMemoryDB.users.length;
      const totalCreators = inMemoryDB.users.filter((u) => u.role === 'creator').length;
      const totalArticles = inMemoryDB.articles.length;
      const totalVideos = inMemoryDB.videos.length;
      const pendingReports = inMemoryDB.reports.filter((r) => r.status === 'pending').length;

      const totalVideoViews = inMemoryDB.videos.reduce((acc, v) => acc + v.viewsCount, 0);
      const totalArticleViews = inMemoryDB.articles.reduce((acc, a) => acc + a.viewsCount, 0);

      const recentUsers = inMemoryDB.users.slice(0, 5).map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        createdAt: u.createdAt,
      }));

      const recentReports = inMemoryDB.reports.slice(0, 5);

      return res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalCreators,
          totalArticles,
          totalVideos,
          pendingReports,
          totalViews: totalVideoViews + totalArticleViews,
          totalVideoViews,
          totalArticleViews,
        },
        recentUsers,
        recentReports,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error loading platform stats.' });
  }
};

// @route   GET /api/admin/users
export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    if (isMongooseReady()) {
      const query: any = {};
      if (role && role !== 'all') query.role = role;
      if (search) {
        query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await User.countDocuments(query);
      const users = await User.find(query).select('-password').sort('-createdAt').skip(skip).limit(Number(limit));

      return res.status(200).json({
        success: true,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        users,
      });
    } else {
      let filtered = [...inMemoryDB.users];

      if (role && role !== 'all') {
        filtered = filtered.filter((u) => u.role === role);
      }
      if (search) {
        const s = (search as string).toLowerCase();
        filtered = filtered.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }

      const total = filtered.length;
      const skip = (Number(page) - 1) * Number(limit);
      const users = filtered.slice(skip, skip + Number(limit)).map((u) => {
        const { password, ...rest } = u;
        return rest;
      });

      return res.status(200).json({
        success: true,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        users,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error loading users.' });
  }
};

// @route   PUT /api/admin/users/:id/role
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!['user', 'creator', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    if (isMongooseReady()) {
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.status(200).json({ success: true, message: `Role updated to ${role}`, user });
    } else {
      const user = inMemoryDB.users.find((u) => u._id === req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      user.role = role;
      user.updatedAt = new Date();
      const { password, ...rest } = user;
      return res.status(200).json({ success: true, message: `Role updated to ${role}`, user: rest });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating user role.' });
  }
};

// @route   PUT /api/admin/users/:id/suspend
export const toggleSuspendUser = async (req: AuthRequest, res: Response) => {
  try {
    const { isSuspended, suspensionReason } = req.body;

    if (isMongooseReady()) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          isSuspended: Boolean(isSuspended),
          suspensionReason: suspensionReason || 'Administrative suspension',
        },
        { new: true }
      ).select('-password');

      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.status(200).json({
        success: true,
        message: user.isSuspended ? 'User account suspended.' : 'User account reinstated.',
        user,
      });
    } else {
      const user = inMemoryDB.users.find((u) => u._id === req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      user.isSuspended = Boolean(isSuspended);
      user.suspensionReason = suspensionReason || 'Administrative suspension';
      user.updatedAt = new Date();

      const { password, ...rest } = user;
      return res.status(200).json({
        success: true,
        message: user.isSuspended ? 'User account suspended.' : 'User account reinstated.',
        user: rest,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating suspension.' });
  }
};

// @route   GET /api/admin/reports
export const getModerationQueue = async (req: AuthRequest, res: Response) => {
  try {
    const { status = 'pending' } = req.query;

    if (isMongooseReady()) {
      const reports = await Report.find({ ...(status !== 'all' && { status }) })
        .populate('reporter', 'name email avatar')
        .sort('-createdAt');
      return res.status(200).json({ success: true, count: reports.length, reports });
    } else {
      let reports = [...inMemoryDB.reports];
      if (status !== 'all') {
        reports = reports.filter((r) => r.status === status);
      }
      return res.status(200).json({ success: true, count: reports.length, reports });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching moderation queue.' });
  }
};

// @route   PUT /api/admin/reports/:id/resolve
export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { status, resolutionNotes, takeAction } = req.body;

    if (isMongooseReady()) {
      const report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

      report.status = status || 'action_taken';
      report.resolutionNotes = resolutionNotes || '';
      report.reviewedBy = req.user!._id;
      await report.save();

      if (takeAction) {
        if (report.targetType === 'video') {
          await Video.findByIdAndUpdate(report.targetId, { status: 'rejected', rejectionReason: resolutionNotes });
        } else if (report.targetType === 'article') {
          await Article.findByIdAndUpdate(report.targetId, { status: 'archived' });
        }
      }

      return res.status(200).json({ success: true, message: 'Report resolved.', report });
    } else {
      const report = inMemoryDB.reports.find((r) => r._id === req.params.id);
      if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

      report.status = status || 'action_taken';
      report.resolutionNotes = resolutionNotes || '';
      report.reviewedBy = req.user;
      report.updatedAt = new Date();

      if (takeAction) {
        if (report.targetType === 'video') {
          const v = inMemoryDB.videos.find((x) => x._id === report.targetId);
          if (v) {
            v.status = 'rejected';
            v.rejectionReason = resolutionNotes;
          }
        } else if (report.targetType === 'article') {
          const a = inMemoryDB.articles.find((x) => x._id === report.targetId);
          if (a) a.status = 'archived';
        }
      }

      return res.status(200).json({ success: true, message: 'Report resolved.', report });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error resolving report.' });
  }
};
