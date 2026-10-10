import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck,
  BookOpen,
} from 'lucide-react';
import { RESTAURANT_SOLUTIONS, RestaurantSolution } from '../data/restaurantData';
import { useToast } from '../context/ToastContext';

export const Solutions: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('sol-portion-control');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(RESTAURANT_SOLUTIONS.map((s) => s.category)));
    return ['All', ...cats];
  }, []);

  const filteredSolutions = useMemo(() => {
    return RESTAURANT_SOLUTIONS.filter((sol) => {
      if (selectedCategory !== 'All' && sol.category !== selectedCategory) {
        return false;
      }
      if (selectedDifficulty !== 'All' && sol.difficulty !== selectedDifficulty) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = sol.title.toLowerCase().includes(q);
        const matchesSummary = sol.summary.toLowerCase().includes(q);
        const matchesCategory = sol.category.toLowerCase().includes(q);
        const matchesSteps = sol.keySteps.some((s) => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
        return matchesTitle || matchesSummary || matchesCategory || matchesSteps;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const toggleChecklist = (solId: string, itemIdx: number) => {
    const key = `${solId}-${itemIdx}`;
    setCompletedItems((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  };

  const handleCopyChecklist = (sol: RestaurantSolution) => {
    const text = `ScaleTrix SOP Checklist: ${sol.title}\nCategory: ${sol.category}\nEstimated Impact: ${sol.estimatedRoi}\n\n` +
      `Key Steps:\n${sol.keySteps.map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`).join('\n')}\n\n` +
      `Checklist Items:\n${sol.checklistItems.map((c, i) => `[ ] ${i + 1}. ${c}`).join('\n')}\n\n` +
      `Pro Tip: ${sol.proTip}`;

    navigator.clipboard.writeText(text);
    setCopiedId(sol.id);
    showToast('Solution SOP checklist copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-forest-200 dark:border-forest-700">
            <Lightbulb className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            Practical Operating Solutions
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
            Proven Restaurant SOPs & <br className="hidden sm:inline" />
            <span className="text-forest-700 dark:text-lime-400">Profit Recovery Frameworks</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed">
            Every solution is designed for small kitchens, cloud setups, and dhabas in India. No corporate theory — just step-by-step checklists, rupee ROI models, and tools you can execute today.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-cream-200 dark:border-forest-800 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cream-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions by keyword, SOP, packaging, WhatsApp, margin..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 placeholder-slate-400 dark:placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm font-medium"
              />
            </div>

            {/* Difficulty selector */}
            <div className="md:col-span-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm font-medium"
              >
                <option value="All">All Difficulty Levels</option>
                <option value="Beginner">Beginner (1 - 7 Days)</option>
                <option value="Intermediate">Intermediate (1 - 3 Weeks)</option>
                <option value="Advanced">Advanced (1 Month+)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-500 dark:text-forest-950 shadow-xs'
                    : 'bg-cream-100 dark:bg-forest-800/60 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-cream-400">
            Showing <span className="font-bold text-forest-800 dark:text-lime-300">{filteredSolutions.length}</span> battle-tested restaurant solutions
          </p>
          <Link
            to="/problem-finder"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 dark:text-lime-400 hover:underline"
          >
            <Compass className="w-3.5 h-3.5" />
            Not sure what you need? Take the 3-minute quiz
          </Link>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-6">
          {filteredSolutions.map((sol) => {
            const isExpanded = expandedId === sol.id;
            return (
              <div
                key={sol.id}
                className="bg-white/95 dark:bg-forest-900/90 rounded-3xl border border-cream-200 dark:border-forest-800 overflow-hidden shadow-xs hover:shadow-md transition duration-200 group"
              >
                {/* Visual Image Header */}
                {sol.imageUrl && (
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-forest-950">
                    <img
                      src={sol.imageUrl}
                      alt={sol.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-white">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-900/90 text-lime-300 border border-forest-700 backdrop-blur-sm">
                        {sol.category}
                      </span>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-lime-400 text-forest-950 shadow-sm flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        ROI: {sol.estimatedRoi}
                      </span>
                    </div>
                  </div>
                )}

                {/* Header Card Summary */}
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300">
                        {sol.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-cream-400">
                        <Clock className="w-3.5 h-3.5" /> {sol.readTime}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          sol.difficulty === 'Beginner'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : sol.difficulty === 'Intermediate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {sol.difficulty}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/60 text-forest-900 dark:text-lime-300 text-xs font-bold border border-lime-200 dark:border-lime-800/80">
                      <TrendingUp className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                      ROI: {sol.estimatedRoi}
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-display font-bold text-forest-950 dark:text-cream-50 leading-snug">
                    {sol.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-cream-200 leading-relaxed">
                    {sol.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cream-100 dark:border-forest-800/80">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : sol.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 hover:bg-forest-900 dark:hover:bg-lime-300 transition cursor-pointer shadow-xs"
                      >
                        {isExpanded ? (
                          <>
                            Hide Implementation SOP <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View Step-by-Step SOP ({sol.keySteps.length} Steps) <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyChecklist(sol)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700 transition"
                        title="Copy SOP to clipboard"
                      >
                        {copiedId === sol.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500" />
                            <span>Copy SOP</span>
                          </>
                        )}
                      </button>
                    </div>

                    <Link
                      to="/tools"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 dark:text-lime-400 hover:text-forest-900 dark:hover:text-lime-300"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      Test numbers in Calculators <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Expanded SOP Details */}
                {isExpanded && (
                  <div className="bg-cream-50/70 dark:bg-forest-950/80 px-6 sm:px-8 py-7 border-t border-cream-200 dark:border-forest-800 space-y-8 animate-fadeIn">
                    
                    {/* Key Steps Section */}
                    <div>
                      <h3 className="text-base sm:text-lg font-display font-bold text-forest-900 dark:text-cream-50 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                        Execution Roadmap
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sol.keySteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-forest-900 p-4 rounded-xl border border-cream-200 dark:border-forest-800 relative shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="w-6 h-6 rounded-lg bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 text-xs font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="text-sm font-bold text-forest-900 dark:text-cream-50">
                                {step.title}
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 pl-8 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tip Callout */}
                    <div className="bg-gradient-to-r from-lime-500/15 via-forest-500/10 to-transparent dark:from-lime-950/40 dark:to-forest-900/40 rounded-xl p-4 sm:p-5 border-l-4 border-lime-500 dark:border-lime-400 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs uppercase font-extrabold tracking-wider text-forest-800 dark:text-lime-300 block mb-0.5">
                          Restaurateur Insider Tip
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-cream-200 italic leading-relaxed">
                          "{sol.proTip}"
                        </p>
                      </div>
                    </div>

                    {/* Interactive Checklist */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm sm:text-base font-display font-bold text-forest-900 dark:text-cream-50 flex items-center gap-2">
                          <BookmarkCheck className="w-4 h-4 text-forest-600 dark:text-lime-400" />
                          Interactive SOP Checklist (Click to track progress)
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-cream-400">
                          {sol.checklistItems.filter((_, i) => completedItems[`${sol.id}-${i}`]).length} / {sol.checklistItems.length} Done
                        </span>
                      </div>

                      <div className="space-y-2">
                        {sol.checklistItems.map((item, idx) => {
                          const isDone = !!completedItems[`${sol.id}-${idx}`];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleChecklist(sol.id, idx)}
                              className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer text-xs sm:text-sm ${
                                isDone
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through'
                                  : 'bg-white dark:bg-forest-900 border-cream-200 dark:border-forest-800 text-slate-700 dark:text-cream-200 hover:border-forest-400 dark:hover:border-lime-400'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                                  isDone
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-slate-300 dark:border-forest-600 bg-cream-50 dark:bg-forest-950'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <span className="flex-1">{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Links */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <Link
                        to="/growth-planner"
                        className="inline-flex items-center gap-1 font-bold text-forest-800 dark:text-lime-400 hover:underline"
                      >
                        Add to 6-Month Action Roadmap <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to="/learning-hub"
                        className="inline-flex items-center gap-1 text-slate-500 dark:text-cream-400 hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Read related case study in Learning Hub
                      </Link>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 dark:from-forest-900 dark:to-forest-950 rounded-3xl p-8 sm:p-10 text-cream-50 text-center relative overflow-hidden shadow-lg">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Need a Tailored Diagnosis for Your Outlet?
            </h3>
            <p className="text-sm sm:text-base text-cream-200">
              Answer 5 quick questions about your food cost, seating, and delivery share to uncover your exact margin leaks and prioritized solution steps.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/problem-finder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-400 text-forest-950 font-bold hover:bg-lime-300 transition shadow-md"
              >
                <Compass className="w-4 h-4" /> Start Restaurant Problem Finder
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-700/80 text-cream-50 font-bold hover:bg-forest-700 transition border border-forest-600"
              >
                <Calculator className="w-4 h-4" /> Open Business Calculators
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
