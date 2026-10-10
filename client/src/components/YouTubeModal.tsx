import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, UserCheck } from 'lucide-react';
import { YouTubeVideo } from '../types';
import { YoutubeIcon } from './icons/YoutubeIcon';

interface YouTubeModalProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const YouTubeModal: React.FC<YouTubeModalProps> = ({ video, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <YoutubeIcon size={24} />
              <span className="text-sm font-bold text-white tracking-wide">
                YouTube Educational Tutorial
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`${video.embedUrl}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Video Details */}
          <div className="p-6 overflow-y-auto space-y-3 bg-slate-900/90 text-left">
            <h3 className="text-lg font-bold text-white font-display leading-snug">
              {video.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <UserCheck className="w-4 h-4 text-red-500" />
                <span>{video.channelTitle}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {video.description}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
