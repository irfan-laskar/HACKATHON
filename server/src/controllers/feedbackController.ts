import { Request, Response } from 'express';
import Feedback, { IFeedback } from '../models/Feedback';
import { inMemoryDB, isMongooseReady, MemoryFeedback } from '../services/dataStore';
import { AuthRequest } from '../middleware/auth';

// @route   POST /api/feedback
// @desc    Submit new user feedback
// @access  Public / Optional Auth
export const createFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      restaurantName,
      businessType,
      category,
      rating,
      title,
      message,
      tags = [],
      isPublic = true,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a title and details for your feedback.',
      });
    }

    const validatedRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const senderName = name?.trim() || req.user?.name || 'Anonymous Restaurateur';
    const senderEmail = email?.trim() || req.user?.email || '';

    if (isMongooseReady()) {
      const feedback = await Feedback.create({
        user: req.user?._id,
        name: senderName,
        email: senderEmail,
        restaurantName: restaurantName?.trim() || '',
        businessType: businessType || 'Casual Dine-in',
        category: category || 'general',
        rating: validatedRating,
        title: title.trim(),
        message: message.trim(),
        tags: Array.isArray(tags) ? tags : [],
        isPublic: isPublic !== false,
        status: 'new',
        upvotes: 0,
        upvotedBy: [],
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you for your valuable feedback! It has been received.',
        feedback,
      });
    } else {
      const newFeedback: MemoryFeedback = {
        _id: inMemoryDB.generateId(),
        user: req.user
          ? {
              _id: req.user._id,
              name: req.user.name,
              avatar: req.user.avatar,
              email: req.user.email,
            }
          : undefined,
        name: senderName,
        email: senderEmail,
        restaurantName: restaurantName?.trim() || '',
        businessType: businessType || 'Casual Dine-in',
        category: category || 'general',
        rating: validatedRating,
        title: title.trim(),
        message: message.trim(),
        tags: Array.isArray(tags) ? tags : [],
        isPublic: isPublic !== false,
        status: 'new',
        upvotes: 0,
        upvotedBy: [],
        adminResponse: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryDB.feedbacks.unshift(newFeedback);

      return res.status(201).json({
        success: true,
        message: 'Thank you for your valuable feedback! It has been received.',
        feedback: newFeedback,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error submitting feedback.',
    });
  }
};

// @route   GET /api/feedback
// @desc    Get public feedbacks with filtering, sorting, & stats
// @access  Public
export const getPublicFeedbacks = async (req: Request, res: Response) => {
  try {
    const {
      category,
      rating,
      search,
      sort = 'recent',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 12);

    if (isMongooseReady()) {
      const query: any = { isPublic: true };

      if (category && category !== 'all') {
        query.category = category;
      }

      if (rating && rating !== 'all') {
        query.rating = Number(rating);
      }

      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { message: regex },
          { restaurantName: regex },
          { tags: { $in: [regex] } },
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (sort === 'top') {
        sortOption = { upvotes: -1, createdAt: -1 };
      } else if (sort === 'rating') {
        sortOption = { rating: -1, createdAt: -1 };
      }

      const totalCount = await Feedback.countDocuments(query);
      const feedbacks = await Feedback.find(query)
        .populate('user', 'name avatar role')
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      // Compute aggregates
      const allPublicFeedbacks = await Feedback.find({ isPublic: true }).select('rating category status');
      const totalRatings = allPublicFeedbacks.length;
      const sumRatings = allPublicFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : '5.0';

      const categoryCounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {
        new: 0,
        reviewed: 0,
        planned: 0,
        completed: 0,
      };

      allPublicFeedbacks.forEach((fb) => {
        categoryCounts[fb.category] = (categoryCounts[fb.category] || 0) + 1;
        if (fb.status in statusCounts) {
          statusCounts[fb.status] = (statusCounts[fb.status] || 0) + 1;
        }
      });

      return res.status(200).json({
        success: true,
        feedbacks,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        stats: {
          averageRating: Number(averageRating),
          totalFeedbacks: totalRatings,
          categoryCounts,
          statusCounts,
        },
      });
    } else {
      let filtered = inMemoryDB.feedbacks.filter((fb) => fb.isPublic !== false);

      if (category && category !== 'all') {
        filtered = filtered.filter((fb) => fb.category === category);
      }

      if (rating && rating !== 'all') {
        filtered = filtered.filter((fb) => fb.rating === Number(rating));
      }

      if (search && typeof search === 'string' && search.trim()) {
        const term = search.trim().toLowerCase();
        filtered = filtered.filter(
          (fb) =>
            fb.title.toLowerCase().includes(term) ||
            fb.message.toLowerCase().includes(term) ||
            fb.restaurantName?.toLowerCase().includes(term) ||
            fb.tags.some((t) => t.toLowerCase().includes(term))
        );
      }

      if (sort === 'top') {
        filtered.sort((a, b) => b.upvotes - a.upvotes || b.createdAt.getTime() - a.createdAt.getTime());
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating || b.createdAt.getTime() - a.createdAt.getTime());
      } else {
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      const totalCount = filtered.length;
      const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      const allPublic = inMemoryDB.feedbacks.filter((fb) => fb.isPublic !== false);
      const totalRatings = allPublic.length;
      const sumRatings = allPublic.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : '5.0';

      const categoryCounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {
        new: 0,
        reviewed: 0,
        planned: 0,
        completed: 0,
      };

      allPublic.forEach((fb) => {
        categoryCounts[fb.category] = (categoryCounts[fb.category] || 0) + 1;
        if (fb.status in statusCounts) {
          statusCounts[fb.status] = (statusCounts[fb.status] || 0) + 1;
        }
      });

      return res.status(200).json({
        success: true,
        feedbacks: paginated,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        stats: {
          averageRating: Number(averageRating),
          totalFeedbacks: totalRatings,
          categoryCounts,
          statusCounts,
        },
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error fetching feedbacks.',
    });
  }
};

// @route   POST /api/feedback/:id/upvote
// @desc    Toggle upvote on a feedback item
// @access  Public (tracked by user id or client fingerprint)
export const toggleUpvote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const voterId = req.user?._id || req.body?.voterId || req.ip || 'anonymous_voter';

    if (isMongooseReady()) {
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({ success: false, message: 'Feedback not found.' });
      }

      const voterStr = voterId.toString();
      const existingIdx = feedback.upvotedBy.indexOf(voterStr);

      let hasUpvoted = false;
      if (existingIdx > -1) {
        feedback.upvotedBy.splice(existingIdx, 1);
        feedback.upvotes = Math.max(0, feedback.upvotes - 1);
        hasUpvoted = false;
      } else {
        feedback.upvotedBy.push(voterStr);
        feedback.upvotes += 1;
        hasUpvoted = true;
      }

      await feedback.save();

      return res.status(200).json({
        success: true,
        upvotes: feedback.upvotes,
        hasUpvoted,
      });
    } else {
      const fb = inMemoryDB.feedbacks.find((item) => item._id === id);
      if (!fb) {
        return res.status(404).json({ success: false, message: 'Feedback not found.' });
      }

      const voterStr = voterId.toString();
      const existingIdx = fb.upvotedBy.indexOf(voterStr);

      let hasUpvoted = false;
      if (existingIdx > -1) {
        fb.upvotedBy.splice(existingIdx, 1);
        fb.upvotes = Math.max(0, fb.upvotes - 1);
        hasUpvoted = false;
      } else {
        fb.upvotedBy.push(voterStr);
        fb.upvotes += 1;
        hasUpvoted = true;
      }

      return res.status(200).json({
        success: true,
        upvotes: fb.upvotes,
        hasUpvoted,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error updating upvote.',
    });
  }
};

