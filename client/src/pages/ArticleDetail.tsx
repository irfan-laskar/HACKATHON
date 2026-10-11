import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Eye,
  Heart,
  Share2,
  Flag,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/axios';
import { Article } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CommentSection } from '../components/CommentSection';
import { ReportModal } from '../components/ReportModal';
import { ArticleCard } from '../components/ArticleCard';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Likes & interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/articles/${slug}`);
        if (res.data.success) {
          setArticle(res.data.article);
          setLikesCount(res.data.article.likesCount);
          setRelatedArticles(res.data.related || []);

          // Check like status if authenticated
          if (user) {
            const likeRes = await api.get(
              `/interactions/like-status?targetType=article&targetId=${res.data.article._id}`
            );
            if (likeRes.data.success) {
              setIsLiked(likeRes.data.isLiked);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchArticle();
  }, [slug, user]);

  const handleToggleLike = async () => {
    if (!user) {
      showToast('Please log in to like this educational lesson.', 'info');
      return;
    }
    if (!article) return;

    try {
      const res = await api.post('/interactions/like', {
        targetType: 'article',
        targetId: article._id,
      });
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch {
      showToast('Failed to update like.', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Lesson link copied to clipboard!', 'success');
  };

  const toggleChecklist = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-400 dark:text-slate-500">
        Loading educational lesson...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Article not found</h2>
        <Link to="/knowledge-hub" className="text-brand-600 dark:text-brand-400 underline">
          Return to Knowledge Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <Link
          to="/knowledge-hub"
          className="inline-flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Knowledge Hub
        </Link>
        <span className="capitalize">{article.category} • {article.subcategory || 'Lesson'}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900">
            {article.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
            {article.difficulty} level
          </span>
          {article.lastVerifiedDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Verified {new Date(article.lastVerifiedDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Author Meta Strip */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={article.author?.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-slate-100">
                <span>{article.author?.name}</span>
                {article.author?.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 fill-brand-50 dark:fill-brand-950" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {article.author?.bio || 'Educational Creator & Strategy Mentor'}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.viewsCount.toLocaleString()} views
            </span>

            {/* Like button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 pointer-events-none ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Share lesson"
              aria-label="Share lesson"
            >
              <Share2 className="w-3.5 h-3.5 pointer-events-none" />
            </button>

            {/* Report flag */}
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Report content"
              aria-label="Report content"
            >
              <Flag className="w-3.5 h-3.5 pointer-events-none" />
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actionable Interactive Checklists (If present) */}
      {article.checklists && article.checklists.length > 0 && (
        <div className="p-6 rounded-2xl bg-brand-50/60 dark:bg-slate-900/90 border border-brand-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-brand-950 dark:text-white font-display">
              Actionable Implementation Checklist
            </h3>
          </div>
          <p className="text-xs text-brand-700 dark:text-brand-300">
            Check off each milestone as you put this lesson into practice:
          </p>
          <div className="space-y-2 pt-1">
            {article.checklists.map((c, idx) => (
              <label
                key={idx}
                onClick={() => toggleChecklist(idx)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer text-xs sm:text-sm ${
                  checkedItems[idx]
                    ? 'bg-brand-100/70 dark:bg-slate-800/80 border-brand-300 dark:border-slate-700 text-brand-950 dark:text-slate-400 line-through opacity-80'
                    : 'bg-white dark:bg-slate-800/50 border-brand-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-200 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[idx])}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="leading-relaxed">{c.item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Main Prose Content */}
      <section className="pt-2">
        <MarkdownRenderer content={article.content} showOutline={true} />
      </section>

      {/* Common Mistakes Warning Callout */}
      {article.commonMistakes && article.commonMistakes.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-display text-base">Critical Mistakes to Avoid</h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-amber-900 dark:text-amber-300">
            {article.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Tools Grid */}
      {article.tools && article.tools.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Recommended Tools & Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.tools.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                  {t.url && (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-xs font-semibold flex items-center gap-1"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {t.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Links (e.g. Government portals for legal/GST) */}
      {article.officialLinks && article.officialLinks.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white space-y-3 border border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Authoritative & Government Portals
          </h4>
          <div className="space-y-2">
            {article.officialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 transition text-xs sm:text-sm font-medium text-slate-200"
              >
                <span>{link.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      {article.faq && article.faq.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {article.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Comments Section */}
      <CommentSection targetType="article" targetId={article._id} />

      {/* Related Educational Lessons */}
      {relatedArticles.length > 0 && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Related Educational Lessons in {article.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel._id} article={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="article"
        targetId={article._id}
        targetTitle={article.title}
      />
    </div>
  );
};
