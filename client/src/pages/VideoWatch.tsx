import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ThumbsUp,
  Share2,
  Flag,
  CheckCircle2,
  Eye,
  Sparkles,
  UserPlus,
  UserCheck,
  Play,
  ArrowLeft,
} from 'lucide-react';
import api from '../api/axios';
import { Video } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CommentSection } from '../components/CommentSection';
import { ReportModal } from '../components/ReportModal';

export const VideoWatch: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, toggleFollow } = useAuth();
  const { showToast } = useToast();

  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Likes and follow states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/videos/${slug}`);
        if (res.data.success) {
          setVideo(res.data.video);
          setLikesCount(res.data.video.likesCount);
          setRelatedVideos(res.data.related || []);

          if (res.data.video.creator) {
            setFollowersCount(res.data.video.creator.followersCount || 0);
            if (user && res.data.video.creator.followers) {
              const followingCheck = res.data.video.creator.followers.includes(user._id);
              setIsFollowing(followingCheck);
            }
          }

          if (user) {
            const likeRes = await api.get(
              `/interactions/like-status?targetType=video&targetId=${res.data.video._id}`
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

    if (slug) fetchVideo();
  }, [slug, user]);

  const handleToggleLike = async () => {
    if (!user) {
      showToast('Please log in to like this educational video.', 'info');
      return;
    }
    if (!video) return;

    try {
      const res = await api.post('/interactions/like', {
        targetType: 'video',
        targetId: video._id,
      });
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch {
      showToast('Like update failed.', 'error');
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      showToast('Please log in to follow this creator.', 'info');
      return;
    }
    if (!video || !video.creator) return;

    try {
      const res = await toggleFollow(video.creator._id);
      setIsFollowing(res.isFollowing);
      setFollowersCount(res.followersCount);
      showToast(
        res.isFollowing ? `Subscribed to ${video.creator.name}` : `Unsubscribed`,
        'info'
      );
    } catch {
      showToast('Follow update failed.', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Video URL copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-400 dark:text-slate-500">
        Loading educational video player...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Video not found</h2>
        <Link to="/videos" className="text-brand-600 dark:text-brand-400 font-semibold inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Videos
        </Link>
      </div>
    );
  }

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getVimeoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(video.videoUrl);
  const vimeoId = getVimeoId(video.videoUrl);

  // Format video url if local static vs external
  const finalVideoSrc = video.videoUrl.startsWith('/uploads')
    ? `http://localhost:5000${video.videoUrl}`
    : video.videoUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player & Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Responsive HTML5 or YouTube Embed Video Player */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : vimeoId ? (
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                title={video.title}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={finalVideoSrc}
                controls
                poster={video.thumbnailUrl}
                className="w-full h-full object-contain"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Title and Metadata */}
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white leading-snug">
              {video.title}
            </h1>

            {/* Creator Channel Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={video.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={video.creator?.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-slate-100">
                    <span>{video.creator?.channelName || video.creator?.name}</span>
                    {video.creator?.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 fill-brand-50 dark:fill-brand-950" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {followersCount.toLocaleString()} Subscribers
                  </p>
                </div>

                {/* Subscribe / Follow Button */}
                <button
                  onClick={handleToggleFollow}
                  className={`ml-3 px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      : 'bg-slate-900 dark:bg-brand-600 text-white hover:bg-slate-800 dark:hover:bg-brand-500 shadow-xs'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions: Likes, Share, Report */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition cursor-pointer ${
                    isLiked
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 pointer-events-none ${isLiked ? 'fill-brand-600 text-brand-600' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Share video"
                  aria-label="Share video"
                >
                  <Share2 className="w-3.5 h-3.5 pointer-events-none" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Report non-educational content"
                  aria-label="Report non-educational content"
                >
                  <Flag className="w-3.5 h-3.5 pointer-events-none" />
                </button>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {video.viewsCount.toLocaleString()} views
                </span>
                <span>•</span>
                <span>Category: {video.category}</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {video.description}
              </p>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {video.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-brand-700 dark:text-brand-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Educational Learning Objectives Box */}
            {video.learningObjectives && video.learningObjectives.length > 0 && (
              <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  What You Will Learn in this Lesson
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-sky-950 dark:text-sky-200">
                  {video.learningObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Video Comments Section */}
          <CommentSection targetType="video" targetId={video._id} />
        </div>

        {/* Up Next / Related Videos Sidebar */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-brand-600 dark:text-brand-400 fill-brand-600 dark:fill-brand-400" />
            Recommended Video Lessons
          </h3>

          <div className="space-y-4">
            {relatedVideos.map((rel) => (
              <div
                key={rel._id}
                className="flex gap-3 group bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-500 hover:shadow-md transition"
              >
                <Link to={`/videos/${rel.slug}`} className="relative w-36 aspect-video bg-slate-900 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={rel.thumbnailUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] text-white font-medium">
                    {rel.duration}
                  </span>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <Link to={`/videos/${rel.slug}`} className="block">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {rel.creator?.name || 'Creator'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {rel.viewsCount.toLocaleString()} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="video"
        targetId={video._id}
        targetTitle={video.title}
      />
    </div>
  );
};
