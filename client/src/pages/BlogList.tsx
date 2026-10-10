import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Feather, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/articles?limit=18');
      if (res.data.success) {
        setBlogs(res.data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Community Blog & Insights
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
            Founder Stories & Marketing Essays
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            In-depth perspectives written by practitioners, creators, and entrepreneurs scaling in
            today’s competitive landscape.
          </p>
        </div>

        <Link
          to="/blog/create"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write an Article</span>
        </Link>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 dark:text-slate-500">Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Feather className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No blog posts yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share your startup journey or marketing tips by creating the first post.
          </p>
          <Link
            to="/blog/create"
            className="inline-block px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700"
          >
            Create Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <ArticleCard key={b._id} article={b} />
          ))}
        </div>
      )}
    </div>
  );
};
