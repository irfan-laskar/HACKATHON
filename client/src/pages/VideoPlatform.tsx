import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Video as VideoIcon, Search, UploadCloud, Play } from 'lucide-react';
import api from '../api/axios';
import { Video } from '../types';
import { VideoCard } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

export const VideoPlatform: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Digital Marketing',
    'Product & Food Photography',
    'GST & Business Registration',
    'Small Business Growth',
    'Branding & Brand Strategy',
    'Influencer Marketing',
  ];

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let url = `/videos?sort=${sortBy}`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideos();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Platform Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800 transition-colors">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
            <Play className="w-3 h-3 fill-sky-300" />
            <span>Open Educational Video Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            Watch & Learn from Verified Educators
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            YouTube-style educational video library dedicated 100% to commercial photography,
            marketing blueprints, GST filings, and business growth. Free for everyone.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/creator/dashboard"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs tracking-wide shadow-md transition flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Creator Studio Upload</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="space-y-4">
        {/* Category chips scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search video tutorials..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition"
            >
              <option value="popular">Most Popular</option>
              <option value="-createdAt">Newest Uploads</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 dark:text-slate-500">Loading educational videos...</div>
      ) : videos.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <VideoIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No educational videos found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Be the first to publish a tutorial for this topic in the Creator Studio!
          </p>
          <Link
            to="/creator/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Upload Lesson
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
