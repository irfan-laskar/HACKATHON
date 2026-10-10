import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  Copy,
  Check,
  Compass,
  Calculator,
  ShieldCheck,
  Flame,
  Lock,
  Unlock,
  CreditCard,
  Smartphone,
  X,
  Zap,
  Award,
} from 'lucide-react';
import { SIX_MONTH_GROWTH_PLAN, GrowthTask } from '../data/restaurantData';
import { useToast } from '../context/ToastContext';

export const GrowthPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<GrowthTask[]>(SIX_MONTH_GROWTH_PLAN);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = All Months
  const [filterImpact, setFilterImpact] = useState<string>('All');
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

  // Pro Subscription State (Month 1 is Free; Months 2-6 require ₹29/month)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('scaletrix_planner_pro_active') === 'true';
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [quickUpiApp, setQuickUpiApp] = useState<'phonepe' | 'gpay' | 'paytm' | 'bhim'>('phonepe');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [targetMonthPrompt, setTargetMonthPrompt] = useState<number | null>(null);

  // Load completed tasks state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scaletrix_growth_planner_completed_tasks');
    if (saved) {
      try {
        const completedIds: Record<string, boolean> = JSON.parse(saved);
        setTasks((prev) =>
          prev.map((t) => ({
            ...t,
            completed: !!completedIds[t.id],
          }))
        );
      } catch (e) {
        console.error('Failed to parse saved growth tasks', e);
      }
    }
  }, []);

  const toggleTask = (taskId: string, taskMonth: number) => {
    // Month 1 is 100% Free; Months 2-6 require subscription
    if (taskMonth > 1 && !isSubscribed) {
      setTargetMonthPrompt(taskMonth);
      setShowCheckoutModal(true);
      showToast(`Month ${taskMonth} requires Scaletrix Pro. Month 1 is Free, then just ₹29/month!`, 'info');
      return;
    }

    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      // Save completed ids map to localStorage
      const completedMap: Record<string, boolean> = {};
      updated.forEach((t) => {
        if (t.completed) completedMap[t.id] = true;
      });
      localStorage.setItem('scaletrix_growth_planner_completed_tasks', JSON.stringify(completedMap));
      return updated;
    });
  };

  const handleSelectMonth = (m: number) => {
    setSelectedMonth(m);
    if (m > 1 && !isSubscribed) {
      showToast(`Viewing Month ${m} preview. Unlock full interactive tasks for ₹29/month!`, 'info');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsSubscribed(true);
      localStorage.setItem('scaletrix_planner_pro_active', 'true');
      setShowCheckoutModal(false);
      showToast('🎉 Payment of ₹29 successful! All 6 Months of Growth Planner are now fully unlocked.', 'success');
    }, 1200);
  };

  const handleToggleSubscriptionTest = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      localStorage.removeItem('scaletrix_planner_pro_active');
      showToast('Switched to Free Tier (Month 1 free, Months 2–6 locked).', 'info');
    } else {
      setIsSubscribed(true);
      localStorage.setItem('scaletrix_planner_pro_active', 'true');
      showToast('Scaletrix Pro active (₹29/month). All months unlocked.', 'success');
    }
  };

  const resetAllTasks = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
    localStorage.removeItem('scaletrix_growth_planner_completed_tasks');
    showToast('Plan progress reset to 0%.', 'info');
  };

  const copyProgressSummary = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const pct = Math.round((completedCount / tasks.length) * 100);
    const text = `ScaleTrix 6-Month Restaurant Growth Roadmap\n` +
      `Pricing Status: ${isSubscribed ? 'Scaletrix Pro Member (₹29/mo)' : 'Month 1 Free Trial'}\n` +
      `Overall Completion: ${completedCount}/${tasks.length} tasks completed (${pct}%)\n\n` +
      tasks
        .map(
          (t) =>
            `[${t.completed ? 'X' : ' '}] Month ${t.month} (Day ${t.deadlineDays}): ${t.title} [${t.impact} Impact]${
              t.month > 1 && !isSubscribed ? ' (Locked - ₹29/mo)' : ''
            }`
        )
        .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    showToast('Growth Roadmap progress summary copied!', 'success');
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  // Month-by-month breakdown
  const monthSummaries = useMemo(() => {
    const months = [1, 2, 3, 4, 5, 6];
    return months.map((m) => {
      const mTasks = tasks.filter((t) => t.month === m);
      const mDone = mTasks.filter((t) => t.completed).length;
      return {
        month: m,
        title: mTasks[0]?.monthTitle || `Month ${m}`,
        total: mTasks.length,
        done: mDone,
        pct: mTasks.length > 0 ? Math.round((mDone / mTasks.length) * 100) : 0,
        isLocked: m > 1 && !isSubscribed,
      };
    });
  }, [tasks, isSubscribed]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedMonth !== 0 && t.month !== selectedMonth) {
        return false;
      }
      if (filterImpact !== 'All' && t.impact !== filterImpact) {
        return false;
      }
      return true;
    });
  }, [tasks, selectedMonth, filterImpact]);

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="relative rounded-3xl overflow-hidden mb-8 sm:mb-10 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 border border-forest-800 p-8 sm:p-10 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
            alt="Restaurant growth roadmap"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-800/80 text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-lime-400/30 backdrop-blur-xs">
              <CalendarCheck2 className="w-4 h-4 text-lime-400" />
              180-Day Execution Roadmap
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-cream-50 leading-tight">
              Six-Month Restaurant <br className="hidden sm:inline" />
              <span className="text-lime-400">Growth & Turnaround Plan</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream-200/90 leading-relaxed">
              18 milestone actions structured across 6 critical operational months. Check off tasks as you execute them to eliminate margin leaks and build sustainable profitability.
            </p>
          </div>
        </div>

        {/* Pricing Model Banner: Month 1 Free, then ₹29/month */}
        <div className={`mb-8 rounded-3xl p-6 sm:p-7 border transition-all overflow-hidden relative shadow-sm ${
          isSubscribed
            ? 'bg-gradient-to-r from-emerald-950 via-forest-900 to-emerald-900 text-cream-50 border-emerald-600/50'
            : 'bg-gradient-to-r from-forest-900 via-forest-850 to-forest-900 text-cream-50 border-lime-400/30'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isSubscribed
                    ? 'bg-emerald-400 text-forest-950'
                    : 'bg-lime-400 text-forest-950'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSubscribed ? 'SCALETRIX PRO ACTIVE' : 'MONTH 1 IS 100% FREE'}
                </span>
                {!isSubscribed ? (
                  <span className="text-xs font-bold text-cream-200">
                    Then just <span className="text-lime-300 font-extrabold text-sm">₹29 / month</span> for Months 2 to 6
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-300">
                    Subscribed at ₹29/month • All 6 months unlocked
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-black text-white !text-white">
                {isSubscribed
                  ? 'Your Complete 180-Day Turnaround Blueprint is Active'
                  : 'Execute Month 1 Free — Continue Your 6-Month Plan for ₹29/month'}
              </h2>

              <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed">
                {isSubscribed
                  ? 'You have unlimited access to all 18 milestone checklists, B2B catering blueprints, direct WhatsApp ordering engines, and cloud kitchen expansion models.'
                  : 'Month 1 portioning & weighing audits are unlocked for everyone at zero cost. Unlock Months 2 through 6 for just ₹29/month (less than ₹1/day) to stop ₹45,000+ in monthly aggregator and kitchen margin leaks.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {!isSubscribed ? (
                <button
                  type="button"
                  onClick={() => {
                    setTargetMonthPrompt(2);
                    setShowCheckoutModal(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-forest-950 font-display font-black text-sm sm:text-base shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-forest-950 group-hover:scale-110 transition" />
                  <span>Unlock Months 2–6 for ₹29/mo</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Plan Active (₹29/mo)
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSubscriptionTest}
                    className="text-xs font-bold text-cream-300 hover:text-white underline decoration-cream-400/50 cursor-pointer"
                    title="Toggle to Free Tier to test locked states"
                  >
                    Manage Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Progress Bar Card */}
        <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-cream-400 block mb-1">
                Roadmap Execution Progress
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-display font-black text-forest-950 dark:text-cream-50">
                  {progressPercent}%
                </span>
                <span className="text-sm font-bold text-slate-500 dark:text-cream-300">
                  ({completedTasks} of {totalTasks} tasks completed)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyProgressSummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 transition"
              >
                {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPlan ? 'Copied!' : 'Copy Summary'}
              </button>

              <button
                type="button"
                onClick={resetAllTasks}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cream-100 dark:bg-forest-800 text-red-600 dark:text-red-400 hover:bg-red-50 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3.5 bg-cream-100 dark:bg-forest-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest-600 via-lime-500 to-lime-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 6 Month mini badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-cream-200 dark:border-forest-800">
            {monthSummaries.map((ms) => (
              <button
                key={ms.month}
                type="button"
                onClick={() => handleSelectMonth(ms.month)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative ${
                  selectedMonth === ms.month
                    ? 'border-forest-800 dark:border-lime-400 bg-forest-50 dark:bg-forest-800/80 shadow-2xs'
                    : 'border-cream-200 dark:border-forest-800 bg-cream-50/50 dark:bg-forest-950/60 hover:border-cream-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-forest-900 dark:text-cream-50">
                    Month {ms.month}
                  </span>
                  {ms.month === 1 ? (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Free
                    </span>
                  ) : ms.isLocked ? (
                    <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 inline-flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> ₹29
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">{ms.done}/{ms.total}</span>
                  )}
                </div>

                <div className="w-full h-1.5 bg-cream-200 dark:bg-forest-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      ms.isLocked ? 'bg-amber-400/50' : 'bg-lime-500 dark:bg-lime-400'
                    }`}
                    style={{ width: ms.isLocked ? '25%' : `${ms.pct}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Month selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedMonth(0)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedMonth === 0
                  ? 'bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950'
                  : 'bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200'
              }`}
            >
              All 6 Months
            </button>
            {[1, 2, 3, 4, 5, 6].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMonth(m)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 ${
                  selectedMonth === m
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950'
                    : 'bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200'
                }`}
              >
                <span>Month {m}</span>
                {m === 1 ? (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-950 font-black">
                    FREE
                  </span>
                ) : !isSubscribed ? (
                  <Lock className="w-3 h-3 text-amber-500" />
                ) : null}
              </button>
            ))}
          </div>

          {/* Impact filter */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">Impact:</span>
            <button
              type="button"
              onClick={() => setFilterImpact('All')}
              className={`px-2.5 py-1 rounded-lg ${
                filterImpact === 'All'
                  ? 'bg-forest-700 text-cream-50 dark:bg-lime-500 dark:text-forest-950'
                  : 'bg-cream-100 dark:bg-forest-850 text-slate-600 dark:text-cream-300'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterImpact('High')}
              className={`px-2.5 py-1 rounded-lg ${
                filterImpact === 'High'
                  ? 'bg-forest-700 text-cream-50 dark:bg-lime-500 dark:text-forest-950'
                  : 'bg-cream-100 dark:bg-forest-850 text-slate-600 dark:text-cream-300'
              }`}
            >
              High Impact Only
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isMonthLocked = task.month > 1 && !isSubscribed;

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id, task.month)}
                className={`p-5 sm:p-6 rounded-2xl border transition duration-150 cursor-pointer flex items-start gap-4 relative ${
                  isMonthLocked
                    ? 'bg-amber-50/40 dark:bg-forest-900/60 border-amber-200/80 dark:border-forest-800 hover:border-amber-400 dark:hover:border-forest-700 shadow-xs'
                    : task.completed
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                    : 'bg-white dark:bg-forest-900 border-cream-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-700 shadow-xs'
                }`}
              >
                {/* Checkbox or Lock Icon */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                    isMonthLocked
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                      : task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-forest-600 bg-cream-50 dark:bg-forest-950'
                  }`}
                >
                  {isMonthLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : task.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : null}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        task.month === 1
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isMonthLocked
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-forest-100 text-forest-800 dark:bg-forest-800 dark:text-lime-300'
                      }`}>
                        Month {task.month} {task.month === 1 ? '• Free Trial' : isMonthLocked ? '• Scaletrix Pro' : '• Unlocked'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-cream-400">
                        {task.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.impact === 'High'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {task.impact} Impact
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> Target: Day {task.deadlineDays}
                    </span>
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-bold leading-snug ${
                      task.completed
                        ? 'text-emerald-900 dark:text-emerald-200 line-through'
                        : 'text-forest-950 dark:text-cream-50'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p
                    className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                      task.completed
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-cream-300'
                    }`}
                  >
                    {task.description}
                  </p>

                  {/* Locked Callout Footer */}
                  {isMonthLocked && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-forest-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>Unlock Month {task.month} SOP checklist & action items</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetMonthPrompt(task.month);
                          setShowCheckoutModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 dark:bg-lime-400 dark:hover:bg-lime-300 text-cream-50 dark:text-forest-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Unlock className="w-3 h-3" />
                        <span>Unlock for ₹29/mo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Prompts */}
        <div className="mt-12 bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h4 className="text-base sm:text-lg font-display font-bold text-forest-950 dark:text-cream-50">
              Need assistance executing these milestones?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-cream-400 mt-1">
              Check detailed SOPs in the Solutions library or run your unit economics through Business Tools.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/solutions"
              className="px-4 py-2.5 rounded-xl bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-xs sm:text-sm hover:bg-forest-900 transition"
            >
              Browse Solutions
            </Link>
            <Link
              to="/tools"
              className="px-4 py-2.5 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 font-bold text-xs sm:text-sm hover:bg-cream-200 transition"
            >
              Open Calculators
            </Link>
          </div>
        </div>

      </div>

      {/* ============================================================
          INTERACTIVE PRO CHECKOUT MODAL (₹29 / MONTH)
      ============================================================ */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-forest-900 rounded-3xl border border-cream-200 dark:border-forest-750 shadow-2xl max-w-lg w-full overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="relative p-6 sm:p-7 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white border-b border-forest-800">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-forest-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-black uppercase tracking-wider mb-2 border border-lime-400/30">
                <Zap className="w-3.5 h-3.5 text-lime-400" />
                Month 1 Was Free • Scaletrix Pro
              </div>

              <h3 className="text-2xl font-display font-black text-cream-50">
                Unlock 6-Month Growth Roadmap
              </h3>
              <p className="text-xs sm:text-sm text-cream-200/90 mt-1">
                {targetMonthPrompt
                  ? `Activate Month ${targetMonthPrompt} and all remaining milestones for just ₹29/month.`
                  : 'Get all 18 restaurant milestones, B2B catering deals, and WhatsApp delivery playbooks.'}
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubscribe} className="p-6 sm:p-7 space-y-6">
              
              {/* Plan Pricing Card */}
              <div className="p-4 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-cream-400 block">
                    Subscription Fee
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-black text-forest-950 dark:text-cream-50">
                      ₹29
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ month</span>
                    <span className="text-xs text-slate-400 line-through">₹199/mo</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-lime-400 font-semibold block mt-0.5">
                    Less than ₹1/day • Cancel anytime in 1 click
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    Month 1: ₹0 (Free)
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Billed monthly
                  </span>
                </div>
              </div>

              {/* What's included checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-extrabold uppercase tracking-wider text-forest-800 dark:text-lime-300 block mb-1">
                  What You Get Instantly:
                </span>
                <div className="space-y-1.5 text-slate-700 dark:text-cream-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                    <span>Months 2 to 6 milestones (15 high-impact kitchen & marketing SOPs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                    <span>Aggregator commission renegotiation email & call scripts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                    <span>Direct WhatsApp delivery transition templates & QR stand designs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                    <span>B2B corporate thali contracts & bulk catering package sheets</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2 border-t border-cream-200 dark:border-forest-800">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-700 dark:text-cream-200 block">
                  Select Payment Method
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-forest-800 dark:border-lime-400 bg-forest-50 dark:bg-forest-800 text-forest-950 dark:text-cream-50'
                        : 'border-cream-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-slate-600 dark:text-cream-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" /> UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-forest-800 dark:border-lime-400 bg-forest-50 dark:bg-forest-800 text-forest-950 dark:text-cream-50'
                        : 'border-cream-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-slate-600 dark:text-cream-300'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-forest-800 dark:border-lime-400 bg-forest-50 dark:bg-forest-800 text-forest-950 dark:text-cream-50'
                        : 'border-cream-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-slate-600 dark:text-cream-300'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> NetBanking
                  </button>
                </div>

                {/* UPI Content */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'gpay', name: 'Google Pay' },
                        { id: 'paytm', name: 'Paytm' },
                        { id: 'bhim', name: 'BHIM UPI' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setQuickUpiApp(app.id as any)}
                          className={`p-2 rounded-xl text-center text-[11px] font-bold border transition cursor-pointer ${
                            quickUpiApp === app.id
                              ? 'border-emerald-600 dark:border-lime-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-cream-50 font-black'
                              : 'border-cream-200 dark:border-forest-800 bg-cream-50 dark:bg-forest-950 text-slate-600 dark:text-cream-300'
                          }`}
                        >
                          {app.name}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-cream-300 mb-1">
                        Enter UPI ID or Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9820012345@upi or user@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-lime-500"
                      />
                    </div>
                  </div>
                )}

                {/* Card Content */}
                {paymentMethod === 'card' && (
                  <div className="space-y-2 pt-1 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-cream-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8910 (RuPay, Visa, Master)"
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 text-xs font-semibold focus:ring-2 focus:ring-lime-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 text-xs font-semibold"
                      />
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="CVV"
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* NetBanking Content */}
                {paymentMethod === 'netbanking' && (
                  <div className="pt-1">
                    <select className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 text-xs font-semibold">
                      <option>HDFC Bank (Popular)</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Submit Payment CTA */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 dark:bg-lime-400 dark:hover:bg-lime-300 text-cream-50 dark:text-forest-950 font-display font-black text-sm sm:text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Payment (₹29)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Pay ₹29 & Unlock All 6 Months</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400 dark:text-cream-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                <span>256-bit SSL Encrypted • NPCI UPI Secure • Cancel Anytime</span>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

