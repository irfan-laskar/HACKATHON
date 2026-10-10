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
} from 'lucide-react';
import { SIX_MONTH_GROWTH_PLAN, GrowthTask } from '../data/restaurantData';
import { useToast } from '../context/ToastContext';

export const GrowthPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<GrowthTask[]>(SIX_MONTH_GROWTH_PLAN);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = All Months
  const [filterImpact, setFilterImpact] = useState<string>('All');
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

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

  const toggleTask = (taskId: string) => {
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

  const resetAllTasks = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
    localStorage.removeItem('scaletrix_growth_planner_completed_tasks');
    showToast('Plan progress reset to 0%.', 'info');
  };

  const copyProgressSummary = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const pct = Math.round((completedCount / tasks.length) * 100);
    const text = `ScaleTrix 6-Month Restaurant Growth Roadmap\n` +
      `Overall Completion: ${completedCount}/${tasks.length} tasks completed (${pct}%)\n\n` +
      tasks
        .map(
          (t) =>
            `[${t.completed ? 'X' : ' '}] Month ${t.month} (Day ${t.deadlineDays}): ${t.title} [${t.impact} Impact]`
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
      };
    });
  }, [tasks]);

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
                onClick={() => setSelectedMonth(ms.month)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  selectedMonth === ms.month
                    ? 'border-forest-800 dark:border-lime-400 bg-forest-50 dark:bg-forest-800/80 shadow-2xs'
                    : 'border-cream-200 dark:border-forest-800 bg-cream-50/50 dark:bg-forest-950/60 hover:border-cream-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-forest-900 dark:text-cream-50">Month {ms.month}</span>
                  <span className="text-[10px] text-slate-400">{ms.done}/{ms.total}</span>
                </div>
                <div className="w-full h-1.5 bg-cream-200 dark:bg-forest-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-500 dark:bg-lime-400 rounded-full transition-all duration-300"
                    style={{ width: `${ms.pct}%` }}
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
                onClick={() => setSelectedMonth(m)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedMonth === m
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950'
                    : 'bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200'
                }`}
              >
                Month {m}
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
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-5 sm:p-6 rounded-2xl border transition duration-150 cursor-pointer flex items-start gap-4 ${
                task.completed
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                  : 'bg-white dark:bg-forest-900 border-cream-200 dark:border-forest-800 hover:border-forest-300 dark:hover:border-forest-700 shadow-xs'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                  task.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-forest-600 bg-cream-50 dark:bg-forest-950'
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300">
                      Month {task.month}
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
              </div>
            </div>
          ))}
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
    </div>
  );
};
