import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Globe } from 'lucide-react';
import api from '../api/axios';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Please sign in to view your profile</h2>
        <a href="/login" className="px-5 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl inline-block">
          Sign In
        </a>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        bio: bio.trim(),
        website: website.trim(),
        avatar: avatar.trim(),
      });
      if (res.data.success) {
        showToast('Profile updated successfully!', 'success');
        await refreshUser();
        setIsEditing(false);
      }
    } catch {
      showToast('Profile update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">{user.name}</h1>
                <p className="text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition self-center sm:self-auto"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {user.bio || 'Learner and entrepreneur exploring market growth strategies.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full font-bold uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                {user.role} Account
              </span>
              <span>{user.followersCount || 0} Followers</span>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{user.website.replace('https://', '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-800 dark:text-slate-200 tracking-wider">Update Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Website / Portfolio
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://mybrand.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Bio & Background
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm resize-none focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-xs hover:bg-brand-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
