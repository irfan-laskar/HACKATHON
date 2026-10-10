import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Calculator,
  Compass,
  HelpCircle,
  Copy,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  Flame,
  CalendarCheck2,
} from 'lucide-react';
import { RESTAURANT_PROBLEMS, PROBLEM_CATEGORIES, RestaurantProblem } from '../data/restaurantData';
import { useToast } from '../context/ToastContext';

export const Problems: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedImpact, setSelectedImpact] = useState<'All' | 'Critical' | 'High' | 'Moderate'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<{ [problemId: string]: number[] }>({});

  const filteredProblems = useMemo(() => {
    return RESTAURANT_PROBLEMS.filter((prob) => {
      // Category check
      if (selectedCategory !== 'All' && prob.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Impact level check
      if (selectedImpact !== 'All' && prob.impactLevel !== selectedImpact) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prob.title.toLowerCase().includes(query);
        const matchesDesc = prob.shortDesc.toLowerCase().includes(query);
        const matchesCategory = prob.category.toLowerCase().includes(query);
        const matchesTags = prob.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCauses = prob.rootCauses.some((c) => c.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesCategory || matchesTags || matchesCauses;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedImpact]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const toggleStepCheckbox = (problemId: string, stepIndex: number) => {
    setCompletedSteps((prev) => {
      const current = prev[problemId] || [];
      const updated = current.includes(stepIndex)
        ? current.filter((idx) => idx !== stepIndex)
        : [...current, stepIndex];
      return { ...prev, [problemId]: updated };
    });
  };

  const handleCopyActionPlan = (prob: RestaurantProblem) => {
    const text = `ScaleTrix Action Plan for: ${prob.title}\n` +
      `Estimated Margin Leak: ${prob.marginLeakPercent} (${prob.estimatedMonthlyLoss}/month)\n\n` +
      `Root Causes:\n${prob.rootCauses.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n` +
      `Corrective SOP Steps:\n${prob.actionPlan.map((a, i) => `[ ] ${i + 1}. ${a}`).join('\n')}\n\n` +
      `Recommended Diagnostic Tool: ${prob.recommendedToolName || 'ScaleTrix Business Tools'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(prob.id);
    showToast('Action plan & SOP checklist copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Matching Solutions Page Style) */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-forest-200 dark:border-forest-700">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Operational & Financial Diagnostic Library
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
            Restaurant Problem Directory & <br className="hidden sm:inline" />
            <span className="italic font-normal text-forest-700 dark:text-lime-400">Margin Leak Diagnoses</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed font-normal">
            Explore all 18 categories of structural hurdles faced by small restaurants, dhabas, and cloud kitchens in India.
            Pinpoint where your margins are slipping and apply battle-tested corrective SOPs.
          </p>
        </div>

        {/* Filter & Search Bar (Matching Solutions Page Style) */}
        <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-cream-200 dark:border-forest-800 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cream-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems by keyword (e.g. food cost, recipe, delivery commission, chef, wastage)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 placeholder-slate-400 dark:placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-cream-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Impact Filter Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedImpact}
                onChange={(e) => setSelectedImpact(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm font-medium"
              >
                <option value="All">All Impact Levels</option>
                <option value="Critical">Critical Leaks (Immediate Risk)</option>
                <option value="High">High Impact (15-25% Losses)</option>
                <option value="Moderate">Moderate Impact</option>
              </select>
            </div>
          </div>

          {/* Horizontal Scrollable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {PROBLEM_CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-forest-800 text-cream-50 dark:bg-lime-500 dark:text-forest-950 shadow-xs'
                      : 'bg-cream-100 dark:bg-forest-800/60 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Action Prompt */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-cream-400">
            Showing <span className="font-bold text-forest-800 dark:text-lime-300">{filteredProblems.length}</span> battle-tested restaurant problem breakdowns
          </p>
          <Link
            to="/problem-finder"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 dark:text-lime-400 hover:underline"
          >
            <Compass className="w-3.5 h-3.5" />
            Not sure what is leaking? Take the 3-minute quiz
          </Link>
        </div>

        {/* Problems Cards (Full-Width Solutions-Style Layout) */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-20 bg-white/90 dark:bg-forest-900/60 rounded-3xl border border-cream-200 dark:border-forest-800 space-y-4">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-forest-950 dark:text-cream-50">No Matching Problems Found</h3>
            <p className="text-sm text-slate-500 dark:text-cream-300">Try adjusting your search keyword or selected category filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategorySelect('All');
                setSelectedImpact('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-forest-800 text-cream-50 text-xs font-bold hover:bg-forest-900 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProblems.map((prob) => {
              const isExpanded = expandedId === prob.id;
              const completedForThisProblem = completedSteps[prob.id] || [];
              return (
                <div
                  key={prob.id}
                  className="bg-white/95 dark:bg-forest-900/90 rounded-3xl border border-cream-200 dark:border-forest-800 overflow-hidden shadow-xs hover:shadow-md transition duration-200 group"
                >
                  {/* Visual Image Header */}
                  {prob.imageUrl && (
                    <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-forest-950">
                      <img
                        src={prob.imageUrl}
                        alt={prob.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                      <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-white">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-900/90 text-lime-300 border border-forest-700 backdrop-blur-sm">
                          {prob.category}
                        </span>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 ${
                          prob.impactLevel === 'Critical'
                            ? 'bg-rose-600 text-white'
                            : prob.impactLevel === 'High'
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Drain: {prob.estimatedMonthlyLoss}/mo
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Header Card Summary */}
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300">
                          {prob.category}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            prob.impactLevel === 'Critical'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : prob.impactLevel === 'High'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {prob.impactLevel} Impact Leak
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60">
                          <TrendingDown className="w-3 h-3" />
                          Leak: {prob.marginLeakPercent}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/80">
                        <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        Loss: {prob.estimatedMonthlyLoss}/mo
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-display font-bold text-forest-950 dark:text-cream-50 leading-snug">
                      {prob.title}
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-cream-200 leading-relaxed font-normal">
                      {prob.shortDesc}
                    </p>

                    {/* Financial Leak Highlight Box */}
                    <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-rose-300 block">
                          Margin Leak Rate
                        </span>
                        <p className="text-xl font-black font-display text-rose-700 dark:text-rose-400 mt-0.5">
                          {prob.marginLeakPercent}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-rose-300 block">
                          Estimated Monthly Cash Drain
                        </span>
                        <p className="text-xl font-black font-display text-rose-700 dark:text-rose-400 mt-0.5">
                          {prob.estimatedMonthlyLoss}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cream-100 dark:border-forest-800/80">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : prob.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 hover:bg-forest-900 dark:hover:bg-lime-300 transition cursor-pointer shadow-xs"
                        >
                          {isExpanded ? (
                            <>
                              Hide Action Plan & Root Causes <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              View Root Causes & Corrective SOP ({prob.actionPlan.length} Steps) <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyActionPlan(prob)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700 transition cursor-pointer"
                          title="Copy SOP to clipboard"
                        >
                          {copiedId === prob.id ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-slate-500" />
                              <span>Copy Action Plan</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        {prob.recommendedToolPath && (
                          <Link
                            to={prob.recommendedToolPath}
                            className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 dark:text-lime-400 hover:underline"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            Launch {prob.recommendedToolName || 'Calculator'} →
                          </Link>
                        )}
                        <Link
                          to="/growth-planner"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-cream-400 hover:text-forest-900 dark:hover:text-cream-100"
                        >
                          <CalendarCheck2 className="w-3.5 h-3.5" />
                          Growth Plan
                        </Link>
                      </div>
                    </div>

                    {/* Expandable Action Plan & Root Causes Drawer */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-cream-200 dark:border-forest-800 space-y-6 animate-fadeIn">
                        
                        {/* 1. Why This Happens in Indian Kitchens */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Why This Happens in Indian Kitchens (Root Causes)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {prob.rootCauses.map((cause, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-cream-50/70 dark:bg-forest-950/60 border border-cream-200/80 dark:border-forest-800 text-xs text-slate-700 dark:text-cream-200 flex items-start gap-2.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed">{cause}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Immediate 3-Step Corrective SOP Checklist */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-lime-300 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                              Immediate Corrective Action Plan ({completedForThisProblem.length}/{prob.actionPlan.length} Completed)
                            </h3>
                            <span className="text-[11px] text-slate-500 dark:text-cream-400 font-medium">
                              Click checkboxes to mark progress
                            </span>
                          </div>

                          <div className="space-y-2">
                            {prob.actionPlan.map((step, idx) => {
                              const isChecked = completedForThisProblem.includes(idx);
                              return (
                                <div
                                  key={idx}
                                  onClick={() => toggleStepCheckbox(prob.id, idx)}
                                  className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-600 dark:text-cream-300 line-through'
                                      : 'bg-cream-50 dark:bg-forest-950 border-cream-200 dark:border-forest-800 hover:border-forest-300 text-slate-800 dark:text-cream-100'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ${
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-cream-300 dark:border-forest-700 bg-white dark:bg-forest-900 text-transparent'
                                  }`}>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                  <div className="text-xs sm:text-sm leading-relaxed">
                                    <span className="font-bold mr-1.5 text-forest-800 dark:text-lime-300 not-italic">
                                      Step {idx + 1}:
                                    </span>
                                    <span>{step}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Direct Navigation Quick CTA */}
                        <div className="p-4 rounded-2xl bg-forest-900 text-cream-50 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs">
                            <span className="font-bold text-lime-300 block">Want to fix this permanently?</span>
                            <span className="text-cream-200">Track this milestone inside your 6-month growth roadmap.</span>
                          </div>
                          <Link
                            to="/growth-planner"
                            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-forest-950 text-xs font-black transition"
                          >
                            Add to Growth Planner →
                          </Link>
                        </div>

                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Assessment Callout Banner (Matching Solutions Page) */}
        <div className="mt-16 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 dark:from-forest-900 dark:to-forest-950 rounded-3xl p-8 sm:p-10 text-cream-50 text-center relative overflow-hidden shadow-lg border border-forest-700/60">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white !text-white">
              Unsure Which Challenge is Hurting You Most?
            </h3>
            <p className="text-sm sm:text-base text-cream-100 font-medium">
              Take our 3-minute interactive questionnaire to calculate your covers, food costs, and delivery drag, and receive prioritized turnaround SOPs.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/problem-finder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#AEC4D4] text-[#220306] font-extrabold hover:bg-[#cde0ee] transition shadow-md cursor-pointer"
              >
                <Compass className="w-4 h-4" /> <span>Start Problem Finder (3 Min)</span>
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#790D16] text-white font-bold hover:bg-[#91111c] transition border border-[#E5D3AF]/40 shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4" /> <span>Open Business Calculators</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Problems;
