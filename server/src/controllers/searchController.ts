import { Request, Response } from 'express';
import Article from '../models/Article';
import Video from '../models/Video';
import User from '../models/User';
import Category from '../models/Category';
import { inMemoryDB, isMongooseReady } from '../services/dataStore';
import { searchYouTube } from '../services/youtubeService';
import { getKnowledgeBrief } from '../services/knowledgeService';

// @route   GET /api/search
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q, type = 'all', category, limit = 10 } = req.query;

    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(200).json({
        success: true,
        query: '',
        results: { articles: [], videos: [], creators: [], categories: [], youtube: [], knowledge: null },
        totalCount: 0,
      });
    }

    const queryStr = q.trim();
    const itemLimit = Math.min(20, Number(limit) || 10);

    if (isMongooseReady()) {
      const regex = new RegExp(queryStr, 'i');
      const results: any = { articles: [], videos: [], creators: [], categories: [], youtube: [], knowledge: null };
      const promises: Promise<any>[] = [];

      if (type === 'all' || type === 'articles') {
        const articleFilter: any = {
          status: 'published',
          $or: [{ title: regex }, { excerpt: regex }, { tags: regex }, { subcategory: regex }],
        };
        if (category && category !== 'All') {
          articleFilter.category = new RegExp(`^${category}$`, 'i');
        }
        promises.push(
          Article.find(articleFilter)
            .populate('author', 'name avatar role')
            .limit(itemLimit)
            .then((docs) => (results.articles = docs))
        );
      }

      if (type === 'all' || type === 'videos') {
        const videoFilter: any = {
          status: 'published',
          $or: [{ title: regex }, { description: regex }, { tags: regex }],
        };
        if (category && category !== 'All') {
          videoFilter.category = new RegExp(`^${category}$`, 'i');
        }
        promises.push(
          Video.find(videoFilter)
            .populate('creator', 'name avatar channelName isVerified')
            .limit(itemLimit)
            .then((docs) => (results.videos = docs))
        );
      }

      if (type === 'all' || type === 'creators') {
        promises.push(
          User.find({
            role: { $in: ['creator', 'admin'] },
            isSuspended: false,
            $or: [{ name: regex }, { channelName: regex }, { bio: regex }],
          })
            .select('-password')
            .limit(itemLimit)
            .then((docs) => (results.creators = docs))
        );
      }

      if (type === 'all' || type === 'categories') {
        promises.push(
          Category.find({
            $or: [{ name: regex }, { description: regex }],
          })
            .limit(itemLimit)
            .then((docs) => (results.categories = docs))
        );
      }

      if (type === 'all' || type === 'youtube') {
        promises.push(
          searchYouTube(queryStr, 6).then((yt) => {
            results.youtube = yt.videos;
          })
        );
      }

      if (type === 'all' || type === 'knowledge') {
        promises.push(
          getKnowledgeBrief(queryStr).then((kb) => {
            results.knowledge = kb;
          })
        );
      }

      await Promise.all(promises);

      const totalCount =
        results.articles.length +
        results.videos.length +
        results.creators.length +
        results.categories.length +
        results.youtube.length;

      return res.status(200).json({ success: true, query: queryStr, totalCount, results });
    } else {
      const s = queryStr.toLowerCase();
      const results: any = { articles: [], videos: [], creators: [], categories: [], youtube: [], knowledge: null };

      if (type === 'all' || type === 'articles') {
        results.articles = inMemoryDB.articles
          .filter(
            (a) =>
              a.status === 'published' &&
              (!category || category === 'All' || a.category.toLowerCase() === (category as string).toLowerCase()) &&
              (a.title.toLowerCase().includes(s) ||
                a.excerpt.toLowerCase().includes(s) ||
                (a.tags && a.tags.some((t) => t.toLowerCase().includes(s))))
          )
          .slice(0, itemLimit);
      }

      if (type === 'all' || type === 'videos') {
        results.videos = inMemoryDB.videos
          .filter(
            (v) =>
              v.status === 'published' &&
              (!category || category === 'All' || v.category.toLowerCase() === (category as string).toLowerCase()) &&
              (v.title.toLowerCase().includes(s) ||
                v.description.toLowerCase().includes(s) ||
                (v.tags && v.tags.some((t) => t.toLowerCase().includes(s))))
          )
          .slice(0, itemLimit);
      }

      if (type === 'all' || type === 'creators') {
        results.creators = inMemoryDB.users
          .filter(
            (u) =>
              (u.role === 'creator' || u.role === 'admin') &&
              !u.isSuspended &&
              (u.name.toLowerCase().includes(s) ||
                (u.channelName && u.channelName.toLowerCase().includes(s)) ||
                (u.bio && u.bio.toLowerCase().includes(s)))
          )
          .map((u) => {
            const { password, ...rest } = u;
            return rest;
          })
          .slice(0, itemLimit);
      }

      if (type === 'all' || type === 'categories') {
        results.categories = inMemoryDB.categories
          .filter((c) => c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s))
          .slice(0, itemLimit);
      }

      const [ytRes, kbRes] = await Promise.all([
        type === 'all' || type === 'youtube' ? searchYouTube(queryStr, 6) : Promise.resolve({ videos: [] }),
        type === 'all' || type === 'knowledge' ? getKnowledgeBrief(queryStr) : Promise.resolve(null),
      ]);

      results.youtube = ytRes.videos;
      results.knowledge = kbRes;

      const totalCount =
        results.articles.length +
        results.videos.length +
        results.creators.length +
        results.categories.length +
        results.youtube.length;

      return res.status(200).json({ success: true, query: queryStr, totalCount, results });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Search execution failed.' });
  }
};

