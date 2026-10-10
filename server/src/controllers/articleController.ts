import { Request, Response } from 'express';
import Article from '../models/Article';
import { AuthRequest } from '../middleware/auth';
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

// @route   GET /api/articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const {
      guideSection,
      category,
      subcategory,
      search,
      tag,
      author,
      difficulty,
      isFeatured,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    if (isMongooseReady()) {
      const query: any = { status: 'published' };
      if (guideSection) query.guideSection = guideSection;
      if (category) query.category = new RegExp(`^${category}$`, 'i');
      if (subcategory) query.subcategory = new RegExp(`^${subcategory}$`, 'i');
      if (tag) query.tags = tag;
      if (author) query.author = author;
      if (difficulty) query.difficulty = difficulty;
      if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Article.countDocuments(query);
      const articles = await Article.find(query)
        .populate('author', 'name avatar role channelName')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        count: articles.length,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        articles,
      });
    } else {
      let filtered = inMemoryDB.articles.filter((a) => a.status === 'published');

      if (guideSection) {
        filtered = filtered.filter((a) => a.guideSection === guideSection);
      }
      if (category && category !== 'All') {
        filtered = filtered.filter(
          (a) => a.category.toLowerCase() === (category as string).toLowerCase()
        );
      }
      if (subcategory) {
        filtered = filtered.filter(
          (a) => a.subcategory && a.subcategory.toLowerCase() === (subcategory as string).toLowerCase()
        );
      }
      if (tag) {
        filtered = filtered.filter((a) => a.tags && a.tags.includes(tag as string));
      }
      if (difficulty) {
        filtered = filtered.filter((a) => a.difficulty === difficulty);
      }
      if (isFeatured !== undefined) {
        filtered = filtered.filter((a) => a.isFeatured === (isFeatured === 'true'));
      }
      if (search) {
        const s = (search as string).toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(s) ||
            a.excerpt.toLowerCase().includes(s) ||
            a.content.toLowerCase().includes(s) ||
            (a.tags && a.tags.some((t) => t.toLowerCase().includes(s)))
        );
      }

      // Sort
      if (sort === '-viewsCount') {
        filtered.sort((a, b) => b.viewsCount - a.viewsCount);
      } else if (sort === '-likesCount') {
        filtered.sort((a, b) => b.likesCount - a.likesCount);
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
        articles: paginated,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching articles.' });
  }
};

// @route   GET /api/articles/:slug
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (isMongooseReady()) {
      const article = await Article.findOne({ slug }).populate(
        'author',
        'name avatar bio role channelName followersCount website'
      );
      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });

      article.viewsCount += 1;
      await article.save();

      const related = await Article.find({
        _id: { $ne: article._id },
        category: article.category,
        status: 'published',
      })
        .select('title slug excerpt coverImage readTime createdAt category')
        .limit(4);

      return res.status(200).json({ success: true, article, related });
    } else {
      const article = inMemoryDB.articles.find((a) => a.slug === slug);
      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });

      article.viewsCount += 1;

      const related = inMemoryDB.articles
        .filter((a) => a._id !== article._id && a.category === article.category && a.status === 'published')
        .slice(0, 4);

      return res.status(200).json({ success: true, article, related });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching article.' });
  }
};

// @route   POST /api/articles
export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized.' });

    const {
      title,
      excerpt,
      content,
      category,
      subcategory,
      tags,
      coverImage,
      readTime,
      guideSection = 'marketing_hub',
      difficulty = 'beginner',
      checklists = [],
      tools = [],
      faq = [],
      prosAndCons,
      commonMistakes,
      officialLinks,
      status = 'published',
      isFeatured = false,
    } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, excerpt, content, and category.',
      });
    }

    const slug = slugify(title);
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim())
      : [];

    const calculatedReadTime =
      Number(readTime) || Math.max(1, Math.round(content.split(' ').length / 200));

    if (isMongooseReady()) {
      const article = await Article.create({
        title,
        slug,
        excerpt,
        content,
        category,
        subcategory,
        tags: parsedTags,
        coverImage:
          coverImage ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        author: req.user._id,
        readTime: calculatedReadTime,
        guideSection,
        difficulty,
        checklists,
        tools,
        faq,
        prosAndCons,
        commonMistakes,
        officialLinks,
        status,
        isFeatured: req.user.role === 'admin' ? isFeatured : false,
      });

      const populated = await Article.findById(article._id).populate('author', 'name avatar role');
      return res.status(201).json({ success: true, message: 'Article published.', article: populated });
    } else {
      const newArticle: any = {
        _id: inMemoryDB.generateId(),
        title,
        slug,
        excerpt,
        content,
        category,
        subcategory,
        tags: parsedTags,
        coverImage:
          coverImage ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        author: {
          _id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar,
          role: req.user.role,
          channelName: req.user.channelName,
        },
        readTime: calculatedReadTime,
        guideSection,
        difficulty,
        checklists: Array.isArray(checklists) ? checklists : [],
        tools: Array.isArray(tools) ? tools : [],
        faq: Array.isArray(faq) ? faq : [],
        prosAndCons,
        commonMistakes,
        officialLinks,
        status,
        isFeatured: req.user.role === 'admin' ? isFeatured : false,
        viewsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryDB.articles.unshift(newArticle);
      return res.status(201).json({ success: true, message: 'Article published.', article: newArticle });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create article.' });
  }
};

// @route   PUT /api/articles/:id
export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized.' });

    const articleId = req.params.id;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const article = await Article.findById(articleId);
      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });

      if (article.author.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to edit.' });
      }

      const updated = await Article.findByIdAndUpdate(articleId, req.body, { new: true }).populate(
        'author',
        'name avatar role'
      );
      return res.status(200).json({ success: true, message: 'Article updated.', article: updated });
    } else {
      const article = inMemoryDB.articles.find((a) => a._id === articleId);
      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });

      const authorId = article.author?._id ? article.author._id.toString() : article.author?.toString();
      if (authorId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to edit.' });
      }

      Object.assign(article, req.body, { updatedAt: new Date() });
      return res.status(200).json({ success: true, message: 'Article updated.', article });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update article.' });
  }
};

// @route   DELETE /api/articles/:id
export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized.' });

    const articleId = req.params.id;
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    if (isMongooseReady()) {
      const article = await Article.findById(articleId);
      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });

      if (article.author.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete.' });
      }

      await Article.findByIdAndDelete(articleId);
      return res.status(200).json({ success: true, message: 'Article deleted.' });
    } else {
      const index = inMemoryDB.articles.findIndex((a) => a._id === articleId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Article not found.' });

      const article = inMemoryDB.articles[index];
      const authorId = article.author?._id ? article.author._id.toString() : article.author?.toString();
      if (authorId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete.' });
      }

      inMemoryDB.articles.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Article deleted.' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete article.' });
  }
};
