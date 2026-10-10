import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, ExternalLink, ArrowRight, CheckCircle2, Compass, Layers } from 'lucide-react';
import { KnowledgeBrief } from '../types';

interface KnowledgeCardProps {
  brief: KnowledgeBrief;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ brief }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900/90 via-slate-900 to-sky-950 text-white border border-brand-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Badge & Title */}
      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Universal Knowledge Engine • Instant Educational Brief</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight leading-snug">
            {brief.title}
          </h2>

          {brief.description && (
            <p className="text-xs sm:text-sm font-medium text-brand-300/90 capitalize">
              {brief.description}
            </p>
          )}

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal pt-1">
            {brief.extract}
          </p>
        </div>

        {/* Thumbnail if available */}
        {brief.thumbnail && (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0 shadow-lg hidden sm:block self-center md:self-start">
            <img
              src={brief.thumbnail}
              alt={brief.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Key Takeaways */}
      {brief.keyTakeaways && brief.keyTakeaways.length > 0 && (
        <div className="relative pt-4 border-t border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Core Principles & Key Concepts</span>
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
            {brief.keyTakeaways.map((point, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5 backdrop-blur-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Topics & Quick Jumpers */}
      <div className="relative pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 text-xs">
        {/* Connected Topics */}
        {brief.relatedTopics && brief.relatedTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>Related Concepts:</span>
            </span>
            {brief.relatedTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600/40 text-slate-300 hover:text-white border border-slate-700 hover:border-brand-500/50 transition cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* External Deep-Read link */}
        {brief.sourceUrl && (
          <a
            href={brief.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-300 hover:text-white font-semibold transition group ml-auto"
          >
            <span>Read full encyclopedia reference</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
};
