import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { User, Report } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state for users
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?role=${userRoleFilter}&search=${encodeURIComponent(userSearch)}`),
        api.get('/admin/reports?status=pending'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (reportsRes.data.success) setReports(reportsRes.data.reports);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load admin portal data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user, userRoleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        showToast(`User role updated to ${newRole}`, 'success');
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
        );
      }
    } catch {
      showToast('Role update failed.', 'error');
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    const reason = nextStatus
      ? prompt('Enter suspension reason:', 'Violation of educational guidelines')
      : '';
    if (nextStatus && !reason) return;

    try {
      const res = await api.put(`/admin/users/${userId}/suspend`, {
        isSuspended: nextStatus,
        suspensionReason: reason,
      });
      if (res.data.success) {
        showToast(nextStatus ? 'Account suspended.' : 'Account reinstated.', 'info');
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isSuspended: nextStatus } : u))
        );
      }
    } catch {
      showToast('Suspension action failed.', 'error');
    }
  };

  const handleResolveReport = async (reportId: string, action: 'dismiss' | 'take_action') => {
    try {
      const res = await api.put(`/admin/reports/${reportId}/resolve`, {
        status: action === 'dismiss' ? 'dismissed' : 'action_taken',
        resolutionNotes:
          action === 'dismiss'
            ? 'Reviewed by admin; content meets educational guidelines.'
            : 'Unpublished or sanitized by administrator due to policy non-compliance.',
      });
      if (res.data.success) {
        showToast(action === 'dismiss' ? 'Report dismissed.' : 'Action taken on reported item.', 'info');
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      }
    } catch {
      showToast('Failed to resolve report.', 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Restricted Administrator Area</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Only authorized MarketSphere compliance administrators can access this portal.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Tip: Log in with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">admin@marketsphere.com</code> / <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">admin123456</code> to test admin capabilities.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Compliance & Moderation Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
            Platform Administrator Dashboard
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Users & Roles
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'moderation' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Moderation Queue</span>
            {reports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {reports.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Total Users</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Verified Creators</span>
              <p className="text-2xl font-black text-brand-600 dark:text-brand-400">{stats?.totalCreators || 0}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Articles Published</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalArticles || 0}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Videos Streamed</span>
              <p className="text-2xl font-black text-sky-600 dark:text-sky-400">{stats?.totalVideos || 0}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Cumulative Views</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats?.totalViews?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
              System Health & Storage Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Database State</span>
                <span>Active Mongoose Models & Resilient In-Memory Fallback</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Media Storage</span>
                <span>Hybrid Local Server (/uploads) + Cloudinary Cloud Storage</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Content Moderation</span>
                <span>Educational-Only Classification with Human Review Queue</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS AND ROLE CONTROLS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">User Management</h2>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
              >
                <option value="all">All Roles</option>
                <option value="user">Learner (User)</option>
                <option value="creator">Creator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Change Role</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">{u.name}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.isSuspended ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        <option value="user">User (Learner)</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleSuspend(u._id, u.isSuspended)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          u.isSuspended
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {u.isSuspended ? 'Reinstate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Educational Moderation Review Queue
              </h2>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">{reports.length} pending items</span>
          </div>

          {reports.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Review queue is clear!</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                All reported community content has been reviewed and resolved.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded font-bold uppercase bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                      Reason: {report.reason.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      Reported by {report.reporter?.name || 'User'} on{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <p>
                      <strong>Target: </strong>{' '}
                      <span className="capitalize">{report.targetType}</span> ID: {report.targetId}
                    </p>
                    {report.details && (
                      <p className="mt-1 text-slate-600 dark:text-slate-400 italic">
                        " {report.details} "
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-rose-100 dark:border-rose-900/40">
                    <button
                      onClick={() => handleResolveReport(report._id, 'dismiss')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      Dismiss (Keep Content)
                    </button>
                    <button
                      onClick={() => handleResolveReport(report._id, 'take_action')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
                    >
                      Unpublish & Take Down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
