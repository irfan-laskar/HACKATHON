import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Video as VideoIcon, User as UserIcon, ArrowRight, CornerDownLeft } from 'lucide-react';
import api from '../api/axios';

import { YoutubeIcon } from './icons/YoutubeIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.data.success) {
          setSuggestions(res.data.suggestions);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      handleFullSearch();
    }
  };

  const handleFullSearch = () => {
    if (!query.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (item: any) => {
    onClose();
    if (item.type === 'article') {
      navigate(`/articles/${item.slug}`);
    } else if (item.type === 'video') {
      navigate(`/videos/${item.slug}`);
    } else if (item.type === 'category') {
      navigate(`/categories/${item.slug}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
        >
          {/* Input header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search marketing lessons, videos, legal guides, GST..."
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Quick links or suggestions */}
          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {suggestions.length > 0 ? (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1">
                  Suggestions
                </div>
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                        {item.type === 'article' && <BookOpen className="w-4 h-4" />}
                        {item.type === 'video' && <VideoIcon className="w-4 h-4" />}
                        {item.type === 'category' && <UserIcon className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                          {item.type} • {item.category}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition shrink-0" />
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 && !loading ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm space-y-4">
                <p>
                  No direct platform articles found for "<span className="font-semibold text-slate-700 dark:text-slate-300">{query.trim()}</span>".
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    onClick={handleFullSearch}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/25 transition cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Knowledge Hub for "{query.trim()}"</span>
                  </button>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim() + ' tutorial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-xs transition"
                  >
                    <YoutubeIcon size={16} />
                    <span>Search on YouTube</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-2">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Popular Learning Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'The 4Ps of Marketing',
                    'GST Invoicing',
                    'Udyam MSME',
                    'Smartphone Photography',
                    'Brand Positioning',
                    'Google Maps SEO',
                    'Influencer Outreach Pitch',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                      }}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-700 dark:hover:text-brand-300 text-xs text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {query.trim() && (
            <div className="bg-slate-50 dark:bg-slate-950/80 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim() + ' marketing business tutorial')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold transition"
                >
                  <YoutubeIcon size={15} />
                  <span>Search on YouTube</span>
                </a>
              </div>
              <button
                onClick={handleFullSearch}
                className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold cursor-pointer"
              >
                <span>View all results</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
