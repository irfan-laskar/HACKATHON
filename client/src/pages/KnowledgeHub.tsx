import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  SlidersHorizontal,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Video as VideoIcon,
} from 'lucide-react';
import api from '../api/axios';
import { Article, Category } from '../types';
import { ArticleCard } from '../components/ArticleCard';

// Structured Curriculum Tracks definition
interface CurriculumLesson {
  slug: string;
  title: string;
  subtitle: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keyTakeaway: string;
  tag: string;
}

interface CurriculumTrack {
  id: string;
  trackNumber: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  badgeColor: string;
  lessons: CurriculumLesson[];
}

const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    id: 'foundations',
    trackNumber: 'Track 01',
    title: 'Strategic Marketing Foundations & Positioning',
    description: 'Master the timeless psychological mechanics of demand generation, product-market positioning, and pricing authority.',
    icon: Target,
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    lessons: [
      {
        slug: 'marketing-fundamentals-4ps-7ps-stp-framework',
        title: 'The 4Ps, 7Ps & STP Marketing Framework',
        subtitle: 'Foundations of Modern Demand Generation',
        readTime: 12,
        difficulty: 'beginner',
        keyTakeaway: 'Align Product, Price, Place, and Promotion with targeted buyer personas to eliminate guesswork.',
        tag: 'Core Strategy',
      },
      {
        slug: 'brand-positioning-psychological-pricing',
        title: 'Brand Positioning & Psychological Pricing',
        subtitle: 'How to Charge 3x Your Competitors Without Churn',
        readTime: 13,
        difficulty: 'advanced',
        keyTakeaway: 'Use price anchoring, the decoy effect, and category design to escape low-margin commodity traps.',
        tag: 'Pricing & Moats',
      },
      {
        slug: '12-step-roadmap-launching-profitable-business-budget',
        title: 'Bootstrapping Roadmap from Zero to First 100 Buyers',
        subtitle: 'Launching Profitable Offerings on a Budget',
        readTime: 15,
        difficulty: 'beginner',
        keyTakeaway: 'A pragmatic execution playbook for validating offers and generating revenue with under ₹25,000.',
        tag: 'Go-to-Market',
      },
    ],
  },
  {
    id: 'organic-seo',
    trackNumber: 'Track 02',
    title: 'Organic Search (SEO) & High-Conversion Copywriting',
    description: 'Build compounding search authority on Google and write persuasive copy that converts casual visitors into paying customers.',
    icon: TrendingUp,
    color: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    lessons: [
      {
        slug: 'seo-architecture-organic-traffic-engine',
        title: 'SEO Architecture: The Zero-to-100 Traffic Engine',
        subtitle: 'Tactical Blueprint to Ranking #1 on Google',
        readTime: 14,
        difficulty: 'intermediate',
        keyTakeaway: 'Map search intent, configure Core Web Vitals, and build topical cluster silos that search engines reward.',
        tag: 'Organic Search',
      },
      {
        slug: 'high-conversion-copywriting-sales-pages',
        title: 'High-Conversion Copywriting & Sales Pages',
        subtitle: 'The AIDA & PAS Psychological Conversion Blueprint',
        readTime: 11,
        difficulty: 'beginner',
        keyTakeaway: 'Transform technical features into urgent transformations and neutralize objections with risk reversals.',
        tag: 'Persuasion Copy',
      },
      {
        slug: 'local-dominance-google-business-profile-secrets',
        title: 'Google Business Profile & Local Search Dominance',
        subtitle: 'Capturing High-Intent "Near Me" Retail Searches',
        readTime: 9,
        difficulty: 'beginner',
        keyTakeaway: 'Rank in Google 3-Pack local map results and turn customer review flows into continuous foot traffic.',
        tag: 'Local SEO',
      },
    ],
  },
  {
    id: 'social-performance',
    trackNumber: 'Track 03',
    title: 'Social Video Algorithms & Performance Advertising',
    description: 'Turn social media attention into scalable customer acquisition through algorithmic short-form video and structured Meta ad scaling.',
    icon: Zap,
    color: 'from-purple-600 to-pink-700',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
    lessons: [
      {
        slug: 'social-media-algorithms-short-form-video-growth',
        title: 'Social Media Algorithm Mastery: The 3-Second Hook',
        subtitle: 'Cracking Instagram Reels & Shorts Retention',
        readTime: 13,
        difficulty: 'intermediate',
        keyTakeaway: 'Engineer visual pattern interrupts, negative hooks, and automated comment-to-DM lead funnels.',
        tag: 'Viral Video',
      },
      {
        slug: 'meta-ads-masterclass-profitable-roas-scaling',
        title: 'Meta Ads (Facebook & Instagram) Scaling Masterclass',
        subtitle: 'From ₹500/day Testing to High-ROAS Account Architecture',
        readTime: 16,
        difficulty: 'advanced',
        keyTakeaway: 'Implement Dynamic Creative Testing (DCT), Advantage+ campaigns, and non-negotiable breakeven ROAS formulas.',
        tag: 'Paid Performance',
      },
      {
        slug: 'influencer-marketing-collaborations-rate-cards-legal',
        title: 'Influencer Marketing & Creator Brand Partnerships',
        subtitle: 'Proposal Templates, Rate Cards & Legal Disclosures',
        readTime: 11,
        difficulty: 'intermediate',
        keyTakeaway: 'Negotiate high-yield deliverables with micro-influencers and draft compliant performance contracts.',
        tag: 'Partnerships',
      },
    ],
  },
  {
    id: 'retention-sales',
    trackNumber: 'Track 04',
    title: 'Conversational Sales, Email Retention & Growth Math',
    description: 'Maximize customer lifetime value through WhatsApp conversational checkouts, automated email flows, and unit economics.',
    icon: BarChart3,
    color: 'from-amber-600 to-orange-700',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    lessons: [
      {
        slug: 'whatsapp-conversational-sales-funnels',
        title: 'WhatsApp Conversational Sales Funnels & Checkout',
        subtitle: 'Generating 40%+ Closing Rates Inside Daily Chats',
        readTime: 12,
        difficulty: 'intermediate',
        keyTakeaway: 'Deploy Click-to-WhatsApp ads with the 4-stage consultative closing script for frictionless buying.',
        tag: 'WhatsApp Sales',
      },
      {
        slug: 'retention-lifecycle-email-marketing-ltv',
        title: 'Customer Retention & Lifecycle Email Marketing',
        subtitle: 'The 5 Automated Flows That Maximize Lifetime Value (LTV)',
        readTime: 14,
        difficulty: 'intermediate',
        keyTakeaway: 'Automate welcome indoctrination, abandoned cart recovery, and 90-day win-back triggers.',
        tag: 'Email Automation',
      },
      {
        slug: 'marketing-analytics-ga4-attribution-unit-economics',
        title: 'Growth Analytics, GA4 Attribution & Unit Economics',
        subtitle: 'Tracking End-to-End Funnels and Scaling CAC:LTV Safely',
        readTime: 15,
        difficulty: 'advanced',
        keyTakeaway: 'Standardize UTM tracking taxonomies, multi-touch attribution, and maintain a 3:1+ LTV to CAC ratio.',
        tag: 'Analytics & Math',
      },
    ],
  },
];

