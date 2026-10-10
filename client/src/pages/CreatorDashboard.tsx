import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Film,
  Eye,
  ThumbsUp,
  MessageSquare,
  Trash2,
  AlertCircle,
  Play,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { Video } from '../types';

export const CreatorDashboard: React.FC = () => {
  const { user, becomeCreator } = useAuth();
  const { showToast } = useToast();

  const [videos, setVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [tags, setTags] = useState('');
  const [duration, setDuration] = useState('10:00');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Upgrade Creator State
  const [channelName, setChannelName] = useState('');
  const [bio, setBio] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  const fetchDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/videos/creator/dashboard');
      if (res.data.success) {
        setVideos(res.data.videos);
        setStats(res.data.stats);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'creator' || user.role === 'admin')) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleBecomeCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgrading(true);
    try {
      await becomeCreator({ channelName, bio });
      showToast('Welcome to Scaletrix Creator Studio!', 'success');
      fetchDashboard();
    } catch {
      showToast('Failed to activate Creator status.', 'error');
    } finally {
      setUpgrading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      showToast('Please fill all required educational fields.', 'error');
      return;
    }
    if (!videoFile && !videoUrl.trim()) {
      showToast('Please provide an MP4 video file or valid stream URL.', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('duration', duration);
      formData.append('tags', tags);
      formData.append('learningObjectives', learningObjectives);

      if (videoFile) {
        formData.append('video', videoFile);
      } else {
        formData.append('videoUrl', videoUrl.trim());
      }

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (thumbnailUrl.trim()) {
        formData.append('thumbnailUrl', thumbnailUrl.trim());
      }

      const res = await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        showToast('Video published successfully to the platform!', 'success');
        setShowUploadModal(false);
        // Reset form
        setTitle('');
        setDescription('');
        setTags('');
        setVideoUrl('');
        setThumbnailUrl('');
        setVideoFile(null);
        setThumbnailFile(null);
        fetchDashboard();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Video upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this educational video?')) return;
    try {
      const res = await api.delete(`/videos/${videoId}`);
      if (res.data.success) {
        showToast('Video removed successfully.', 'info');
        fetchDashboard();
      }
    } catch {
      showToast('Failed to delete video.', 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-brand-600 dark:text-brand-400 mx-auto" />
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Sign in to Access Creator Studio</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign in or create an account to publish educational marketing and business lessons.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700"
        >
          Sign In
        </a>
      </div>
    );
  }

  // If user is not yet a creator, show 1-click activation form
  if (user.role === 'user') {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Activate Your Creator Profile
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Join Scaletrix's educator network to upload tutorials, build your personal brand, and
            mentor thousands of indie entrepreneurs.
          </p>
        </div>

        <form onSubmit={handleBecomeCreator} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Academy / Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="e.g. D2C Growth Academy"
              required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Creator Bio & Expertise
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell learners about your experience in marketing, photography, tax, or business..."
              rows={3}
              required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={upgrading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            {upgrading ? 'Activating Studio...' : 'Activate Creator Studio'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Creator Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
            {user.channelName || user.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your uploaded educational lessons, track engagement, and upload new masterclasses.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition flex items-center gap-2 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Video Lesson</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase">Published Videos</span>
            <Film className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <p className="text-2xl font-black font-display text-slate-900 dark:text-white">{stats.totalVideos}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Views</span>
            <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <p className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {stats.totalViews.toLocaleString()}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Likes</span>
            <ThumbsUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {stats.totalLikes.toLocaleString()}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase">Questions & Comments</span>
            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {stats.totalComments.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Uploaded Videos Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Uploaded Educational Videos</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">{videos.length} videos listed</span>
        </div>

        {videos.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 space-y-3">
            <Film className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm">You haven't uploaded any educational videos yet.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
            >
              Upload First Video
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Video</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Likes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {videos.map((vid) => (
                  <tr key={vid._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-16 h-10 object-cover rounded-lg bg-slate-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/videos/${vid.slug}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate block max-w-xs"
                        >
                          {vid.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          Duration: {vid.duration} • {new Date(vid.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{vid.category}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {vid.viewsCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{vid.likesCount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {vid.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/videos/${vid.slug}`}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                          title="Watch"
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteVideo(vid._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                          title="Delete video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Upload Educational Video
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be strictly educational (marketing, photography, GST, business growth).
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to File GSTR-1 for Small Businesses"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Comprehensive Educational Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain concepts covered, examples, time-stamps, and summary..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Discipline / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Product & Food Photography">Product & Food Photography</option>
                    <option value="GST & Business Registration">GST & Business Registration</option>
                    <option value="Small Business Growth">Small Business Growth</option>
                    <option value="Branding & Brand Strategy">Branding & Brand Strategy</option>
                    <option value="Influencer Marketing">Influencer Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Approx Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 12:45"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="GST, Invoicing, Tax, SMB"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Key Learning Objectives (One per line)
                </label>
                <textarea
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  placeholder="Understand HSN codes&#10;File nil returns&#10;Avoid late fee penalties"
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 resize-none font-mono text-xs"
                />
              </div>

              {/* Media File Upload or URL */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block">
                  Video Source (File Upload or Stream URL)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Upload MP4 / WebM File
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                      className="text-xs text-slate-600 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Or Direct Video URL
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Custom Thumbnail File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
                      className="text-xs text-slate-600 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Or Thumbnail Image URL
                    </label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs tracking-wide shadow-md transition disabled:opacity-50"
                >
                  {uploading ? 'Processing & Uploading...' : 'Publish Video Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
