import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Star,
  ThumbsUp,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Lightbulb,
  Calculator,
  Bug,
  BookOpen,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Award,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { Feedback, FeedbackStats } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'All Feedback' },
  { id: 'feature_request', label: 'Feature Requests', icon: Lightbulb },
  { id: 'tool_suggestion', label: 'Tool Ideas', icon: Calculator },
  { id: 'user_experience', label: 'Reviews & Praise', icon: MessageSquareHeart },
  { id: 'content_idea', label: 'SOPs & Guides', icon: BookOpen },
  { id: 'bug_report', label: 'Reported Issues', icon: Bug },
];

const RATING_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: 'Needs Work', emoji: '😕' },
  2: { text: 'Fair, Has Potential', emoji: '🙂' },
  3: { text: 'Good & Helpful', emoji: '😊' },
  4: { text: 'Very Good & Impactful', emoji: '😃' },
  5: { text: 'Outstanding / Game Changer!', emoji: '🚀' },
};

const SUGGESTED_TAGS = [
  'Food Costing',
  'Menu Pricing',
  'Profit Tracker',
  'Growth Plan',
  'Direct Ordering',
  'Cloud Kitchen',
  'Packaging Costs',
  'FSSAI & GST',
  'Excel Export',
];

export const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'wall' | 'submit'>('wall');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'top' | 'rating'>('top');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('feature_request');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [restaurantName, setRestaurantName] = useState('');
  const [businessType, setBusinessType] = useState('Casual Dine-in');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Upvote tracking
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/feedback?category=${categoryFilter}&search=${encodeURIComponent(
          searchQuery
        )}&sort=${sortBy}&rating=${ratingFilter}&limit=50`
      );
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch {
      showToast('Could not load feedback wall.', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [categoryFilter, sortBy, ratingFilter, activeTab]);

  // Real-time polling: automatically fetches new feedbacks posted from other phones/laptops
  useEffect(() => {
    const timer = setInterval(() => {
      api
        .get(
          `/feedback?category=${categoryFilter}&search=${encodeURIComponent(
            searchQuery
          )}&sort=${sortBy}&rating=${ratingFilter}&limit=50`
        )
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.feedbacks)) {
            setFeedbacks(res.data.feedbacks);
            if (res.data.stats) {
              setStats(res.data.stats);
            }
          }
        })
        .catch(() => {});
    }, 12000);

    return () => clearInterval(timer);
  }, [categoryFilter, searchQuery, sortBy, ratingFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFeedbacks();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleUpvote = async (feedbackId: string) => {
    try {
      const res = await api.post(`/feedback/${feedbackId}/upvote`, {
        voterId: user?._id || 'local_user',
      });
      if (res.data.success) {
        setUpvotedMap((prev) => ({
          ...prev,
          [feedbackId]: res.data.hasUpvoted,
        }));
        setFeedbacks((prev) =>
          prev.map((fb) =>
            fb._id === feedbackId
              ? { ...fb, upvotes: res.data.upvotes }
              : fb
          )
        );
        showToast(
          res.data.hasUpvoted
            ? 'Upvoted! Thank you for endorsing this suggestion.'
            : 'Upvote removed.',
          'info'
        );
      }
    } catch {
      showToast('Failed to register upvote.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please provide both a title and message.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: isAnonymous ? 'Anonymous Restaurateur' : name.trim() || user?.name || 'Anonymous Restaurateur',
        email: isAnonymous ? '' : email.trim() || user?.email || '',
        restaurantName: restaurantName.trim(),
        businessType,
        category,
        rating,
        title: title.trim(),
        message: message.trim(),
        tags: selectedTags,
        isPublic: true,
      };

      const res = await api.post('/feedback', payload);
      if (res.data.success) {
        setSubmittedSuccess(true);
        showToast('Thank you! Your feedback has been posted.', 'success');
        fetchFeedbacks();

        setTimeout(() => {
          setSubmittedSuccess(false);
          setActiveTab('wall');
          setTitle('');
          setMessage('');
          setSelectedTags([]);
        }, 1600);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error posting feedback.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-7">
        {/* HERO SECTION */}
        <div className="relative rounded-2xl bg-gradient-to-br from-forest-900 via-forest-800 to-[#790D16] dark:from-[#3a0509] dark:via-forest-900 dark:to-[#220306] text-cream-50 p-6 sm:p-7 overflow-hidden shadow-lg border border-forest-800/80">
          <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 dark:bg-[#AEC4D4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-950/70 border border-lime-400/30 text-lime-400 dark:text-[#AEC4D4] text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Community Voice & Feedback Hub
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync Across All Devices
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-snug text-white">
              We Value Your Feedback
            </h1>

            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed max-w-xl">
              Scaletrix is built hand-in-hand with Indian food entrepreneurs. Tell us what features, calculators, or operational tools you need next.
            </p>

            {/* Quick Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-forest-950 font-black text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-forest-950" />
                <span>Post Your Feedback</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wall')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-950/60 hover:bg-forest-950 text-cream-100 border border-forest-700 font-bold text-xs transition cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-lime-400" />
                <span>Browse Feedback Wall</span>
              </button>
            </div>
          </div>
        </div>

        {/* METRICS & STATS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          <div className="bg-white dark:bg-forest-900 p-3.5 sm:p-4 rounded-xl border border-cream-200 dark:border-forest-800 shadow-2xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-cream-400 uppercase tracking-wider">
                Average Rating
              </span>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-display font-black text-forest-950 dark:text-cream-50">
                {stats?.averageRating || '4.9'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-cream-400 font-medium">/ 5.0</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cream-400">From verified restaurateurs</p>
          </div>

          <div className="bg-white dark:bg-forest-900 p-3.5 sm:p-4 rounded-xl border border-cream-200 dark:border-forest-800 shadow-2xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-cream-400 uppercase tracking-wider">
                Total Suggestions
              </span>
              <MessageSquareHeart className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-display font-black text-forest-950 dark:text-cream-50">
                {stats?.totalFeedbacks || feedbacks.length || '14'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-cream-400 font-medium">Submissions</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cream-400">Community ideas received</p>
          </div>

          <div className="bg-white dark:bg-forest-900 p-3.5 sm:p-4 rounded-xl border border-cream-200 dark:border-forest-800 shadow-2xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-cream-400 uppercase tracking-wider">
                On Roadmap
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-display font-black text-forest-950 dark:text-cream-50">
                {stats?.statusCounts?.planned || '2'}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Planned</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cream-400">In active engineering</p>
          </div>

          <div className="bg-white dark:bg-forest-900 p-3.5 sm:p-4 rounded-xl border border-cream-200 dark:border-forest-800 shadow-2xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-cream-400 uppercase tracking-wider">
                Implemented
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-display font-black text-forest-950 dark:text-cream-50">
                {stats?.statusCounts?.completed || '1'}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Shipped</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cream-400">Suggestions live in production</p>
          </div>
        </div>

        {/* PRIMARY VIEW CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 dark:border-forest-800 pb-3">
          {/* Main Navigation Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-cream-100 dark:bg-forest-900 border border-cream-200 dark:border-forest-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('wall')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'wall'
                  ? 'bg-white dark:bg-forest-800 text-forest-950 dark:text-cream-50 shadow-xs'
                  : 'text-slate-600 dark:text-cream-300 hover:text-forest-950 dark:hover:text-cream-50'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Community Feedback Wall</span>
              <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-cream-200 font-bold">
                {feedbacks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('submit')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-[#790D16] text-white dark:bg-[#AEC4D4] dark:text-[#220306] shadow-xs'
                  : 'text-slate-600 dark:text-cream-300 hover:text-forest-950 dark:hover:text-cream-50'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post New Feedback</span>
            </button>
          </div>

          {activeTab === 'wall' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  fetchFeedbacks();
                  showToast('Syncing latest feedbacks across all devices...', 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-800 text-slate-700 dark:text-cream-200 hover:text-crimson-600 dark:hover:text-sand-300 transition cursor-pointer text-xs font-semibold shadow-xs"
                title="Sync latest community feedbacks from all connected devices"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-crimson-600' : ''}`} />
                <span>Sync Live</span>
              </button>

              <div className="flex items-center gap-1.5 bg-white dark:bg-forest-900 px-2.5 py-1.5 rounded-lg border border-cream-200 dark:border-forest-800 text-xs">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-forest-950 dark:text-cream-50 outline-hidden cursor-pointer text-xs"
                >
                  <option value="top">Most Upvoted</option>
                  <option value="recent">Newest First</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: COMMUNITY WALL */}
        {activeTab === 'wall' && (
          <div className="space-y-5">
            {/* Filter Bar & Search */}
            <div className="bg-white dark:bg-forest-900 p-3.5 sm:p-4 rounded-xl border border-cream-200 dark:border-forest-800 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row gap-2.5">
                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by feature, tool keyword, restaurant name, or tags..."
                    className="w-full pl-9 pr-20 py-2 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs text-forest-950 dark:text-cream-50 font-medium focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-md bg-[#790D16] text-white dark:bg-[#AEC4D4] dark:text-[#220306] text-xs font-bold"
                  >
                    Search
                  </button>
                </form>

                {/* Rating Filter */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-slate-500 dark:text-cream-400 shrink-0">
                    Rating:
                  </span>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-bold text-forest-950 dark:text-cream-50 outline-hidden cursor-pointer"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars Only</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-cream-100 dark:border-forest-850">
                {CATEGORIES.map((cat) => {
                  const isSelected = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#790D16] text-white dark:bg-[#AEC4D4] dark:text-[#220306] shadow-xs font-bold'
                          : 'bg-cream-100 dark:bg-forest-800/60 text-slate-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEEDBACK CARDS GRID */}
            {loading ? (
              <div className="py-14 text-center space-y-2.5">
                <RefreshCw className="w-6 h-6 text-[#790D16] dark:text-[#AEC4D4] animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-500 dark:text-cream-400">
                  Loading community suggestions...
                </p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="py-12 text-center space-y-2.5 bg-white dark:bg-forest-900 rounded-2xl border border-cream-200 dark:border-forest-800 p-6">
                <MessageSquareHeart className="w-10 h-10 text-slate-300 dark:text-forest-700 mx-auto" />
                <h3 className="text-base font-bold text-forest-950 dark:text-cream-50">
                  No feedback found for this filter
                </h3>
                <p className="text-xs text-slate-500 dark:text-cream-400 max-w-md mx-auto">
                  Be the first to share your thoughts, suggest a new restaurant tool, or report an issue!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('submit')}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#790D16] text-white dark:bg-[#AEC4D4] dark:text-[#220306] font-bold text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Feedback Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacks.map((fb) => {
                  const hasUpvoted = upvotedMap[fb._id] || false;
                  return (
                    <div
                      key={fb._id}
                      className="bg-white dark:bg-forest-900 rounded-2xl p-4 sm:p-5 border border-cream-200 dark:border-forest-800 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3.5"
                    >
                      <div className="space-y-2.5">
                        {/* Top row: Author & Business Type & Stars */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-forest-950 dark:text-cream-50">
                                {fb.name}
                              </span>
                              {fb.businessType && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cream-100 dark:bg-forest-800 text-slate-600 dark:text-cream-300 border border-cream-200 dark:border-forest-700">
                                  {fb.businessType}
                                </span>
                              )}
                            </div>
                            {fb.restaurantName && (
                              <p className="text-[11px] text-slate-500 dark:text-cream-400 font-medium flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                {fb.restaurantName}
                              </p>
                            )}
                          </div>

                          {/* Star rating */}
                          <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-900/60 shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= fb.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200 dark:text-forest-800'
                                }`}
                              />
                            ))}
                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 ml-1">
                              {fb.rating}.0
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-display font-bold text-forest-950 dark:text-cream-50 leading-snug">
                          {fb.title}
                        </h3>

                        {/* Message body */}
                        <p className="text-xs text-slate-600 dark:text-cream-200 leading-relaxed whitespace-pre-line">
                          {fb.message}
                        </p>

                        {/* Tags */}
                        {fb.tags && fb.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {fb.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-forest-50 dark:bg-forest-950 text-forest-800 dark:text-lime-300 border border-cream-200 dark:border-forest-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Official Team Response (if present) */}
                      {fb.adminResponse && (
                        <div className="p-3 rounded-xl bg-cream-50 dark:bg-forest-950 border border-forest-200/60 dark:border-forest-800 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-forest-900 dark:text-lime-300 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                            <span className="text-[11px]">Scaletrix Engineering Response</span>
                            {fb.status === 'completed' && (
                              <span className="ml-auto text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                Shipped
                              </span>
                            )}
                            {fb.status === 'planned' && (
                              <span className="ml-auto text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                Planned
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-cream-300 italic leading-relaxed text-[11px]">
                            "{fb.adminResponse}"
                          </p>
                        </div>
                      )}

                      {/* Card Footer: Status & Upvote Button */}
                      <div className="pt-2.5 border-t border-cream-100 dark:border-forest-850 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 dark:text-cream-400">
                          {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpvote(fb._id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            hasUpvoted
                              ? 'bg-[#790D16] text-white dark:bg-[#AEC4D4] dark:text-[#220306] shadow-xs'
                              : 'bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${hasUpvoted ? 'fill-current' : ''}`} />
                          <span className="font-bold">{fb.upvotes || 0}</span>
                          <span className="hidden sm:inline text-[11px]">
                            {hasUpvoted ? 'Endorsed' : 'Upvote'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POST FEEDBACK FORM */}
        {activeTab === 'submit' && (
          <div className="max-w-xl mx-auto bg-white dark:bg-forest-900 rounded-2xl p-5 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#790D16] dark:text-[#AEC4D4] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Voice to Founders</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-forest-950 dark:text-cream-50">
                Post Your Valuable Feedback
              </h2>
              <p className="text-xs text-slate-600 dark:text-cream-300 mt-1">
                Have an idea for a recipe cost multiplier? Noticed a bug? Or want to share how Scaletrix helped your bottom line? Let us know below.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="py-10 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                  Feedback Successfully Posted!
                </h3>
                <p className="text-xs text-slate-600 dark:text-cream-300 max-w-sm mx-auto">
                  Your feedback is now visible on the Community Feedback Wall. We review every single submission during our weekly product sprint.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Rating Selector */}
                <div className="bg-cream-50 dark:bg-forest-950 p-3.5 rounded-xl border border-cream-200 dark:border-forest-800 text-center space-y-1.5">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-cream-300">
                    Your Overall Experience Rating *
                  </span>

                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                        aria-label={`Select ${s} stars`}
                      >
                        <Star
                          className={`w-6 h-6 sm:w-7 sm:h-7 ${
                            s <= activeRating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300 dark:text-forest-800'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-forest-900 dark:text-cream-100 flex items-center justify-center gap-1.5">
                    <span>{RATING_LABELS[activeRating]?.emoji}</span>
                    <span>{RATING_LABELS[activeRating]?.text}</span>
                  </div>
                </div>

                {/* 2. Category selection */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-cream-300 mb-1.5">
                    Feedback Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                      const Icon = cat.icon || Lightbulb;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-[#790D16] text-white border-[#790D16] dark:bg-[#AEC4D4] dark:text-[#220306] dark:border-[#AEC4D4] shadow-xs font-bold'
                              : 'bg-white dark:bg-forest-950 text-slate-700 dark:text-cream-200 border-cream-200 dark:border-forest-700 hover:bg-cream-100 dark:hover:bg-forest-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate text-xs">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Title */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-cream-300 mb-1">
                    Feedback Title / Main Point *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Add batch yield costing for marinades and gravies"
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-semibold text-forest-950 dark:text-cream-50 focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden"
                  />
                </div>

                {/* 4. Message */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-cream-300">
                      Detailed Suggestion or Experience *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {message.length}/2000
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain the operational challenge, how your restaurant handles this today, and what feature or improvement would make your work easier..."
                    className="w-full px-3 py-2 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-medium text-forest-950 dark:text-cream-50 focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden leading-relaxed"
                  />
                </div>

                {/* 5. Topic Tags */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cream-400 mb-1">
                    Select Relevant Tags (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#790D16] text-white dark:bg-[#AEC4D4] dark:text-[#220306] font-bold'
                              : 'bg-cream-100 dark:bg-forest-950 text-slate-600 dark:text-cream-300 border border-cream-200 dark:border-forest-700 hover:bg-cream-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Kitchen & Business Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cream-400 mb-1">
                      Restaurant Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="e.g. Masala Craft Bistro"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-medium text-forest-950 dark:text-cream-50 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cream-400 mb-1">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-semibold text-forest-950 dark:text-cream-50 outline-hidden"
                    >
                      <option value="Cloud Kitchen">Cloud Kitchen</option>
                      <option value="Cafe / Bistro">Cafe / Bistro</option>
                      <option value="Casual Dine-in">Casual Dine-in</option>
                      <option value="Fine Dine">Fine Dining</option>
                      <option value="Bakery / Dessert">Bakery / Dessert</option>
                      <option value="QSR / Street Food">QSR / Kiosk</option>
                      <option value="Dhaba / Regional Eatery">Dhaba / Regional Eatery</option>
                      <option value="Aspiring Food Entrepreneur">Aspiring Food Founder</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* 7. Anonymous Toggle & Info */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pageAnonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#790D16] focus:ring-[#790D16] dark:text-[#AEC4D4] border-cream-300 dark:border-forest-700 cursor-pointer"
                    />
                    <label htmlFor="pageAnonCheck" className="text-xs font-medium text-slate-600 dark:text-cream-300 cursor-pointer">
                      Post as anonymous restaurateur on public wall
                    </label>
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name (Optional)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-medium text-forest-950 dark:text-cream-50 outline-hidden"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (for feature alerts)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-medium text-forest-950 dark:text-cream-50 outline-hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#790D16] hover:bg-[#91111c] text-white dark:bg-[#AEC4D4] dark:hover:bg-[#c3d8e7] dark:text-[#220306] font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Valuable Feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
