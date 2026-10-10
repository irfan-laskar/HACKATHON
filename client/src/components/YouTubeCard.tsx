import React from 'react';
import { Play, ExternalLink, Calendar } from 'lucide-react';
import { YouTubeVideo } from '../types';
import { YoutubeIcon } from './icons/YoutubeIcon';

interface YouTubeCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}

export const YouTubeCard: React.FC<YouTubeCardProps> = ({ video, onPlay }) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-xl hover:border-red-300 dark:hover:border-red-500/50 transition-all duration-300">
      {/* Thumbnail */}
      <div
        onClick={() => onPlay(video)}
        className="relative aspect-video bg-slate-950 overflow-hidden block cursor-pointer"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
          <YoutubeIcon size={14} />
          <span className="text-[10px] font-bold text-white tracking-wider uppercase">YouTube</span>
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div>
          <button
            onClick={() => onPlay(video)}
            className="text-left font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {video.title}
          </button>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
            {video.channelTitle}
          </p>

          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onPlay(video)}
            className="flex-1 py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch In-App</span>
          </button>

          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Open on YouTube.com"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