export const KnowledgeHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('-createdAt');
  const [loading, setLoading] = useState(true);

  // View mode tab: 'curriculum' (Structured Tracks) vs 'all' (Searchable Library)
  const [viewMode, setViewMode] = useState<'curriculum' | 'all'>('curriculum');

  // Sync category from URL query param if it changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
      setViewMode('all'); // switch to list view when filtering specifically
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `/articles?sort=${sortBy}&limit=30`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (selectedDifficulty && selectedDifficulty !== 'all') {
        url += `&difficulty=${selectedDifficulty}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, selectedDifficulty, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode('all');
    fetchArticles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Banner & Curriculum Stats */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-brand-900/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Scaletrix Master Curriculum • 100% Free Educational Access</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Comprehensive Marketing & Growth Curriculum
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            A battle-tested, structured curriculum for founders, marketers, and entrepreneurs. Master
            core frameworks (4Ps, STP), organic SEO, persuasive copywriting, viral short-form video, Meta ads, WhatsApp
            sales funnels, and retention analytics with actionable checklists.
          </p>

          {/* Curriculum Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-brand-400">4 Tracks</div>
              <div className="text-xs text-slate-400 font-medium">Core Learning Paths</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">12+ Lessons</div>
              <div className="text-xs text-slate-400 font-medium">In-Depth Masterclasses</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-sky-400">40+ Checklists</div>
              <div className="text-xs text-slate-400 font-medium">Actionable Steps</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-400">100% Free</div>
              <div className="text-xs text-slate-400 font-medium">Zero Paywalls</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive View Switcher & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('curriculum')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                viewMode === 'curriculum'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Structured Learning Tracks (Recommended)</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>All Lesson Articles ({articles.length})</span>
            </button>
          </div>

          {/* Quick link to Video Academy */}
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <VideoIcon className="w-4 h-4 text-brand-500" />
            <span>Explore Video Lessons Platform &rarr;</span>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search marketing lessons by keyword (e.g. SEO, 4Ps, Meta ads)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </form>

            {/* Controls: Difficulty & Sorting */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Difficulty:</span>
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setViewMode('all');
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setViewMode('all');
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition cursor-pointer"
              >
                <option value="-createdAt">Newest First</option>
                <option value="-viewsCount">Most Popular</option>
                <option value="-likesCount">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchParams({});
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Disciplines
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setViewMode('all');
                  setSearchParams({ category: cat.name });
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VIEW 1: STRUCTURED CURRICULUM TRACKS ROADMAP */}
      {viewMode === 'curriculum' ? (
        <div className="space-y-12">
          {CURRICULUM_TRACKS.map((track) => {
            const TrackIcon = track.icon;
            return (
              <section
                key={track.id}
                className="space-y-6 bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm"
              >
                {/* Track Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${track.color} text-white flex items-center justify-center shrink-0 shadow-md`}
                    >
                      <TrackIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${track.badgeColor}`}>
                          {track.trackNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {track.lessons.length} Progressive Masterclasses
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                        {track.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                        {track.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Track Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {track.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.slug}
                      className="group bg-slate-50/70 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-brand-500/50 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {/* Lesson number and tags */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                            Lesson {track.trackNumber.replace('Track 0', '')}.{idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                              {lesson.tag}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                lesson.difficulty === 'beginner'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : lesson.difficulty === 'intermediate'
                                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              }`}
                            >
                              {lesson.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Title & subtitle */}
                        <div>
                          <Link to={`/articles/${lesson.slug}`} className="block">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                              {lesson.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">
                            {lesson.subtitle}
                          </p>
                        </div>

                        {/* Core takeaway */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed line-clamp-3">{lesson.keyTakeaway}</span>
                        </div>
                      </div>

                      {/* Footer & Action */}
                      <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.readTime} min read
                        </span>

                        <Link
                          to={`/articles/${lesson.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Start Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* 4. VIEW 2: ALL ARTICLES GRID VIEW */
        <div>
          {loading ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500 space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent" />
              <p className="text-sm">Loading comprehensive lessons...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                No lessons match your current filters
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                Try resetting your difficulty or selecting "All Disciplines" above.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                  fetchArticles();
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default KnowledgeHub;