// @route   GET /api/search/knowledge
export const getSearchKnowledge = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(200).json({ success: true, query: '', knowledge: null });
    }

    const knowledge = await getKnowledgeBrief(q.trim());
    return res.status(200).json({ success: true, query: q.trim(), knowledge });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Knowledge retrieval failed.' });
  }
};

// @route   GET /api/search/youtube
export const searchYouTubeVideos = async (req: Request, res: Response) => {
  try {
    const { q, limit = 8 } = req.query;
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(200).json({
        success: true,
        query: '',
        totalCount: 0,
        videos: [],
        isLiveApi: false,
      });
    }

    const result = await searchYouTube(q.trim(), Number(limit) || 8);
    return res.status(200).json({
      success: true,
      query: q.trim(),
      totalCount: result.videos.length,
      videos: result.videos,
      isLiveApi: result.isLiveApi,
      message: result.message,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'YouTube search execution failed.' });
  }
};

// @route   GET /api/search/suggestions
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const s = q.trim().toLowerCase();

    if (isMongooseReady()) {
      const regex = new RegExp(q.trim(), 'i');
      const [articles, videos, categories] = await Promise.all([
        Article.find({ title: regex, status: 'published' }).select('title slug category').limit(4),
        Video.find({ title: regex, status: 'published' }).select('title slug category').limit(4),
        Category.find({ name: regex }).select('name slug').limit(3),
      ]);

      const suggestions = [
        ...articles.map((a) => ({ title: a.title, type: 'article', slug: a.slug, category: a.category })),
        ...videos.map((v) => ({ title: v.title, type: 'video', slug: v.slug, category: v.category })),
        ...categories.map((c) => ({ title: c.name, type: 'category', slug: c.slug, category: 'Category' })),
      ];

      return res.status(200).json({ success: true, suggestions });
    } else {
      const articles = inMemoryDB.articles
        .filter((a) => a.status === 'published' && a.title.toLowerCase().includes(s))
        .slice(0, 4)
        .map((a) => ({ title: a.title, type: 'article', slug: a.slug, category: a.category }));

      const videos = inMemoryDB.videos
        .filter((v) => v.status === 'published' && v.title.toLowerCase().includes(s))
        .slice(0, 4)
        .map((v) => ({ title: v.title, type: 'video', slug: v.slug, category: v.category }));

      const categories = inMemoryDB.categories
        .filter((c) => c.name.toLowerCase().includes(s))
        .slice(0, 3)
        .map((c) => ({ title: c.name, type: 'category', slug: c.slug, category: 'Category' }));

      return res.status(200).json({
        success: true,
        suggestions: [...articles, ...videos, ...categories],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching suggestions.' });
  }
};
