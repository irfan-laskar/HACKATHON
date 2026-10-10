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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyActionPlan = (prob: RestaurantProblem) => {
    const text = `ScaleTrix Action Plan for: ${prob.title}\n` +
      `Estimated Margin Leak: ${prob.marginLeakPercent} (${prob.estimatedMonthlyLoss}/month)\n\n` +
      `Root Causes:\n${prob.rootCauses.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n` +
      `Fix Steps:\n${prob.actionPlan.map((a, i) => `[ ] ${i + 1}. ${a}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedId(prob.id);
    showToast('Action plan copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Operational & Financial Diagnostic Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-forest-950 dark:text-cream-50">
          Restaurant Problem Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-cream-200/90 leading-relaxed font-normal">
          Explore all 18 categories of structural hurdles faced by small restaurants in India.
          Pinpoint where your margins are slipping and apply battle-tested corrective SOPs.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-6 bg-white dark:bg-forest-900/80 p-6 sm:p-8 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm">
        
        {/* Search Bar + Impact Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 dark:text-cream-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by issue (e.g. food cost, recipe, delivery commission, chef, wastage)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-cream-300 dark:border-forest-700 bg-cream-50/50 dark:bg-forest-950/60 text-slate-900 dark:text-cream-50 placeholder-slate-400 dark:placeholder-cream-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 dark:focus:ring-lime-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 dark:text-cream-300">Impact:</span>
            {(['All', 'Critical', 'High', 'Moderate'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setSelectedImpact(imp)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedImpact === imp
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-500 dark:text-forest-950 font-bold'
                    : 'bg-cream-100 dark:bg-forest-800 text-slate-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-700'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>
        </div>

        {/* 18 Categories Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cream-300">
            <span>Filter by 18 Operational Categories ({filteredProblems.length} Results)</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => handleCategorySelect('All')}
                className="text-forest-700 dark:text-lime-400 hover:underline normal-case font-semibold"
              >
                Reset to All
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {PROBLEM_CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-forest-800 dark:bg-lime-400 text-cream-50 dark:text-forest-950 shadow-xs scale-105'
                      : 'bg-cream-100/80 dark:bg-forest-800/80 text-slate-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-700 border border-cream-200 dark:border-forest-700/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problems Results Grid */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-forest-900/60 rounded-3xl border border-cream-200 dark:border-forest-800 space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-forest-950 dark:text-cream-50">No Matching Problems Found</h3>
          <p className="text-xs text-slate-500 dark:text-cream-300 max-w-md mx-auto">
            Try adjusting your search query or reset the category filter to view all 18 operational problem playbooks.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedImpact('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-forest-800 text-cream-50 text-xs font-bold hover:bg-forest-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white dark:bg-forest-900/90 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-900 dark:text-lime-300 border border-forest-200 dark:border-forest-700">
                      {prob.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        prob.impactLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                          : prob.impactLevel === 'High'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-lime-100 text-forest-800 dark:bg-lime-950/80 dark:text-lime-300'
                      }`}
                    >
                      {prob.impactLevel} Impact
                    </span>
                  </div>

                  {/* Copy Action Plan Button */}
                  <button
                    onClick={() => handleCopyActionPlan(prob)}
                    className="p-1.5 text-slate-400 hover:text-forest-700 dark:hover:text-lime-400 transition"
                    title="Copy Action Plan"
                  >
                    {copiedId === prob.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-forest-950 dark:text-cream-50 leading-snug">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-200/90 leading-relaxed">
                  {prob.shortDesc}
                </p>

                {/* Impact Leak Alert */}
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-rose-300">
                      Margin Leak
                    </span>
                    <p className="text-lg font-black text-rose-700 dark:text-rose-400">
                      {prob.marginLeakPercent}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-rose-300">
                      Estimated Monthly Loss
                    </span>
                    <p className="text-lg font-black text-rose-700 dark:text-rose-400">
                      {prob.estimatedMonthlyLoss}
                    </p>
                  </div>
                </div>

                {/* Root Causes Section */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cream-400 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    Why This Happens in Indian Kitchens
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-cream-200">
                    {prob.rootCauses.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Plan Section */}
                <div className="space-y-2 pt-2 border-t border-cream-100 dark:border-forest-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-lime-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                    Immediate 3-Step Corrective Action
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-cream-200">
                    {prob.actionPlan.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-forest-700 dark:text-lime-400">{idx + 1}.</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Tool Recommendation Link */}
              <div className="pt-4 border-t border-cream-100 dark:border-forest-800 flex items-center justify-between">
                {prob.recommendedToolPath ? (
                  <Link
                    to={prob.recommendedToolPath}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-forest-800 dark:text-lime-400 hover:text-forest-950 dark:hover:text-lime-300"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Launch {prob.recommendedToolName} →</span>
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-400">Implement via SOP training</span>
                )}

                <Link
                  to="/growth-planner"
                  className="text-[11px] font-semibold text-slate-500 dark:text-cream-400 hover:underline"
                >
                  Add to Growth Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assessment Promo Card */}
      <div className="bg-forest-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold font-display text-cream-50">
            Unsure Which Challenge is Hurting You Most?
          </h3>
          <p className="text-xs sm:text-sm text-cream-300 max-w-xl">
            Take our 5-minute interactive questionnaire to analyze your restaurant's covers, food costs, and delivery drag, and receive prioritized recommendations.
          </p>
        </div>
        <Link
          to="/problem-finder"
          className="px-6 py-3 rounded-2xl bg-lime-500 hover:bg-lime-400 text-forest-950 font-extrabold text-xs shrink-0 shadow-md transition"
        >
          Start Problem Finder Assessment →
        </Link>
      </div>

    </div>
  );
};
