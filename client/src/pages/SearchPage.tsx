import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Video as VideoIcon,
  Users,
  ExternalLink,
  Sparkles,
  Compass,
  Globe,
  HelpCircle,
  FileText,
} from 'lucide-react';
import api from '../api/axios';
import { ArticleCard } from '../components/ArticleCard';
import { VideoCard } from '../components/VideoCard';
import { YouTubeCard } from '../components/YouTubeCard';
import { YouTubeModal } from '../components/YouTubeModal';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { YoutubeIcon } from '../components/icons/YoutubeIcon';
import { YouTubeVideo, KnowledgeBrief } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const [activeTab, setActiveTab] = useState<'all' | 'knowledge' | 'articles' | 'videos' | 'youtube' | 'creators'>('all');
  const [results, setResults] = useState<{
    articles: any[];
    videos: any[];
    creators: any[];
    categories: any[];
    youtube: YouTubeVideo[];
    knowledge: KnowledgeBrief | null;
  }>({ articles: [], videos: [], creators: [], categories: [], youtube: [], knowledge: null });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // YouTube in-page playback modal
  const [selectedYouTubeVideo, setSelectedYouTubeVideo] = useState<YouTubeVideo | null>(null);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const executeSearch = async () => {
      if (!query.trim()) {
        setResults({ articles: [], videos: [], creators: [], categories: [], youtube: [], knowledge: null });
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query.trim())}&type=all`);
        if (res.data.success) {
          setResults({
            articles: res.data.results.articles || [],
            videos: res.data.results.videos || [],
            creators: res.data.results.creators || [],
            categories: res.data.results.categories || [],
            youtube: res.data.results.youtube || [],
            knowledge: res.data.results.knowledge || null,
          });
          setTotalCount(res.data.totalCount || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handlePlayYouTube = (video: YouTubeVideo) => {
    setSelectedYouTubeVideo(video);
    setIsYouTubeModalOpen(true);
  };

  const directYouTubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query.trim() + ' tutorial'
  )}`;
  const directGoogleUrl = `https://www.google.com/search?q=${encodeURIComponent(
    query.trim() + ' marketing business guide'
  )}`;
  const directWikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query.trim())}`;

  const hasAnyResults =
    results.knowledge !== null ||
    results.articles.length > 0 ||
    results.videos.length > 0 ||
    results.youtube.length > 0 ||
    results.creators.length > 0 ||
    results.categories.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header & Interactive Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Universal Search Hub: <span className="text-brand-600 dark:text-brand-400">"{query}"</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore instant educational overviews, YouTube tutorials, platform guides, and verified mentors for any topic.
            </p>
          </div>

          {/* Inline Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
            <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xs focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any marketing, business or technical topic..."
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs tracking-wide transition shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-2 pt-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Insights ({totalCount + (results.knowledge ? 1 : 0)})
          </button>

          {results.knowledge && (
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Knowledge Brief</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'youtube'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            <YoutubeIcon size={14} />
            <span>YouTube Videos ({results.youtube.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'articles'
                ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Articles & Guides ({results.articles.length})
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'videos'
                ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Platform Lessons ({results.videos.length})
          </button>

          <button
            onClick={() => setActiveTab('creators')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'creators'
                ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Creators & Mentors ({results.creators.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400 dark:text-slate-500 space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm">Synthesizing universal knowledge brief and querying video streams...</p>
        </div>
      ) : !hasAnyResults ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 shadow-sm">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No direct entry found for "{query}"
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You can search external repositories directly with 1 click:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={directGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Search on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={directYouTubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition"
            >
              <YoutubeIcon size={16} />
              <span>Search on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* 1. TOP HERO: Instant Knowledge Card (Available for ANY query) */}
          {(activeTab === 'all' || activeTab === 'knowledge') && results.knowledge && (
            <section className="space-y-4">
              <KnowledgeCard brief={results.knowledge} />
            </section>
          )}

          {/* 2. Quick Research Launchpad Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Universal Search Launchpad for "{query}"
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Quickly query official external repositories and search engines with zero friction
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={directGoogleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Google</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={directYouTubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-900/40 transition"
              >
                <YoutubeIcon size={14} />
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 text-red-500" />
              </a>

              <a
                href={directWikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Wikipedia</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* 3. Matching Disciplines */}
          {(activeTab === 'all' || activeTab === 'articles') && results.categories.length > 0 && (
            <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-brand-900 dark:text-brand-200">Matching Disciplines:</span>
              {results.categories.map((c) => (
                <Link
                  key={c._id}
                  to={`/knowledge-hub?category=${encodeURIComponent(c.name)}`}
                  className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-slate-700"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* 4. YouTube Video Results Section */}
          {(activeTab === 'all' || activeTab === 'youtube') && results.youtube.length > 0 && (
            <section className="space-y-4 p-6 rounded-3xl bg-red-50/40 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-red-200/60 dark:border-red-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-red-600 text-white">
                    <YoutubeIcon size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                      <span>YouTube Video Tutorials</span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        ({results.youtube.length} lessons)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      High-yield masterclasses & tutorials playable directly in Scaletrix
                    </p>
                  </div>
                </div>

                <a
                  href={directYouTubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>More on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {results.youtube.map((ytVideo) => (
                  <YouTubeCard key={ytVideo.id} video={ytVideo} onPlay={handlePlayYouTube} />
                ))}
              </div>
            </section>
          )}

          {/* 5. Verified Creators */}
          {(activeTab === 'all' || activeTab === 'creators') && results.creators.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Verified Creators & Mentors</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.creators.map((cr) => (
                  <div
                    key={cr._id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3.5"
                  >
                    <img
                      src={cr.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={cr.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {cr.channelName || cr.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{cr.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. Articles & Guides */}
          {(activeTab === 'all' || activeTab === 'articles') && results.articles.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Platform Articles & Guides ({results.articles.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.articles.map((art) => (
                  <ArticleCard key={art._id} article={art} />
                ))}
              </div>
            </section>
          )}

          {/* 7. Platform Video Lessons */}
          {(activeTab === 'all' || activeTab === 'videos') && results.videos.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Platform Video Lessons ({results.videos.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.videos.map((vid) => (
                  <VideoCard key={vid._id} video={vid} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Embedded In-Page YouTube Video Player Modal */}
      <YouTubeModal
        video={selectedYouTubeVideo}
        isOpen={isYouTubeModalOpen}
        onClose={() => {
          setIsYouTubeModalOpen(false);
          setSelectedYouTubeVideo(null);
        }}
      />
    </div>
  );
};
