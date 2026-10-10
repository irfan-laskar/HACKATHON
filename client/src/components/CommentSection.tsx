import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { Comment } from '../types';

interface CommentSectionProps {
  targetType: 'article' | 'video';
  targetId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/interactions/comments?targetType=${targetType}&targetId=${targetId}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      fetchComments();
    }
  }, [targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please log in to leave a question or comment.', 'info');
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/interactions/comments', {
        targetType,
        targetId,
        content: content.trim(),
      });
      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setContent('');
        showToast('Comment posted successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await api.delete(`/interactions/comments/${commentId}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        showToast('Comment deleted', 'info');
      }
    } catch {
      showToast('Failed to delete comment', 'error');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
          Community Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="flex-1 space-y-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ask an educational question, share your experience, or add practical context..."
                rows={3}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-sm transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm text-brand-900 dark:text-brand-200">
            <AlertCircle className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>Join the discussion! Log in to ask questions or share insights with creators.</span>
          </div>
          <Link
            to="/login"
            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition shrink-0 ml-4"
          >
            Log In
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
            Be the first to share a question or thought!
          </div>
        ) : (
          comments.map((comment) => {
            const commentUserId = comment.user?._id || String(comment.user);
            const isOwner = user && (user._id === commentUserId);
            const isAdmin = user && user.role === 'admin';

            return (
              <div
                key={comment._id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-start gap-3.5 group hover:border-slate-200 dark:hover:border-slate-700 transition"
              >
                <img
                  src={comment.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={comment.user?.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {comment.user?.name || 'Community Member'}
                      </span>
                      {comment.user?.role === 'creator' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                          Creator
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {(isOwner || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment._id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-rose-500 transition p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
