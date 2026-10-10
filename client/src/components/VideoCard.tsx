import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Eye, ThumbsUp } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-500 transition-all duration-300">
      {/* Thumbnail */}
      <Link to={`/videos/${video.slug}`} className="relative aspect-video bg-slate-900 overflow-hidden block">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
        />

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-500 transition-all">
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[11px] font-semibold tracking-wide backdrop-blur-xs">
          {video.duration || '10:00'}
        </div>

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-brand-700 dark:text-brand-300 border border-slate-200/50 dark:border-slate-700/50 text-[11px] font-semibold tracking-wide backdrop-blur-xs">
          {video.category}
        </div>
      </Link>

      {/* Meta */}
      <div className="p-4 flex gap-3 flex-1">
        <Link to={`/videos/${video.slug}`} className="shrink-0 pt-0.5">
          <img
            src={video.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={video.creator?.name || 'Creator'}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/videos/${video.slug}`} className="block">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
              {video.title}
            </h4>
          </Link>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
              {video.creator?.channelName || video.creator?.name || 'Creator'}
            </span>
            {video.creator?.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0 fill-brand-50 dark:fill-brand-950" />
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {video.viewsCount.toLocaleString()} views
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {video.likesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
