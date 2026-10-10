import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calculator,
  AlertTriangle,
  Lightbulb,
  CalendarCheck2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  Percent,
  Sparkles,
  Users,
  Clock,
  Layers,
  ChefHat,
  Search,
  Star,
  Flame,
  Award,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import {
  RESTAURANT_PROBLEMS,
  RESTAURANT_SOLUTIONS,
  SIX_MONTH_GROWTH_PLAN,
  PROBLEM_CATEGORIES,
  RestaurantProblem,
} from '../data/restaurantData';
import { useToast } from '../context/ToastContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Interactive Mini Food Cost Leak Calculator on Homepage
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(350000);
  const [estimatedFoodCostPct, setEstimatedFoodCostPct] = useState<number>(38);
  const [deliverySharePct, setDeliverySharePct] = useState<number>(45);

  const targetFoodCostPct = 30;
  const foodCostOverspend = Math.max(0, monthlyRevenue * ((estimatedFoodCostPct - targetFoodCostPct) / 100));
  const deliverySales = monthlyRevenue * (deliverySharePct / 100);
  const aggregatorCommissions = deliverySales * 0.23; // avg 23%
  const recoverableDirectMargin = aggregatorCommissions * 0.35; // 35% converted to direct
  const totalMonthlyPotentialProfit = foodCostOverspend + recoverableDirectMargin;

  const { showToast } = useToast();

  // Problem Section State on Home (matching Solutions page architecture)
  const [selectedProbCategory, setSelectedProbCategory] = useState<string>('All');
  const [probSearchQuery, setProbSearchQuery] = useState<string>('');
  const [expandedProbId, setExpandedProbId] = useState<string | null>('prob-food-costing');
  const [completedProbSteps, setCompletedProbSteps] = useState<{ [id: string]: number[] }>({});
  const [copiedProbId, setCopiedProbId] = useState<string | null>(null);

  // Solutions Section State on Home (matching Solutions page architecture)
  const [expandedSolId, setExpandedSolId] = useState<string | null>('sol-portion-control');
  const [completedSolItems, setCompletedSolItems] = useState<Record<string, boolean>>({});
  const [copiedSolId, setCopiedSolId] = useState<string | null>(null);

  const filteredHomeProblems = useMemo(() => {
    return RESTAURANT_PROBLEMS.filter((prob) => {
      if (selectedProbCategory !== 'All' && prob.category.toLowerCase() !== selectedProbCategory.toLowerCase()) {
        return false;
      }
      if (probSearchQuery.trim()) {
        const q = probSearchQuery.toLowerCase();
        return (
          prob.title.toLowerCase().includes(q) ||
          prob.shortDesc.toLowerCase().includes(q) ||
          prob.category.toLowerCase().includes(q) ||
          prob.rootCauses.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    }).slice(0, 4);
  }, [selectedProbCategory, probSearchQuery]);

  const toggleProbStep = (problemId: string, stepIndex: number) => {
    setCompletedProbSteps((prev) => {
      const current = prev[problemId] || [];
      const updated = current.includes(stepIndex)
        ? current.filter((idx) => idx !== stepIndex)
        : [...current, stepIndex];
      return { ...prev, [problemId]: updated };
    });
  };

  const handleCopyProbPlan = (prob: RestaurantProblem) => {
    const text = `ScaleTrix Action Plan for: ${prob.title}\n` +
      `Estimated Margin Leak: ${prob.marginLeakPercent} (${prob.estimatedMonthlyLoss}/month)\n\n` +
      `Root Causes:\n${prob.rootCauses.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n` +
      `Corrective SOP Steps:\n${prob.actionPlan.map((a, i) => `[ ] ${i + 1}. ${a}`).join('\n')}\n\n` +
      `Recommended Diagnostic Tool: ${prob.recommendedToolName || 'ScaleTrix Business Tools'}`;

    navigator.clipboard.writeText(text);
    setCopiedProbId(prob.id);
    showToast('Action plan & SOP checklist copied to clipboard!', 'success');
    setTimeout(() => setCopiedProbId(null), 2500);
  };

  const toggleSolChecklist = (solId: string, itemIdx: number) => {
    const key = `${solId}-${itemIdx}`;
    setCompletedSolItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopySolChecklist = (sol: (typeof RESTAURANT_SOLUTIONS)[0]) => {
    const text = `ScaleTrix SOP Checklist: ${sol.title}\nCategory: ${sol.category}\nEstimated Impact: ${sol.estimatedRoi}\n\n` +
      `Key Steps:\n${sol.keySteps.map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`).join('\n')}\n\n` +
      `Checklist Items:\n${sol.checklistItems.map((c, i) => `[ ] ${i + 1}. ${c}`).join('\n')}\n\n` +
      `Pro Tip: ${sol.proTip}`;

    navigator.clipboard.writeText(text);
    setCopiedSolId(sol.id);
    showToast('Solution SOP checklist copied to clipboard!', 'success');
    setTimeout(() => setCopiedSolId(null), 2500);
  };

  const restaurantFormats = [
    {
      title: 'Casual Dine-In & Dhabas',
      seats: '20 - 60 Seaters',
      desc: 'Optimize front-of-house table turns, calculate plate costs, and eliminate kitchen over-portioning.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      badge: 'Table Turns & Portions',
    },
    {
      title: 'Cloud Kitchens & Delivery Hubs',
      seats: '100% Online Delivery',
      desc: 'Absorb 24% Swiggy/Zomato commission cuts with smart menu markups and direct WhatsApp loyalty.',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=600&q=80',
      badge: 'Commission Absorption',
    },
    {
      title: 'Chai Bars, Bakeries & QSRs',
      seats: 'Quick Turnaround',
      desc: 'High footfall speed, low food cost beverage combos, and automated par-level inventory reorders.',
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=80',
      badge: 'High-Margin Combos',
    },
    {
      title: 'Specialty Biryani & Grills',
      seats: 'Signature Champions',
      desc: 'Crown high-margin signature dishes, standardize marinades, and package in branded handis.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      badge: 'Hero Dishes & SOPs',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#790D16]/20 via-[#AEC4D4]/15 to-transparent dark:from-[#790D16]/30 dark:via-[#AEC4D4]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#790D16]/10 dark:bg-[#790D16]/40 border border-[#790D16]/30 dark:border-[#E5D3AF]/40 text-[#790D16] dark:text-[#E5D3AF] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#790D16] dark:text-[#AEC4D4]" />
                <span>Small Restaurant Growth Platform • India</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black font-display text-[#220306] dark:text-[#F5EFE1] tracking-tight leading-[1.12]">
                Your Restaurant <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#790D16] dark:text-[#AEC4D4] underline decoration-[#AEC4D4]/60 dark:decoration-[#AEC4D4]/80 underline-offset-8">
                  Deserves to Grow
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-[#E5D3AF] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Identify why your bank balance doesn't reflect your busy kitchen. We help small dine-ins,
                cloud kitchens, and neighborhood cafes cut food waste, escape 24% aggregator commission traps,
                and unlock predictable profit.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/problem-finder"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#AEC4D4] hover:bg-[#cde0ee] text-[#220306] font-extrabold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-[#220306]" />
                  <span>Take Problem Finder (3 Min)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/tools"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#790D16] hover:bg-[#91111c] text-[#F5EFE1] font-bold text-sm border border-[#E5D3AF]/40 shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-[#E5D3AF]" />
                  <span>Explore 5 Free Calculators</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-700 dark:text-[#E5D3AF]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#790D16] dark:text-[#AEC4D4]" />
                  No Paid Software Ads
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#790D16] dark:text-[#AEC4D4]" />
                  Honest Indian F&B Unit Economics
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#790D16] dark:text-[#AEC4D4]" />
                  100% Free & Open Access
                </span>
              </div>

              {/* Featured Plating Visual Bar */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#E5D3AF] dark:ring-[#790D16] object-cover"
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=120&q=80"
                    alt="Chef plating"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#E5D3AF] dark:ring-[#790D16] object-cover"
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=120&q=80"
                    alt="Biryani handi"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#E5D3AF] dark:ring-[#790D16] object-cover"
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80"
                    alt="Restaurant dining"
                  />
                </div>
                <div className="text-xs text-slate-700 dark:text-[#E5D3AF]">
                  <div className="flex items-center gap-1 font-bold text-[#220306] dark:text-[#F5EFE1]">
                    <span className="text-amber-400 flex">★★★★★</span>
                    <span>4.9 / 5</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-[#E5D3AF]/80">
                    Trusted by 450+ independent Indian eateries
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Profit Leak Teaser Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 dark:bg-[#3a0509] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E5D3AF] dark:border-[#790D16] space-y-6 relative overflow-hidden">
                
                {/* Visual Header Image Banner */}
                <div className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 h-28 overflow-hidden mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
                    alt="Indian Tandoor Platter"
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#220306] via-[#220306]/40 to-transparent" />
                  <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-[#F5EFE1]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AEC4D4]">
                      Live Unit Economics
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#790D16] border border-[#E5D3AF]/40 text-[#F5EFE1]">
                      Target 30% Food Cost
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#E5D3AF]/60 dark:border-[#790D16]">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#790D16] dark:text-[#AEC4D4]">
                      Quick Margin Diagnostic
                    </span>
                    <h3 className="text-lg font-bold font-display text-[#220306] dark:text-[#F5EFE1]">
                      Calculate Your Monthly Profit Leak
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#E5D3AF]/60 dark:bg-[#790D16] flex items-center justify-center text-[#790D16] dark:text-[#AEC4D4] shadow-xs">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                {/* Slider 1: Monthly Revenue */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#220306] dark:text-[#E5D3AF]">
                    <span>Monthly Sales Volume</span>
                    <span className="text-[#790D16] dark:text-[#AEC4D4] font-black">
                      ₹{monthlyRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="1500000"
                    step="25000"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-[#E5D3AF]/40 dark:bg-[#220306] rounded-lg appearance-none cursor-pointer accent-[#790D16] dark:accent-[#AEC4D4]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-[#E5D3AF]/70 font-medium">
                    <span>₹1 Lakh</span>
                    <span>₹15 Lakhs</span>
                  </div>
                </div>

                {/* Slider 2: Current Food Cost % */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#220306] dark:text-[#E5D3AF]">
                    <span>Estimated Food Cost %</span>
                    <span className={`${estimatedFoodCostPct > 32 ? 'text-amber-600 dark:text-[#f87171]' : 'text-emerald-700 dark:text-[#AEC4D4]'} font-bold`}>
                      {estimatedFoodCostPct}% {estimatedFoodCostPct > 32 ? '(Benchmark is 28-32%)' : '✓ Healthy'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    step="1"
                    value={estimatedFoodCostPct}
                    onChange={(e) => setEstimatedFoodCostPct(Number(e.target.value))}
                    className="w-full h-2 bg-[#E5D3AF]/40 dark:bg-[#220306] rounded-lg appearance-none cursor-pointer accent-[#790D16] dark:accent-[#AEC4D4]"
                  />
                </div>

                {/* Slider 3: Delivery Channel Share % */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#220306] dark:text-[#E5D3AF]">
                    <span>Swiggy / Zomato Delivery Share</span>
                    <span className="text-[#790D16] dark:text-[#AEC4D4] font-black">{deliverySharePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={deliverySharePct}
                    onChange={(e) => setDeliverySharePct(Number(e.target.value))}
                    className="w-full h-2 bg-[#E5D3AF]/40 dark:bg-[#220306] rounded-lg appearance-none cursor-pointer accent-[#790D16] dark:accent-[#AEC4D4]"
                  />
                </div>

                {/* Output Highlight Card */}
                <div className="p-4 rounded-2xl bg-[#f4ecdc] dark:bg-[#220306] border border-[#E5D3AF] dark:border-[#790D16] space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-[#E5D3AF]">
                    <span>Overspent on Raw Food Wastage:</span>
                    <span className="font-extrabold text-[#790D16] dark:text-[#f87171]">
                      ₹{Math.round(foodCostOverspend).toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-700 dark:text-[#E5D3AF]">
                    <span>Aggregator Commissions Paid:</span>
                    <span className="font-extrabold text-[#790D16] dark:text-[#f87171]">
                      ₹{Math.round(aggregatorCommissions).toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5D3AF]/60 dark:border-[#790D16] flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-[#220306] dark:text-[#F5EFE1]">
                      Recoverable Profit:
                    </span>
                    <span className="text-xl font-black text-[#790D16] dark:text-[#AEC4D4]">
                      +₹{Math.round(totalMonthlyPotentialProfit).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500 dark:text-[#E5D3AF]/70">/month</span>
                    </span>
                  </div>
                </div>

                <Link
                  to="/tools?tab=food-cost"
                  className="block text-center py-3 rounded-xl bg-[#790D16] hover:bg-[#91111c] text-[#F5EFE1] font-extrabold text-xs border border-[#E5D3AF]/40 transition shadow-md cursor-pointer"
                >
                  Open Full Food-Cost Calculator →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RESTAURANT FORMATS VISUAL SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-lime-400">
            Tailored For Your Operating Model
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 dark:text-cream-50 font-display">
            Built For Indian Independent Food Businesses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300">
            Different restaurant models bleed cash in different ways. Select your format to see where your margins are vulnerable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurantFormats.map((fmt, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-forest-900 rounded-3xl overflow-hidden border border-cream-200 dark:border-forest-800 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={fmt.image}
                    alt={fmt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-forest-950/80 text-lime-300 backdrop-blur-md">
                      {fmt.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    {fmt.seats}
                  </span>
                  <h3 className="text-base font-bold text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-lime-400 transition-colors">
                    {fmt.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-cream-300 leading-relaxed">
                    {fmt.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to="/problem-finder"
                  className="w-full py-2 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cream-200 transition"
                >
                  Run Diagnostic <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE PROBLEM CATEGORIES (18 CATEGORIES OVERVIEW - MATCHING SOLUTIONS STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider border border-forest-200 dark:border-forest-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Operational & Financial Diagnostic Library</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
              Where Small Restaurants <br className="hidden sm:inline" />
              <span className="italic font-normal text-forest-700 dark:text-lime-400">Silently Bleed Profit</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed font-normal">
              Most restaurant owners work 14-hour days without realizing where the cash is leaking.
              Explore research-backed breakdowns across the full operational spectrum with step-by-step corrective SOPs.
            </p>
          </div>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 dark:text-lime-400 hover:underline shrink-0 pb-1"
          >
            <span>View All 18 Problem Playbooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

                {/* Filter & Search Bar (Matching Solutions Style) */}
        <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-cream-200 dark:border-forest-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cream-400" />
            <input
              type="text"
              value={probSearchQuery}
              onChange={(e) => setProbSearchQuery(e.target.value)}
              placeholder="Search problems by keyword (e.g. food cost, recipe, delivery commission, chef, wastage)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 placeholder-slate-400 dark:placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm font-medium"
            />
            {probSearchQuery && (
              <button
                type="button"
                onClick={() => setProbSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-cream-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {PROBLEM_CATEGORIES.map((cat) => {
              const active = selectedProbCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedProbCategory(cat)}
                  className={'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ' + (
                    active
                      ? 'bg-forest-800 text-cream-50 dark:bg-lime-500 dark:text-forest-950 shadow-xs'
                      : 'bg-cream-100 dark:bg-forest-800/60 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Action Prompt */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-cream-400">
            Showing <span className="font-bold text-forest-800 dark:text-lime-300">{filteredHomeProblems.length}</span> battle-tested restaurant problem breakdowns
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
        {filteredHomeProblems.length === 0 ? (
          <div className="text-center py-16 bg-white/90 dark:bg-forest-900/60 rounded-3xl border border-cream-200 dark:border-forest-800 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50">No Matching Problems Found</h3>
            <p className="text-xs text-slate-500 dark:text-cream-300">Try adjusting your search keyword or selected category filter.</p>
            <button
              onClick={() => {
                setProbSearchQuery('');
                setSelectedProbCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-forest-800 text-cream-50 text-xs font-bold hover:bg-forest-900 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHomeProblems.map((prob) => {
              const isExpanded = expandedProbId === prob.id;
              const completedForThisProblem = completedProbSteps[prob.id] || [];
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
                        <span className={'text-xs font-extrabold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 ' + (
                          prob.impactLevel === 'Critical'
                            ? 'bg-rose-600 text-white'
                            : prob.impactLevel === 'High'
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                        )}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {prob.impactLevel} Leak
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
                        <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Margin Leak: {prob.marginLeakPercent}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900/60">
                        <span>Monthly Loss:</span>
                        <span className="font-extrabold">{prob.estimatedMonthlyLoss}</span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-forest-950 dark:text-cream-50 leading-snug">
                      {prob.title}
                    </h3>

                    <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-cream-200 leading-relaxed font-normal">
                      {prob.shortDesc}
                    </p>

                    {/* SOP Action Bar */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cream-100 dark:border-forest-800/80">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedProbId(isExpanded ? null : prob.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 hover:bg-forest-900 dark:hover:bg-lime-300 transition cursor-pointer shadow-xs"
                        >
                          {isExpanded ? (
                            <>
                              Hide Implementation SOP <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              View Step-by-Step SOP ({prob.actionPlan.length} Steps) <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyProbPlan(prob)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700 transition cursor-pointer"
                          title="Copy SOP to clipboard"
                        >
                          {copiedProbId === prob.id ? (
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

                      {prob.recommendedToolPath && (
                        <Link
                          to={prob.recommendedToolPath}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-lime-400 hover:text-forest-950 dark:hover:text-lime-300"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Launch {prob.recommendedToolName || 'Calculator'} →</span>
                        </Link>
                      )}
                    </div>

                    {/* Expandable SOP Checklist & Root Causes Drawer */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-cream-200 dark:border-forest-800 space-y-6 animate-fadeIn">
                        
                        {/* 1. Why This Happens In Indian Kitchens */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-lime-300 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Why This Happens in Indian Kitchens
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {prob.rootCauses.map((cause, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 text-xs text-slate-700 dark:text-cream-200 flex items-start gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed">{cause}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Immediate Corrective SOP Checklist */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-lime-300 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                              Immediate Corrective Action Plan ({completedForThisProblem.length}/{prob.actionPlan.length} Completed)
                            </h4>
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
                                  onClick={() => toggleProbStep(prob.id, idx)}
                                  className={'p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ' + (
                                    isChecked
                                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-600 dark:text-cream-300 line-through'
                                      : 'bg-cream-50 dark:bg-forest-950 border-cream-200 dark:border-forest-800 hover:border-forest-300 text-slate-800 dark:text-cream-100'
                                  )}
                                >
                                  <div className={'w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ' + (
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-cream-300 dark:border-forest-700 bg-white dark:bg-forest-900 text-transparent'
                                  )}>
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
                            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-forest-950 text-xs font-black transition cursor-pointer"
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

        {/* View All Button */}
        <div className="text-center pt-2">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 dark:bg-lime-500 dark:hover:bg-lime-400 text-cream-50 dark:text-forest-950 font-bold text-sm shadow-md transition cursor-pointer"
          >
            <span>Explore All 18 Problem Playbooks & SOPs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* 4. FEATURED PRACTICAL SOLUTIONS WITH IMAGERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider border border-forest-200 dark:border-forest-700">
              <Lightbulb className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Tested Field Playbooks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
              Actionable Solutions <br className="hidden sm:inline" />
              <span className="italic font-normal text-forest-700 dark:text-lime-400">That Add Real Cash</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed font-normal">
              Not generic motivational advice. Step-by-step systems designed for the ground realities of Indian kitchen staff, billing counters, and supply chains.
            </p>
          </div>
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 dark:text-lime-400 hover:underline shrink-0 pb-1"
          >
            <span>View All 9 Solutions & SOPs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {RESTAURANT_SOLUTIONS.slice(0, 3).map((sol) => {
            const isExpanded = expandedSolId === sol.id;
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

                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300">
                        {sol.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-cream-400">
                        <Clock className="w-3.5 h-3.5" /> {sol.readTime}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {sol.difficulty}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 dark:bg-lime-950/60 text-lime-700 dark:text-lime-300 text-xs font-bold border border-lime-200 dark:border-lime-800/80">
                      <TrendingUp className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                      ROI: {sol.estimatedRoi}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-forest-950 dark:text-cream-50 leading-snug">
                    {sol.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-cream-200 leading-relaxed font-normal">
                    {sol.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cream-100 dark:border-forest-800/80">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setExpandedSolId(isExpanded ? null : sol.id)}
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
                        onClick={() => handleCopySolChecklist(sol)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-forest-800 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-forest-700 transition cursor-pointer"
                        title="Copy SOP to clipboard"
                      >
                        {copiedSolId === sol.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500 dark:text-cream-300" />
                            <span>Copy SOP</span>
                          </>
                        )}
                      </button>
                    </div>

                    <Link
                      to="/solutions"
                      className="text-xs font-bold text-forest-800 dark:text-lime-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Full Solutions Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Expandable Solutions SOP Drawer */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-cream-200 dark:border-forest-800 space-y-6 animate-fadeIn">
                      {/* Key Execution Steps */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-lime-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                          Core Implementation Steps
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {sol.keySteps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 text-xs space-y-1"
                            >
                              <span className="font-bold text-forest-900 dark:text-lime-300 block">
                                {sIdx + 1}. {step.title}
                              </span>
                              <p className="text-slate-600 dark:text-cream-300 leading-relaxed text-[11px]">{step.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Checklist */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-lime-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                          Action Checklist Items
                        </h4>
                        <div className="space-y-2">
                          {sol.checklistItems.map((cItem, cIdx) => {
                            const isChecked = !!completedSolItems[`${sol.id}-${cIdx}`];
                            return (
                              <div
                                key={cIdx}
                                onClick={() => toggleSolChecklist(sol.id, cIdx)}
                                className={'p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ' + (
                                  isChecked
                                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-600 dark:text-cream-300 line-through'
                                    : 'bg-cream-50 dark:bg-forest-950 border-cream-200 dark:border-forest-800 hover:border-forest-300 text-slate-800 dark:text-cream-100'
                                )}
                              >
                                <div
                                  className={'w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ' + (
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-cream-300 dark:border-forest-700 bg-white dark:bg-forest-900 text-transparent'
                                  )}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                                <span className="text-xs sm:text-sm leading-relaxed">{cItem}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pro Tip Box */}
                      <div className="p-4 rounded-2xl bg-cream-100 dark:bg-forest-900/80 border border-cream-200 dark:border-forest-700/80 text-xs text-slate-700 dark:text-cream-200">
                        <span className="font-bold text-forest-900 dark:text-lime-300 block mb-1">💡 Field Pro-Tip:</span>
                        <p>{sol.proTip}</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 dark:bg-lime-500 dark:hover:bg-lime-400 text-cream-50 dark:text-forest-950 font-bold text-sm shadow-md transition cursor-pointer"
          >
            <span>Explore All 9 Restaurant Solutions & SOPs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. SIX-MONTH GROWTH PLAN PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-lime-400">
                Structured Roadmap
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/50">
                Month 1 Free • Then ₹29/mo
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 dark:text-cream-50 font-display">
              The 6-Month Action Plan Preview
            </h2>
            <p className="text-sm text-slate-600 dark:text-cream-300">
              Turnaround doesn't happen by chance. Execute Month 1 portioning audits 100% free, then continue the complete 6-month roadmap for just ₹29/month.
            </p>
          </div>
          <Link
            to="/growth-planner"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 dark:text-lime-400 hover:underline shrink-0"
          >
            <span>Open Interactive Growth Planner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              month: 'Month 1',
              badge: 'Free Access',
              title: 'Foundation & Cost Audit',
              image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
              tasks: 'Weigh 10 bestseller plates, equip kitchen with digital scales, FSSAI audit, separate bank account.',
            },
            {
              month: 'Month 2',
              badge: '₹29/mo Pro',
              title: 'Menu Engineering & Pricing',
              image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
              tasks: 'Classify Stars vs Dogs, set +20% online delivery price markup, design 2 signature dishes.',
            },
            {
              month: 'Month 3',
              badge: '₹29/mo Pro',
              title: 'Local SEO & Google Maps',
              image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
              tasks: 'Optimize Google profile, install tabletop QR review stands, service recovery on past complaints.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-forest-900 rounded-3xl overflow-hidden border border-cream-200 dark:border-forest-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition"
            >
              <div className="space-y-4">
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-lime-400 text-forest-950">
                      {item.month}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-forest-950/80 text-cream-100 backdrop-blur-xs">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-cream-300 leading-relaxed">
                  {item.tasks}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-cream-100 dark:border-forest-800">
                <Link
                  to="/growth-planner"
                  className="text-xs font-bold text-forest-800 dark:text-lime-400 hover:underline inline-flex items-center gap-1"
                >
                  View Tasks & Checkboxes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
            alt="Warm Indian Diner Ambience"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.20]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#220306]/95 via-[#3a0509]/85 to-[#220306]/80" />
          <div className="relative p-8 sm:p-14 text-center text-cream-50 max-w-3xl mx-auto space-y-6">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#E5D3AF] bg-[#790D16]/85 px-4 py-1.5 rounded-full border border-[#E5D3AF]/40 shadow-xs">
              Start Your Margin Recovery Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight text-white !text-white">
              Stop Guessing Your Numbers. <br />
              <span className="italic font-normal text-[#AEC4D4] !text-[#AEC4D4]">Run a Real Business.</span>
            </h2>
            <p className="text-sm sm:text-base text-cream-100 font-medium leading-relaxed max-w-xl mx-auto">
              Join hundreds of small restaurant owners, dhabas, and cloud kitchens who turned their busy kitchens into profitable businesses with Scaletrix.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/problem-finder"
                className="px-8 py-3.5 rounded-xl bg-[#AEC4D4] hover:bg-[#cde0ee] text-[#220306] font-black text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Restaurant Problem Finder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tools"
                className="px-8 py-3.5 rounded-xl bg-[#790D16] hover:bg-[#91111c] text-white font-bold text-sm transition border border-[#E5D3AF]/40 shadow-md cursor-pointer"
              >
                Explore Calculators
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
