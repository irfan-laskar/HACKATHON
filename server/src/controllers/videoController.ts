import { Request, Response } from 'express';
import Video from '../models/Video';
import { AuthRequest } from '../middleware/auth';
import { processUploadedFile } from '../middleware/upload';
import { inMemoryDB, isMongooseReady } from '../services/dataStore';

const slugify = (text: string): string => {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-') +
    '-' +
    Math.floor(1000 + Math.random() * 9000)
  );
};

// @route   GET /api/videos
export const getVideos = async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      creator,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      isFeatured,
    } = req.query;

    if (isMongooseReady()) {
      const query: any = { status: 'published' };

      if (category && category !== 'All') {
        query.category = new RegExp(`^${category}$`, 'i');
      }
      if (creator) query.creator = creator;
      if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (sort === 'popular') sortOption = { viewsCount: -1 };
      if (sort === 'likes') sortOption = { likesCount: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Video.countDocuments(query);

      const videos = await Video.find(query)
        .populate('creator', 'name avatar channelName isVerified followersCount')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        count: videos.length,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        videos,
      });
    } else {
      let filtered = inMemoryDB.videos.filter((v) => v.status === 'published');

      if (category && category !== 'All') {
        filtered = filtered.filter(
          (v) => v.category.toLowerCase() === (category as string).toLowerCase()
        );
      }
      if (isFeatured !== undefined) {
        filtered = filtered.filter((v) => v.isFeatured === (isFeatured === 'true'));
      }
      if (creator) {
        filtered = filtered.filter((v) => {
          const cId = v.creator?._id ? v.creator._id.toString() : v.creator?.toString();
          return cId === creator;
        });
      }
      if (search) {
        const s = (search as string).toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.title.toLowerCase().includes(s) ||
            v.description.toLowerCase().includes(s) ||
            (v.tags && v.tags.some((t) => t.toLowerCase().includes(s)))
        );
      }

      if (sort === 'popular') {
        filtered.sort((a, b) => b.viewsCount - a.viewsCount);
      } else if (sort === 'likes') {
        filtered.sort((a, b) => b.likesCount - a.likesCount);
      } else if (sort === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = filtered.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = filtered.slice(skip, skip + Number(limit));

      return res.status(200).json({
        success: true,
        count: paginated.length,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        videos: paginated,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching videos.' });
  }
};

// @route   GET /api/videos/:slug
export const getVideoBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (isMongooseReady()) {
      const video = await Video.findOne({ slug }).populate(
        'creator',
        'name avatar bio channelName followersCount followers isVerified'
      );

      if (!video) return res.status(404).json({ success: false, message: 'Educational video not found.' });

      video.viewsCount += 1;
      await video.save();

      const related = await Video.find({
        _id: { $ne: video._id },
        category: video.category,
        status: 'published',
      })
        .populate('creator', 'name avatar channelName isVerified')
        .limit(6);

      return res.status(200).json({ success: true, video, related });
    } else {
      const video = inMemoryDB.videos.find((v) => v.slug === slug);
      if (!video) return res.status(404).json({ success: false, message: 'Educational video not found.' });

      video.viewsCount += 1;

      const related = inMemoryDB.videos
        .filter((v) => v._id !== video._id && v.category === video.category && v.status === 'published')
        .slice(0, 6);

      return res.status(200).json({ success: true, video, related });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching video.' });
  }
};

