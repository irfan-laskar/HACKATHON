import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Calculator,
  CalendarCheck2,
  Share2,
  Copy,
  Check,
  ShieldAlert,
  Target,
  DollarSign,
  Utensils,
  Lightbulb,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Question {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    score: number; // 0 (critical issue) to 25 (best practice)
    tags: string[];
    leakRisk?: string;
    imageUrl?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1-format-scale',
    category: 'Format & Scale',
    title: 'What is your primary operating model and location profile?',
    subtitle: 'Helps us benchmark your fixed overheads against regional Indian averages.',
    options: [
      {
        label: 'Dedicated Cloud Kitchen / Delivery Only',
        description: 'No customer seating; relies almost 100% on delivery aggregators and pickup.',
        score: 15,
        tags: ['Delivery', 'Packaging', 'Platform Dependency'],
        leakRisk: 'High aggregator commission vulnerability (22-28%)',
        imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80',
      },
      {
        label: 'Casual Dine-In Restaurant (20 to 60 seats)',
        description: 'Table service dining with mixed takeaway and online delivery volume.',
        score: 22,
        tags: ['Staff management', 'Customer experience', 'Rent'],
        leakRisk: 'High fixed rent and front-of-house staff overheads',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
      },
      {
        label: 'Quick-Service Counter / Dhaba / Kiosk',
        description: 'High footfall, counter ordering, fast turnaround, limited seating.',
        score: 20,
        tags: ['Raw-material costs', 'Speed of service', 'Pricing'],
        leakRisk: 'Menu under-pricing and ingredient price volatility',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
      },
      {
        label: 'Bakery, Cafe or Tea Lounge',
        description: 'Focus on high-margin beverages, baked goods, snacks, and ambient seating.',
        score: 24,
        tags: ['Brand awareness', 'Food costing', 'Customer reach'],
        leakRisk: 'Slow table turnover and beverage spoilage leaks',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'q2-food-cost',
    category: 'Food Costing & Portions',
    title: 'How do you currently calculate your plate costs and kitchen portions?',
    subtitle: 'Raw ingredient waste and portion leakage account for 40% of small restaurant failures.',
    options: [
      {
        label: 'Exact Gram Weighing with Standardized Ladles',
        description: 'Recipes are documented in sheets; cooks weigh proteins and use measured spoons.',
        score: 25,
        tags: ['Food costing', 'Recipe standardization'],
      },
      {
        label: 'Rough Estimate / Calculated Once at Opening',
        description: 'We estimated costs months ago, but day-to-day cooking is done by chef experience.',
        score: 12,
        tags: ['Food costing', 'Raw-material costs'],
        leakRisk: 'Chef portion drift adding 5-8% extra food cost monthly',
      },
      {
        label: 'We Follow Competitor Prices in the Area',
        description: 'We look at nearby restaurants on Swiggy and match or undercut their rates.',
        score: 5,
        tags: ['Pricing', 'Food costing', 'Competition'],
        leakRisk: 'Selling dishes below actual breakeven due to bulk buying differences',
      },
      {
        label: 'No Formal Costing — We Check Month-End Bank Balance',
        description: 'If money is left after paying suppliers and staff, we consider it a good month.',
        score: 2,
        tags: ['Budgeting', 'Food costing'],
        leakRisk: 'Severe margin bleed — unaware of losing money on bestselling dishes',
      },
    ],
  },
  {
    id: 'q3-delivery-margin',
    category: 'Delivery & Commissions',
    title: 'How do you handle pricing and volume on Swiggy and Zomato?',
    subtitle: 'Aggregator commission cuts (22-26%) can wipe out your entire net margin if not buffered.',
    options: [
      {
        label: 'Optimized Delivery Markup (+18% to 22%) + Direct WhatsApp Ordering',
        description: 'Delivery prices absorb platform fees; we aggressively convert repeat users to direct WhatsApp.',
        score: 25,
        tags: ['Delivery', 'Online visibility', 'Packaging'],
      },
      {
        label: 'Identical Prices on Dine-in & Delivery, Absorbing Commissions',
        description: 'A plate costing ₹250 on dine-in is also ₹250 online, and the aggregator takes ₹60.',
        score: 8,
        tags: ['Delivery', 'Pricing'],
        leakRisk: 'Losing 24% gross revenue directly to platform commissions',
      },
      {
        label: 'Deep Compulsory Discounts (40-50% off) to Drive Volume',
        description: 'We run heavy ads and deep discount campaigns just to stay ranked in the app feeds.',
        score: 4,
        tags: ['Delivery', 'Marketing', 'Customer reach'],
        leakRisk: 'Negative unit economics — each additional order loses cash',
      },
      {
        label: 'We Rely 100% on Walk-In Dine-In (No Online Channels)',
        description: 'We have zero presence on delivery apps or digital ordering channels.',
        score: 14,
        tags: ['Online visibility', 'Customer reach'],
        leakRisk: 'Missing 30-40% of neighborhood evening delivery potential',
      },
    ],
  },
  {
    id: 'q4-online-reputation',
    category: 'Reviews & Local Reach',
    title: 'What is your current Google Maps and customer review standing?',
    subtitle: '91% of urban Indian diners check Google Maps ratings before choosing an eatery.',
    options: [
      {
        label: 'Strong Presence: 4.3+ Rating with 100+ Reviews & QR Stands',
        description: 'Active Google profile, tabletop QR review stands, and we reply to customer feedback.',
        score: 25,
        tags: ['Brand awareness', 'Customer experience'],
      },
      {
        label: 'Decent Rating (3.8 - 4.1) but Few Reviews (<40 total)',
        description: 'We have a listing, but customers rarely leave reviews unless they are dissatisfied.',
        score: 14,
        tags: ['Customer reach', 'Online visibility'],
        leakRisk: 'Vulnerable to 1-2 rogue 1-star reviews dragging down average',
      },
      {
        label: 'Poor Rating (<3.8) with Frequent Complaints on Food or Delay',
        description: 'Customer reviews frequently mention cold food, slow service, or inconsistent taste.',
        score: 5,
        tags: ['Customer experience', 'Time management', 'Product quality'],
        leakRisk: 'Silent customer boycott — walk-ins dropping steadily',
      },
      {
        label: 'Unclaimed or Outdated Profile (Wrong Hours / Location Pin)',
        description: 'We have never actively managed Google Business or uploaded photos.',
        score: 4,
        tags: ['Online visibility', 'Location'],
        leakRisk: 'Losing 40-70 free weekend walk-ins to nearby claimed listings',
      },
    ],
  },
  {
    id: 'q5-cash-operations',
    category: 'Operations & Cash Flow',
    title: 'How are daily cash, billing, and inventory reconciliations handled?',
    subtitle: 'Poor financial segregation and inventory slippage drain working capital.',
    options: [
      {
        label: 'Strict Separation: Dedicated Current Account & Daily Shift Z-Reports',
        description: 'Owner takes fixed salary; POS daily tallies match cash drawer and UPI settlements.',
        score: 25,
        tags: ['Budgeting', 'Inventory', 'Staff management'],
      },
      {
        label: 'Personal & Business UPI Mingled, Weekly Mental Reconciliation',
        description: 'Customer payments go to personal UPI account; supplier payments come from the same account.',
        score: 9,
        tags: ['Budgeting', 'Staff management'],
        leakRisk: 'Tax ambiguity and inability to distinguish true profit from working capital',
      },
      {
        label: 'High Ingredient Spoilage & Daily Surprise Shortages',
        description: 'Cooks frequently run to retail kirana stores during rush hour to buy emergency butter/paneer.',
        score: 6,
        tags: ['Inventory', 'Raw-material costs', 'Time management'],
        leakRisk: 'Paying 25% retail markups on emergency grocery purchases',
      },
      {
        label: 'Staff Turnover is High (Cooks Leave Every 2-3 Months)',
        description: 'Constant recipe disruption and training chaos because core kitchen staff quit frequently.',
        score: 7,
        tags: ['Staff management', 'Recipe standardization'],
        leakRisk: 'Severe taste inconsistency destroying repeat customer loyalty',
      },
    ],
  },
];

export const ProblemFinder: React.FC = () => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('scaletrix_problem_finder_assessment');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers && parsed.isCompleted) {
          setSelectedAnswers(parsed.answers);
          setIsCompleted(true);
        }
      } catch (e) {
        console.error('Failed to parse saved assessment', e);
      }
    }
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[currentStep] === undefined) {
      showToast('Please select an option before proceeding', 'warning');
      return;
    }
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished
      setIsCompleted(true);
      localStorage.setItem(
        'scaletrix_problem_finder_assessment',
        JSON.stringify({ answers: selectedAnswers, isCompleted: true, date: new Date().toISOString() })
      );
      showToast('Diagnosis completed successfully!', 'success');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    localStorage.removeItem('scaletrix_problem_finder_assessment');
    showToast('Assessment reset. Start fresh.', 'info');
  };

  // Calculations
  const results = React.useMemo(() => {
    let totalScore = 0;
    const maxScore = QUESTIONS.length * 25; // 125
    const leaks: { title: string; risk: string; tags: string[] }[] = [];
    const recommendedTags = new Set<string>();

    QUESTIONS.forEach((q, qIdx) => {
      const selectedOptIdx = selectedAnswers[qIdx];
      if (selectedOptIdx !== undefined) {
        const opt = q.options[selectedOptIdx];
        totalScore += opt.score;
        if (opt.leakRisk) {
          leaks.push({
            title: q.title,
            risk: opt.leakRisk,
            tags: opt.tags,
          });
        }
        opt.tags.forEach((t) => recommendedTags.add(t));
      }
    });

    const scorePercentage = Math.round((totalScore / maxScore) * 100);

    let statusTitle = 'Healthy & Resilient';
    let statusColor = 'text-emerald-600 dark:text-emerald-400';
    let statusBg = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300';
    let estimatedMonthlyLeakRupees = '₹12,000 - ₹20,000';

    if (scorePercentage < 40) {
      statusTitle = 'High Failure Risk (Critical Profit Bleed)';
      statusColor = 'text-red-600 dark:text-red-400';
      statusBg = 'bg-red-100 dark:bg-red-950/60 border-red-300';
      estimatedMonthlyLeakRupees = '₹65,000 - ₹1,20,000';
    } else if (scorePercentage < 70) {
      statusTitle = 'Moderate Profit Leak (Margin Squeeze)';
      statusColor = 'text-amber-600 dark:text-amber-400';
      statusBg = 'bg-amber-100 dark:bg-amber-950/60 border-amber-300';
      estimatedMonthlyLeakRupees = '₹35,000 - ₹60,000';
    }

    return {
      scorePercentage,
      statusTitle,
      statusColor,
      statusBg,
      estimatedMonthlyLeakRupees,
      leaks,
      recommendedTags: Array.from(recommendedTags),
    };
  }, [selectedAnswers]);

  const handleCopyReport = () => {
    const text = `ScaleTrix Restaurant Health Diagnosis Report\n` +
      `Overall Health Score: ${results.scorePercentage}/100 (${results.statusTitle})\n` +
      `Estimated Monthly Profit Leak: ${results.estimatedMonthlyLeakRupees}\n\n` +
      `Identified Margin Bleeds:\n${results.leaks.map((l, i) => `${i + 1}. ${l.title}: ${l.risk}`).join('\n')}\n\n` +
      `Recommended Focus Areas: ${results.recommendedTags.join(', ')}\n\n` +
      `Generated by ScaleTrix - Restaurant Business Growth Platform`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    showToast('Diagnostic report copied to clipboard!', 'success');
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const currentQ = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-forest-200 dark:border-forest-700">
            <Compass className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            Diagnostic Diagnostic Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-forest-950 dark:text-cream-50">
            Restaurant Problem Finder & <br />
            <span className="text-forest-700 dark:text-lime-400">Profit Leak Health Check</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-cream-200">
            5 targeted operational questions. Get your instant unit-economics score, pinpoint silent margin drains, and receive a prioritized, zero-cost recovery plan.
          </p>
        </div>

        {!isCompleted ? (
          /* Questionnaire Wizard */
          <div className="bg-white dark:bg-forest-900 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm p-6 sm:p-10 transition">
            
            {/* Step Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-cream-400 mb-2">
                <span>QUESTION {currentStep + 1} OF {QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% COMPLETE</span>
              </div>
              <div className="w-full h-2.5 bg-cream-100 dark:bg-forest-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-forest-600 to-lime-500 dark:from-forest-500 dark:to-lime-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question Title */}
            <div className="mb-8">
              <span className="text-xs uppercase font-extrabold tracking-widest text-forest-600 dark:text-lime-400 block mb-1">
                {currentQ.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-forest-950 dark:text-cream-50">
                {currentQ.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-cream-300">
                {currentQ.subtitle}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3.5 mb-10">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition duration-150 cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? 'border-forest-800 dark:border-lime-400 bg-forest-50/70 dark:bg-forest-800/60 shadow-xs'
                        : 'border-cream-200 dark:border-forest-800 bg-white dark:bg-forest-900/80 hover:border-cream-300 dark:hover:border-forest-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'border-forest-800 dark:border-lime-400 bg-forest-800 dark:bg-lime-400 text-cream-50 dark:text-forest-950'
                          : 'border-slate-300 dark:border-forest-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {opt.imageUrl && (
                      <img
                        src={opt.imageUrl}
                        alt={opt.label}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-cream-200 dark:border-forest-700 shadow-2xs"
                      />
                    )}

                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-bold text-forest-950 dark:text-cream-50">
                        {opt.label}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-cream-200 dark:border-forest-800">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  currentStep === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : 'bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-forest-800 dark:bg-lime-400 text-cream-50 dark:text-forest-950 hover:bg-forest-900 dark:hover:bg-lime-300 transition shadow-sm cursor-pointer"
              >
                {currentStep === QUESTIONS.length - 1 ? (
                  <>
                    Generate Full Diagnostic Report <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next Question <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* Assessment Results Report */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Score Banner */}
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-cream-400 block mb-1">
                    Overall Restaurant Health Score
                  </span>
                  <div className="flex items-baseline gap-3 justify-center sm:justify-start">
                    <span className="text-5xl sm:text-6xl font-display font-black text-forest-950 dark:text-cream-50">
                      {results.scorePercentage}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-400">/ 100</span>
                  </div>
                  <div className={`mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border ${results.statusBg} ${results.statusColor}`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {results.statusTitle}
                  </div>
                </div>

                {/* Profit Leak Callout Box */}
                <div className="w-full sm:w-auto bg-gradient-to-br from-red-500/10 via-amber-500/10 to-transparent dark:from-red-950/40 dark:to-amber-950/20 p-5 rounded-2xl border border-red-200 dark:border-red-900/60 text-center sm:text-right">
                  <span className="text-xs uppercase font-bold text-red-700 dark:text-red-400 block">
                    Estimated Uncaptured Margin Leak
                  </span>
                  <span className="text-2xl sm:text-3xl font-display font-black text-red-600 dark:text-red-400 block mt-1">
                    {results.estimatedMonthlyLeakRupees}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-cream-400 block mt-1">
                    Leaking every single month across portions & commissions
                  </span>
                </div>
              </div>

              {/* Action buttons on banner */}
              <div className="mt-8 pt-6 border-t border-cream-200 dark:border-forest-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic Quiz
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 hover:bg-forest-900 dark:hover:bg-lime-300 transition"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Diagnostic Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Identified Critical Vulnerabilities */}
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                    High Priority Profit Leaks Detected
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-cream-400">
                    These operational blindspots directly reduce your take-home net profit each month.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {results.leaks.length > 0 ? (
                  results.leaks.map((leak, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-forest-900 dark:text-cream-50">
                          {leak.title}
                        </div>
                        <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-semibold mt-0.5">
                          Risk: {leak.risk}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {leak.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-cream-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                    Outstanding job! You scored above average on portioning, delivery channels, and cash flow hygiene.
                  </div>
                )}
              </div>
            </div>

            {/* Prioritized Budget-Conscious Action Plan */}
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lime-100 dark:bg-lime-950/60 text-forest-800 dark:text-lime-300 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                    Prioritized Zero-Cost & Low-Cost Recovery Plan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-cream-400">
                    Implement these specific steps in sequence to patch leaks without spending on expensive marketing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1: Immediate Zero Cost */}
                <div className="p-5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Phase 1 (Days 1 - 7)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Cost: ₹0</span>
                  </div>
                  <h4 className="text-sm font-bold text-forest-900 dark:text-cream-50">
                    Portion Audit & Online Price Markup
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-cream-300 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                      Weigh raw paneer/meat cuts on top 5 sellers to verify plate cost.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                      Adjust online delivery menu price by +18% to absorb Swiggy commission.
                    </li>
                  </ul>
                  <Link
                    to="/tools?tab=food-cost"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 dark:text-lime-400 hover:underline pt-1"
                  >
                    Open Food-Cost Calculator <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 2: Low-Cost High-ROI */}
                <div className="p-5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Phase 2 (Days 8 - 21)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Cost: &lt;₹1,500</span>
                  </div>
                  <h4 className="text-sm font-bold text-forest-900 dark:text-cream-50">
                    Tabletop Review Stands & Kitchen Scales
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-cream-300 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                      Buy two ₹600 digital kitchen scales for the prep counter.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                      Print 20 acrylic QR review stands for tables to build Google score.
                    </li>
                  </ul>
                  <Link
                    to="/solutions"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 dark:text-lime-400 hover:underline pt-1"
                  >
                    View Google Maps SOP <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 3: Month 2 Expansion */}
                <div className="p-5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800 dark:bg-forest-800 dark:text-lime-300">
                      Phase 3 (Month 2+)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Strategic Scale</span>
                  </div>
                  <h4 className="text-sm font-bold text-forest-900 dark:text-cream-50">
                    Direct WhatsApp & Corporate Lunch Boxes
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-cream-300 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                      Insert 15% discount cards in all delivery bags for direct repeat orders.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                      Pitch 5 neighborhood offices for weekday lunch catering subscriptions.
                    </li>
                  </ul>
                  <Link
                    to="/growth-planner"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 dark:text-lime-400 hover:underline pt-1"
                  >
                    View 6-Month Roadmap <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

            {/* Quick Link Navigation Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/tools"
                className="p-6 rounded-2xl bg-forest-900 dark:bg-forest-800 text-cream-50 flex items-center justify-between hover:bg-forest-850 transition shadow-sm group"
              >
                <div>
                  <div className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-1">
                    Recalculate Numbers
                  </div>
                  <h4 className="text-lg font-bold">Launch 5 Business Tools & Calculators</h4>
                  <p className="text-xs text-cream-200 mt-1">
                    Food cost, menu pricing, monthly profit, pantry inventory & brand brainstormer.
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-lime-400 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/growth-planner"
                className="p-6 rounded-2xl bg-cream-100 dark:bg-forest-900 text-forest-950 dark:text-cream-50 border border-cream-200 dark:border-forest-700 flex items-center justify-between hover:bg-cream-200 transition shadow-sm group"
              >
                <div>
                  <div className="text-xs font-bold text-forest-700 dark:text-lime-400 uppercase tracking-wider mb-1">
                    Implementation Track
                  </div>
                  <h4 className="text-lg font-bold">Track Your 6-Month Action Plan</h4>
                  <p className="text-xs text-slate-600 dark:text-cream-300 mt-1">
                    18 sequential tasks with interactive checkboxes, deadlines, and milestones.
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-forest-700 dark:text-lime-400 group-hover:translate-x-1 transition" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
