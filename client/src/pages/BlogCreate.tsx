import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const BlogCreate: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  );
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [publishing, setPublishing] = useState(false);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Sign in to Publish</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You must be logged in to write and publish articles on MarketSphere.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      showToast('Please fill all required article fields.', 'error');
      return;
    }

    setPublishing(true);
    try {
      const res = await api.post('/articles', {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage: coverImage.trim(),
        guideSection: 'blog',
        difficulty,
      });

      if (res.data.success) {
        showToast('Article published successfully!', 'success');
        navigate(`/articles/${res.data.article.slug}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Publishing failed.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Write an Educational Article
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'write' ? 'bg-slate-900 dark:bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-slate-900 dark:bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'write' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Organic Marketing Frameworks for Home Businesses"
                required
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base font-bold focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Short Summary / Excerpt * (Max 300 chars)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise description highlighting key lessons learned..."
                rows={2}
                maxLength={300}
                required
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 resize-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                >
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Small Business Growth">Small Business Growth</option>
                  <option value="Product & Food Photography">Product & Food Photography</option>
                  <option value="GST & Business Registration">GST & Business Registration</option>
                  <option value="Branding & Brand Strategy">Branding & Brand Strategy</option>
                  <option value="Influencer Marketing">Influencer Marketing</option>
                  <option value="Content Creation">Content Creation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500 capitalize"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Marketing, Growth, Strategy"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Article Body (Markdown Supported) *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your in-depth educational lesson here... You can use ## Headings, - bullet points, and practical steps."
                rows={16}
                required
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">{title || 'Untitled Article'}</h1>
            <p className="text-base text-slate-600 dark:text-slate-300 italic">{excerpt || 'No excerpt provided yet.'}</p>
            {coverImage && (
              <img src={coverImage} alt="Cover Preview" className="w-full aspect-video rounded-2xl object-cover" />
            )}
            <div className="prose-educational whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed pt-4 border-t border-slate-100 dark:border-slate-800">
              {content || 'Start typing in the Editor tab to preview article layout.'}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={publishing}
            className="px-7 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold text-xs tracking-wide shadow-md transition disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
};