// @route   POST /api/videos/upload and POST /api/videos
export const uploadAndCreateVideo = async (req: AuthRequest, res: Response) => {
  try {
    // Anyone can upload! Use logged-in user or fallback to guest contributor
    let authorUser: any = req.user;
    if (!authorUser) {
      if (isMongooseReady()) {
        const User = (await import('../models/User')).default;
        authorUser = (await User.findOne({ role: 'creator' })) || (await User.findOne({}));
      }
      if (!authorUser) {
        authorUser = inMemoryDB.users.find((u) => u.role === 'creator') || inMemoryDB.users[0] || {
          _id: inMemoryDB.generateId(),
          name: 'Community Creator',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          channelName: 'Open Academy',
          isVerified: true,
        };
      }
    }

    const {
      title,
      description,
      category,
      tags,
      duration,
      videoUrl: manualVideoUrl,
      thumbnailUrl: manualThumbnailUrl,
      learningObjectives,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and educational category.',
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    let finalVideoUrl = manualVideoUrl;
    let finalThumbnailUrl = manualThumbnailUrl;

    if (files && files['video'] && files['video'][0]) {
      finalVideoUrl = await processUploadedFile(files['video'][0], 'video');
    }

    if (files && files['thumbnail'] && files['thumbnail'][0]) {
      finalThumbnailUrl = await processUploadedFile(files['thumbnail'][0], 'image');
    }

    if (!finalVideoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a video file or valid stream / YouTube URL.',
      });
    }

    const slug = slugify(title);
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const parsedObjectives = Array.isArray(learningObjectives)
      ? learningObjectives
      : typeof learningObjectives === 'string'
      ? learningObjectives.split('\n').map((o) => o.trim()).filter(Boolean)
      : [];

    const authorId = authorUser._id ? authorUser._id.toString() : authorUser.id || 'community_creator';
    const channelName = authorUser.channelName || authorUser.name || 'Community Channel';

    if (isMongooseReady()) {
      const video = await Video.create({
        title,
        slug,
        description,
        videoUrl: finalVideoUrl,
        thumbnailUrl:
          finalThumbnailUrl ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        duration: duration || '10:00',
        category,
        tags: parsedTags,
        creator: authorUser._id,
        status: 'published',
        learningObjectives: parsedObjectives,
      });

      const populated = await Video.findById(video._id).populate('creator', 'name avatar channelName');
      return res.status(201).json({ success: true, message: 'Educational video published successfully!', video: populated });
    } else {
      const newVideo: any = {
        _id: inMemoryDB.generateId(),
        title,
        slug,
        description,
        videoUrl: finalVideoUrl,
        thumbnailUrl:
          finalThumbnailUrl ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        duration: duration || '10:00',
        category,
        tags: parsedTags,
        creator: {
          _id: authorId,
          name: authorUser.name || 'Community Creator',
          avatar: authorUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          channelName,
          isVerified: Boolean(authorUser.isVerified),
        },
        viewsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        status: 'published',
        learningObjectives: parsedObjectives,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryDB.videos.unshift(newVideo);
      return res.status(201).json({ success: true, message: 'Educational video published successfully!', video: newVideo });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Video upload failed.' });
  }
};

// @route   GET /api/videos/creator/dashboard
export const getCreatorVideos = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      // If guest, show all public published videos so dashboard works smoothly
      const videos = inMemoryDB.videos;
      const totalViews = videos.reduce((acc, v) => acc + v.viewsCount, 0);
      const totalLikes = videos.reduce((acc, v) => acc + v.likesCount, 0);
      const totalComments = videos.reduce((acc, v) => acc + v.commentsCount, 0);
      return res.status(200).json({
        success: true,
        stats: { totalVideos: videos.length, totalViews, totalLikes, totalComments },
        videos,
      });
    }

    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const userVideos = await Video.find({ creator: req.user._id }).sort('-createdAt');
      const otherVideos = await Video.find({ status: 'published', creator: { $ne: req.user._id } }).sort('-createdAt').limit(10);
      const videos = [...userVideos, ...otherVideos];
      const totalViews = videos.reduce((acc, v) => acc + v.viewsCount, 0);
      const totalLikes = videos.reduce((acc, v) => acc + v.likesCount, 0);
      const totalComments = videos.reduce((acc, v) => acc + v.commentsCount, 0);

      return res.status(200).json({
        success: true,
        stats: { totalVideos: videos.length, totalViews, totalLikes, totalComments },
        videos,
      });
    } else {
      const userVideos = inMemoryDB.videos.filter((v) => {
        const cId = v.creator?._id ? v.creator._id.toString() : v.creator?.toString();
        return cId === userId;
      });
      const otherVideos = inMemoryDB.videos.filter((v) => {
        const cId = v.creator?._id ? v.creator._id.toString() : v.creator?.toString();
        return cId !== userId;
      });
      const videos = [...userVideos, ...otherVideos];

      const totalViews = videos.reduce((acc, v) => acc + v.viewsCount, 0);
      const totalLikes = videos.reduce((acc, v) => acc + v.likesCount, 0);
      const totalComments = videos.reduce((acc, v) => acc + v.commentsCount, 0);

      return res.status(200).json({
        success: true,
        stats: { totalVideos: videos.length, totalViews, totalLikes, totalComments },
        videos,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching dashboard.' });
  }
};

// @route   PUT /api/videos/:id
export const updateVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized.' });

    const videoId = req.params.id;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const video = await Video.findById(videoId);
      if (!video) return res.status(404).json({ success: false, message: 'Video not found.' });

      if (video.creator.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to edit.' });
      }

      const updated = await Video.findByIdAndUpdate(videoId, req.body, { new: true });
      return res.status(200).json({ success: true, message: 'Video updated.', video: updated });
    } else {
      const video = inMemoryDB.videos.find((v) => v._id === videoId);
      if (!video) return res.status(404).json({ success: false, message: 'Video not found.' });

      const creatorId = video.creator?._id ? video.creator._id.toString() : video.creator?.toString();
      if (creatorId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to edit.' });
      }

      Object.assign(video, req.body, { updatedAt: new Date() });
      return res.status(200).json({ success: true, message: 'Video updated.', video });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update video.' });
  }
};

// @route   DELETE /api/videos/:id
export const deleteVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized.' });

    const videoId = req.params.id;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const video = await Video.findById(videoId);
      if (!video) return res.status(404).json({ success: false, message: 'Video not found.' });

      if (video.creator.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete.' });
      }

      await Video.findByIdAndDelete(videoId);
      return res.status(200).json({ success: true, message: 'Video deleted.' });
    } else {
      const index = inMemoryDB.videos.findIndex((v) => v._id === videoId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Video not found.' });

      const video = inMemoryDB.videos[index];
      const creatorId = video.creator?._id ? video.creator._id.toString() : video.creator?.toString();
      if (creatorId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete.' });
      }

      inMemoryDB.videos.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Video deleted.' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete video.' });
  }
};
