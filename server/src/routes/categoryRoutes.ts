import { Router, Request, Response } from 'express';
import Category from '../models/Category';
import Article from '../models/Article';
import Video from '../models/Video';
import { inMemoryDB, isMongooseReady } from '../services/dataStore';

const router = Router();

// GET /api/categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const { section } = req.query;

    if (isMongooseReady()) {
      const query = section ? { guideSection: section } : {};
      const categories = await Category.find(query).sort('name');
      return res.status(200).json({ success: true, count: categories.length, categories });
    } else {
      let categories = [...inMemoryDB.categories];
      if (section) {
        categories = categories.filter((c) => c.guideSection === section);
      }
      categories.sort((a, b) => a.name.localeCompare(b.name));
      return res.status(200).json({ success: true, count: categories.length, categories });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load categories.' });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (isMongooseReady()) {
      const category = await Category.findOne({ slug });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

      const [articles, videos] = await Promise.all([
        Article.find({ category: new RegExp(`^${category.name}$`, 'i'), status: 'published' })
          .populate('author', 'name avatar role')
          .limit(8),
        Video.find({ category: new RegExp(`^${category.name}$`, 'i'), status: 'published' })
          .populate('creator', 'name avatar channelName isVerified')
          .limit(6),
      ]);

      return res.status(200).json({ success: true, category, articles, videos });
    } else {
      const category = inMemoryDB.categories.find((c) => c.slug === slug);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

      const articles = inMemoryDB.articles
        .filter((a) => a.category.toLowerCase() === category.name.toLowerCase() && a.status === 'published')
        .slice(0, 8);

      const videos = inMemoryDB.videos
        .filter((v) => v.category.toLowerCase() === category.name.toLowerCase() && v.status === 'published')
        .slice(0, 6);

      return res.status(200).json({ success: true, category, articles, videos });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load category.' });
  }
});

export default router;
