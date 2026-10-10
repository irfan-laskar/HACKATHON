import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Share2,
  Sparkles,
  Briefcase,
  Camera,
  FileText,
  Users,
  Edit3,
  Target,
  Compass,
  Search,
  BookOpen,
  Video as VideoIcon,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import api from '../api/axios';
import { Article, Video, Category } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { VideoCard } from '../components/VideoCard';

const categoryIcons: Record<string, any> = {
  TrendingUp,
  Share2,
  Sparkles,
  Briefcase,
  Camera,
  FileText,
  Users,
  Edit3,
  Target,
  Compass,
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catRes, artRes, vidRes] = await Promise.all([
          api.get('/categories'),
          api.get('/articles?limit=3&sort=-viewsCount'),
          api.get('/videos?limit=3&sort=popular'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (artRes.data.success) setPopularArticles(artRes.data.articles);
        if (vidRes.data.success) setTrendingVideos(vidRes.data.videos);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950 pt-16 sm:pt-24 pb-16 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300 text-xs font-bold tracking-wide uppercase shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>All-In-One Modern Marketing & Business Hub</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-[1.12]"
            >
              Learn Marketing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-sky-500 dark:from-brand-400 dark:to-sky-400">
                Build Your Brand.
              </span>{' '}
              <br />
              Grow Your Business.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto"
            >
              Your complete knowledge hub for marketing fundamentals, smartphone product
              photography, Indian GST compliance, and bootstrapped startup growth. Completely free.
            </motion.p>

            {/* Hero Global Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearchSubmit}
              className="pt-2 max-w-xl mx-auto"
            >
              <div className="relative flex items-center shadow-lg shadow-slate-200/60 dark:shadow-none rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any topic: 4Ps, SEO, SSD, GST filing, Branding..."
                  className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-sm transition shrink-0"
                >
                  Search Hub
                </button>
              </div>

              {/* Quick trending search tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Try searching:</span>
                {['The 4Ps of Marketing', 'SSD', 'GST Invoicing', 'Brand Positioning', 'SEO Fundamentals'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-600 dark:hover:text-brand-300 text-slate-600 dark:text-slate-300 transition cursor-pointer font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* Quick action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
            >
              <Link
                to="/knowledge-hub"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Learning Hub</span>
              </Link>
              <Link
                to="/videos"
                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-2xs transition flex items-center gap-2"
              >
                <VideoIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Watch Educational Videos</span>
              </Link>
            </motion.div>
          </div>

          {/* Trust stats strip */}
          <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">10+</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Core Learning Disciplines</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 font-display">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Free Educational Access</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">2,500+</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Founders & Learners</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">Verified</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">GST & Legal Checklists</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED LEARNING CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Structured Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              Featured Learning Disciplines
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Step-by-step masterclasses designed to take you from first idea to profitable execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon] || BookOpen;
            return (
              <Link
                key={category._id}
                to={`/knowledge-hub?category=${encodeURIComponent(category.name)}`}
                className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span>{category.topicsCount || 12} Lessons</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING EDUCATIONAL VIDEOS */}
      <section className="bg-slate-900 dark:bg-slate-950/80 text-white py-16 border-y border-slate-800 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <VideoIcon className="w-4 h-4" />
                <span>Visual Studio Lessons</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                Trending Educational Videos
              </h2>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition"
            >
              Browse all video lessons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR ARTICLES & GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              In-Depth Tutorials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              Popular Educational Guides
            </h2>
          </div>
          <Link
            to="/knowledge-hub"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition"
          >
            Explore all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>

      {/* 5. BOOTSTRAPPED BUSINESS SUCCESS BLUEPRINT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 dark:from-slate-900 dark:via-slate-950 dark:to-black text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                Beginner Startup Roadmap
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
                Start From Home. Scale With Zero Venture Debt.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                You do not need a massive budget to launch. Our step-by-step academy guides you
                through starting a home bakery, local apparel boutique, or service enterprise on an
                under-₹25,000 budget.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/startup-academy"
                  className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-md transition"
                >
                  View 12-Step Business Path
                </Link>
                <Link
                  to="/legal-compliance"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
                >
                  Check GST & MSME Setup
                </Link>
              </div>
            </div>

            <div className="space-y-3.5 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 backdrop-blur-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                The Bootstrapper’s Advantage Checklist
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free Udyam MSME Registration with statutory credit & subsidy protections</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pro commercial catalog photography using only a smartphone and ₹80 foam board</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero-ad-spend local customer acquisition via Google Maps 3-Pack SEO</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>WhatsApp automated product catalogs for repeat neighbor orders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CREATOR INVITATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Join The Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            Share Your Expertise with Thousands of Founders
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Are you a marketer, commercial photographer, chartered accountant, or experienced founder?
            Upload educational videos and articles to build authority and mentor the next generation.
          </p>
          <div className="pt-2">
            <Link
              to="/creator/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-semibold text-sm shadow-md transition"
            >
              <span>Access Creator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
