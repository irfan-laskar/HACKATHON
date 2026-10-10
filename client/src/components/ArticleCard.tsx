import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  return (
    <article
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-500 transition-all duration-300 flex flex-col ${
        featured ? 'md:grid md:grid-cols-2 md:gap-6' : ''
      }`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-video sm:aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/90 text-brand-700 dark:text-brand-300 border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-xs">
            {article.category}
          </span>
          {article.difficulty && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-xs capitalize">
              {article.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.viewsCount.toLocaleString()} views
            </span>
          </div>

          <Link to={`/articles/${article.slug}`} className="block">
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Author & Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={article.author?.name || 'Author'}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
              {article.author?.name || 'MarketSphere Editorial'}
            </span>
          </div>

          <Link
            to={`/articles/${article.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group-hover:translate-x-0.5 transition-transform"
          >
            Read <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
