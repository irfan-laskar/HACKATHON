import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, AlertCircle, ShieldCheck, Video, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      showToast('Welcome back to MarketSphere!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Market<span className="text-brand-600 dark:text-brand-400">Sphere</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-2">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access free educational courses, save bookmarks, and interact with creators.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Selector */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
            One-Click Demo Account Login
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@marketsphere.com', 'admin123456')}
              className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Editorial Admin (admin@marketsphere.com)</span>
              </div>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-bold">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('priya.sharma@marketsphere.com', 'creator123')}
              className="p-2.5 rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/70 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-900 dark:text-brand-200 text-xs font-semibold flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Priya Sharma (GrowthCraft Marketing)</span>
              </div>
              <span className="text-[10px] text-brand-700 dark:text-brand-300 uppercase font-bold">Creator</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vikram.patel@marketsphere.com', 'user123456')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Vikram Patel (Learner & Founder)</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">User</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
            Join MarketSphere for free
          </Link>
        </p>
      </div>
    </div>
  );
};