// @route   GET /api/admin/feedback
// @desc    Admin: get all feedbacks with status filter
// @access  Admin
export const getAdminFeedbacks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, category, search, page = 1, limit = 25 } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 25);

    if (isMongooseReady()) {
      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (category && category !== 'all') query.category = category;
      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { message: regex }, { name: regex }, { restaurantName: regex }];
      }

      const totalCount = await Feedback.countDocuments(query);
      const feedbacks = await Feedback.find(query)
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        feedbacks,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
      });
    } else {
      let filtered = [...inMemoryDB.feedbacks];
      if (status && status !== 'all') filtered = filtered.filter((f) => f.status === status);
      if (category && category !== 'all') filtered = filtered.filter((f) => f.category === category);
      if (search && typeof search === 'string' && search.trim()) {
        const term = search.trim().toLowerCase();
        filtered = filtered.filter(
          (f) =>
            f.title.toLowerCase().includes(term) ||
            f.message.toLowerCase().includes(term) ||
            f.name.toLowerCase().includes(term) ||
            f.restaurantName?.toLowerCase().includes(term)
        );
      }

      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const totalCount = filtered.length;
      const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.status(200).json({
        success: true,
        feedbacks: paginated,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error fetching admin feedbacks.',
    });
  }
};

// @route   PUT /api/admin/feedback/:id
// @desc    Admin: update feedback status and reply
// @access  Admin
export const updateFeedbackStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminResponse, isPublic } = req.body;

    if (isMongooseReady()) {
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({ success: false, message: 'Feedback not found.' });
      }

      if (status) feedback.status = status;
      if (typeof adminResponse === 'string') feedback.adminResponse = adminResponse;
      if (typeof isPublic === 'boolean') feedback.isPublic = isPublic;

      await feedback.save();

      return res.status(200).json({
        success: true,
        message: 'Feedback updated successfully.',
        feedback,
      });
    } else {
      const fb = inMemoryDB.feedbacks.find((item) => item._id === id);
      if (!fb) {
        return res.status(404).json({ success: false, message: 'Feedback not found.' });
      }

      if (status) fb.status = status;
      if (typeof adminResponse === 'string') fb.adminResponse = adminResponse;
      if (typeof isPublic === 'boolean') fb.isPublic = isPublic;
      fb.updatedAt = new Date();

      return res.status(200).json({
        success: true,
        message: 'Feedback updated successfully.',
        feedback: fb,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error updating feedback.',
    });
  }
};
