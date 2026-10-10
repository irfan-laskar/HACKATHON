import { Request, Response } from 'express';
import Like from '../models/Like';
import Comment from '../models/Comment';
import Article from '../models/Article';
import Video from '../models/Video';
import Report from '../models/Report';
import { AuthRequest } from '../middleware/auth';
import { inMemoryDB, isMongooseReady } from '../services/dataStore';

// @route   POST /api/interactions/like
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please log in to like content.' });
    }

    const { targetType, targetId } = req.body;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'Please specify targetType and targetId.' });
    }

    if (isMongooseReady()) {
      const existingLike = await Like.findOne({ user: req.user._id, targetType, targetId });
      let isLiked = false;
      let delta = 0;

      if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        isLiked = false;
        delta = -1;
      } else {
        await Like.create({ user: req.user._id, targetType, targetId });
        isLiked = true;
        delta = 1;
      }

      let updatedLikesCount = 0;
      if (targetType === 'article') {
        const art = await Article.findByIdAndUpdate(targetId, { $inc: { likesCount: delta } }, { new: true });
        if (art) updatedLikesCount = Math.max(0, art.likesCount);
      } else if (targetType === 'video') {
        const vid = await Video.findByIdAndUpdate(targetId, { $inc: { likesCount: delta } }, { new: true });
        if (vid) updatedLikesCount = Math.max(0, vid.likesCount);
      }

      return res.status(200).json({ success: true, isLiked, likesCount: updatedLikesCount });
    } else {
      const existingIndex = inMemoryDB.likes.findIndex(
        (l) => l.user === userId && l.targetType === targetType && l.targetId === targetId
      );

      let isLiked = false;
      let updatedLikesCount = 0;

      if (existingIndex > -1) {
        inMemoryDB.likes.splice(existingIndex, 1);
        isLiked = false;
        if (targetType === 'article') {
          const art = inMemoryDB.articles.find((a) => a._id === targetId);
          if (art) {
            art.likesCount = Math.max(0, art.likesCount - 1);
            updatedLikesCount = art.likesCount;
          }
        } else if (targetType === 'video') {
          const vid = inMemoryDB.videos.find((v) => v._id === targetId);
          if (vid) {
            vid.likesCount = Math.max(0, vid.likesCount - 1);
            updatedLikesCount = vid.likesCount;
          }
        }
      } else {
        inMemoryDB.likes.push({
          _id: inMemoryDB.generateId(),
          user: userId,
          targetType,
          targetId,
          createdAt: new Date(),
        });
        isLiked = true;
        if (targetType === 'article') {
          const art = inMemoryDB.articles.find((a) => a._id === targetId);
          if (art) {
            art.likesCount += 1;
            updatedLikesCount = art.likesCount;
          }
        } else if (targetType === 'video') {
          const vid = inMemoryDB.videos.find((v) => v._id === targetId);
          if (vid) {
            vid.likesCount += 1;
            updatedLikesCount = vid.likesCount;
          }
        }
      }

      return res.status(200).json({ success: true, isLiked, likesCount: updatedLikesCount });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error processing like.' });
  }
};

// @route   GET /api/interactions/like-status
export const getLikeStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(200).json({ success: true, isLiked: false });
    }

    const { targetType, targetId } = req.query;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const existingLike = await Like.findOne({
        user: req.user._id,
        targetType: targetType as string,
        targetId: targetId as string,
      });
      return res.status(200).json({ success: true, isLiked: Boolean(existingLike) });
    } else {
      const exists = inMemoryDB.likes.some(
        (l) => l.user === userId && l.targetType === targetType && l.targetId === targetId
      );
      return res.status(200).json({ success: true, isLiked: exists });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error getting like status.' });
  }
};

// @route   GET /api/interactions/comments
export const getComments = async (req: Request, res: Response) => {
  try {
    const { targetType, targetId } = req.query;

    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'Target type and ID are required.' });
    }

    if (isMongooseReady()) {
      const comments = await Comment.find({ targetType, targetId })
        .populate('user', 'name avatar role channelName')
        .sort('-createdAt');
      return res.status(200).json({ success: true, count: comments.length, comments });
    } else {
      const comments = inMemoryDB.comments
        .filter((c) => c.targetType === targetType && c.targetId === targetId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.status(200).json({ success: true, count: comments.length, comments });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching comments.' });
  }
};

// @route   POST /api/interactions/comments
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please log in to comment.' });
    }

    const { targetType, targetId, content } = req.body;

    if (!content || !targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'Comment content and target required.' });
    }

    if (isMongooseReady()) {
      const comment = await Comment.create({
        user: req.user._id,
        targetType,
        targetId,
        content,
      });

      if (targetType === 'article') {
        await Article.findByIdAndUpdate(targetId, { $inc: { commentsCount: 1 } });
      } else if (targetType === 'video') {
        await Video.findByIdAndUpdate(targetId, { $inc: { commentsCount: 1 } });
      }

      const populated = await Comment.findById(comment._id).populate('user', 'name avatar role channelName');
      return res.status(201).json({ success: true, message: 'Comment posted.', comment: populated });
    } else {
      const newComment: any = {
        _id: inMemoryDB.generateId(),
        user: {
          _id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar,
          role: req.user.role,
          channelName: req.user.channelName,
        },
        targetType,
        targetId,
        content,
        likesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryDB.comments.unshift(newComment);

      if (targetType === 'article') {
        const art = inMemoryDB.articles.find((a) => a._id === targetId);
        if (art) art.commentsCount += 1;
      } else if (targetType === 'video') {
        const vid = inMemoryDB.videos.find((v) => v._id === targetId);
        if (vid) vid.commentsCount += 1;
      }

      return res.status(201).json({ success: true, message: 'Comment posted.', comment: newComment });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating comment.' });
  }
};

// @route   DELETE /api/interactions/comments/:id
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized.' });

    const commentId = req.params.id;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });

      if (comment.user.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment.' });
      }

      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json({ success: true, message: 'Comment deleted.' });
    } else {
      const index = inMemoryDB.comments.findIndex((c) => c._id === commentId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Comment not found.' });

      const comment = inMemoryDB.comments[index];
      const commentUserId = comment.user?._id ? comment.user._id.toString() : comment.user?.toString();
      if (commentUserId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete.' });
      }

      inMemoryDB.comments.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Comment deleted.' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete comment.' });
  }
};

// @route   POST /api/interactions/report
export const reportContent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please log in to report content.' });
    }

    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Please specify target and reason.' });
    }

    if (isMongooseReady()) {
      const report = await Report.create({
        reporter: req.user._id,
        targetType,
        targetId,
        reason,
        details: details || '',
      });
      return res.status(201).json({
        success: true,
        message: 'Content submitted to educational moderation queue.',
        report,
      });
    } else {
      const report: any = {
        _id: inMemoryDB.generateId(),
        reporter: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
        targetType,
        targetId,
        reason,
        details: details || '',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDB.reports.unshift(report);
      return res.status(201).json({
        success: true,
        message: 'Content submitted to educational moderation queue.',
        report,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error submitting report.' });
  }
};
