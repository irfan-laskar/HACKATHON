import React, { useState } from 'react';
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
} from 'lucide-react';
import { RESTAURANT_PROBLEMS, RESTAURANT_SOLUTIONS, SIX_MONTH_GROWTH_PLAN } from '../data/restaurantData';

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

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-lime-300/20 via-forest-500/10 to-transparent dark:from-forest-800/30 dark:via-lime-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900/80 border border-forest-200 dark:border-forest-700/80 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Small Restaurant Growth Platform • India</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black font-display text-forest-950 dark:text-cream-50 tracking-tight leading-[1.12]">
                Your Restaurant <br className="hidden sm:inline" />
                <span className="text-forest-700 dark:text-lime-400 underline decoration-lime-400/60 dark:decoration-lime-500/80 underline-offset-8">
                  Deserves to Grow
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-cream-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Identify why your bank balance doesn't reflect your busy kitchen. We help small dine-ins,
                cloud kitchens, and neighborhood cafes cut food waste, escape 24% aggregator commission traps,
                and unlock predictable profit.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/problem-finder"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 dark:bg-lime-500 dark:hover:bg-lime-400 text-cream-50 dark:text-forest-950 font-extrabold text-sm shadow-forest flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <Compass className="w-5 h-5 text-lime-400 dark:text-forest-950" />
                  <span>Take Problem Finder (3 Min)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/tools"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-cream-100 dark:bg-forest-900/90 hover:bg-cream-200 dark:hover:bg-forest-800 text-forest-900 dark:text-cream-50 font-bold text-sm border border-cream-300 dark:border-forest-700 flex items-center justify-center gap-2 transition"
                >
                  <Calculator className="w-4 h-4 text-forest-700 dark:text-lime-400" />
                  <span>Explore 5 Free Calculators</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-600 dark:text-cream-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-lime-400" />
                  No Paid Software Ads
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-lime-400" />
                  Honest Indian F&B Unit Economics
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-lime-400" />
                  100% Free & Open Access
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Profit Leak Teaser Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-forest-900/90 rounded-3xl p-6 sm:p-8 shadow-xl border border-cream-200 dark:border-forest-700/80 space-y-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-cream-100 dark:border-forest-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
                      Quick Margin Diagnostic
                    </span>
                    <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50">
                      Calculate Your Monthly Profit Leak
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-forest-800 dark:text-lime-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                {/* Slider 1: Monthly Revenue */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-cream-200">
                    <span>Monthly Sales Volume</span>
                    <span className="text-forest-800 dark:text-lime-300 font-bold">
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
                    className="w-full h-2 bg-cream-200 dark:bg-forest-800 rounded-lg appearance-none cursor-pointer accent-forest-700 dark:accent-lime-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹1 Lakh</span>
                    <span>₹15 Lakhs</span>
                  </div>
                </div>

                {/* Slider 2: Current Food Cost % */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-cream-200">
                    <span>Estimated Food Cost %</span>
                    <span className={`${estimatedFoodCostPct > 32 ? 'text-amber-600 dark:text-amber-400' : 'text-forest-700 dark:text-lime-400'} font-bold`}>
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
                    className="w-full h-2 bg-cream-200 dark:bg-forest-800 rounded-lg appearance-none cursor-pointer accent-forest-700 dark:accent-lime-500"
                  />
                </div>

                {/* Slider 3: Delivery Channel Share % */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-cream-200">
                    <span>Swiggy / Zomato Delivery Share</span>
                    <span className="text-forest-800 dark:text-lime-300 font-bold">{deliverySharePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={deliverySharePct}
                    onChange={(e) => setDeliverySharePct(Number(e.target.value))}
                    className="w-full h-2 bg-cream-200 dark:bg-forest-800 rounded-lg appearance-none cursor-pointer accent-forest-700 dark:accent-lime-500"
                  />
                </div>

                {/* Output Highlight Card */}
                <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-950/80 border border-forest-200 dark:border-forest-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-cream-300">
                    <span>Overspent on Raw Food Wastage:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      ₹{Math.round(foodCostOverspend).toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-cream-300">
                    <span>Aggregator Commissions Paid:</span>
                    <span className="font-bold text-rose-700 dark:text-rose-400">
                      ₹{Math.round(aggregatorCommissions).toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="pt-2 border-t border-forest-200/80 dark:border-forest-800 flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase text-forest-950 dark:text-cream-50">
                      Recoverable Profit:
                    </span>
                    <span className="text-xl font-black text-forest-800 dark:text-lime-400">
                      +₹{Math.round(totalMonthlyPotentialProfit).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500">/month</span>
                    </span>
                  </div>
                </div>

                <Link
                  to="/tools?tab=food-cost"
                  className="block text-center py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-cream-50 font-bold text-xs transition"
                >
                  Open Full Food-Cost Calculator →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE PROBLEM CATEGORIES (18 CATEGORIES OVERVIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-lime-400">
              18 Root-Cause Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 dark:text-cream-50 font-display">
              Where Small Restaurants Silently Bleed Profit
            </h2>
            <p className="text-sm text-slate-600 dark:text-cream-300">
              Most restaurant owners work 14-hour days without realizing where the cash is leaking.
              Explore research-backed breakdowns across the full operational spectrum.
            </p>
          </div>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 dark:text-lime-400 hover:underline shrink-0"
          >
            <span>View All 18 Problem Playbooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Spotlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANT_PROBLEMS.slice(0, 6).map((prob) => (
            <div
              key={prob.id}
              className="bg-white dark:bg-forest-900/80 rounded-3xl p-6 border border-cream-200 dark:border-forest-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-cream-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 border border-cream-200 dark:border-forest-700">
                    {prob.category}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                    {prob.impactLevel} Leak
                  </span>
                </div>

                <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-lime-400 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-cream-300/90 leading-relaxed">
                  {prob.shortDesc}
                </p>

                <div className="p-3 rounded-xl bg-cream-50 dark:bg-forest-950/60 border border-cream-200/80 dark:border-forest-800 text-xs flex justify-between items-center">
                  <span className="text-slate-500 dark:text-cream-400">Typical Loss:</span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400">{prob.estimatedMonthlyLoss}</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-cream-100 dark:border-forest-800 flex items-center justify-between">
                <Link
                  to={`/problems?search=${encodeURIComponent(prob.title)}`}
                  className="text-xs font-bold text-forest-800 dark:text-lime-400 hover:text-forest-950 dark:hover:text-lime-300 flex items-center gap-1"
                >
                  <span>Read Action Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {prob.recommendedToolPath && (
                  <Link
                    to={prob.recommendedToolPath}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-cream-200 font-semibold hover:bg-forest-200 dark:hover:bg-forest-700 transition"
                  >
                    Use Tool →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRACTICAL SOLUTIONS */}
      <section className="bg-forest-900 text-cream-50 py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-lime-400">
              Tested Field Playbooks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Actionable Solutions That Add Real Cash
            </h2>
            <p className="text-sm text-cream-300">
              Not generic motivational advice. Step-by-step systems designed for the ground realities of Indian kitchen staff, billing counters, and supply chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESTAURANT_SOLUTIONS.slice(0, 3).map((sol) => (
              <div
                key={sol.id}
                className="bg-forest-950/80 rounded-3xl p-6 sm:p-7 border border-forest-800 flex flex-col justify-between space-y-6 hover:border-lime-500/50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-forest-800 text-lime-300">
                      {sol.category}
                    </span>
                    <span className="text-xs text-cream-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {sol.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-cream-50 leading-snug">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-cream-300 leading-relaxed">
                    {sol.summary}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-forest-900/80 border border-forest-800 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-lime-400">Estimated Payoff</span>
                    <p className="font-extrabold text-cream-100">{sol.estimatedRoi}</p>
                  </div>
                </div>

                <Link
                  to="/solutions"
                  className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-lime-300 font-bold text-xs text-center border border-forest-700 transition"
                >
                  View Full Step-by-Step SOP →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIX-MONTH GROWTH PLAN PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-lime-400">
              Structured Roadmap
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 dark:text-cream-50 font-display">
              The 6-Month Restaurant Turnaround Plan
            </h2>
            <p className="text-sm text-slate-600 dark:text-cream-300">
              A sequenced, week-by-week implementation blueprint. Never wonder what to focus on next.
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

        {/* 6 Month Horizontal Progression Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              month: 'Month 1',
              title: 'Cost Audit & Standardization',
              desc: 'Recipe cards, portion control ladles, FSSAI hygiene audit, and separate business current account.',
              tasksCount: 4,
            },
            {
              month: 'Month 2',
              title: 'Menu Engineering & Pricing',
              desc: 'Plowhorse re-pricing, delivery price markup (+18%), and crowning 2 Hero signature dishes.',
              tasksCount: 3,
            },
            {
              month: 'Month 3',
              title: 'Google Maps & Local Search',
              desc: 'Claim GPS profile, table QR review generators to hit 50+ reviews, and photo upload cadence.',
              tasksCount: 3,
            },
            {
              month: 'Month 4',
              title: 'Direct WhatsApp Ordering',
              desc: 'Delivery bag inserts with 15% off, WhatsApp catalog menu, and spill-proof container upgrades.',
              tasksCount: 3,
            },
            {
              month: 'Month 5',
              title: 'Loyalty & B2B Partnerships',
              desc: '5th visit complimentary reward, nearby office corporate lunch boxes, and staff bonus pool.',
              tasksCount: 3,
            },
            {
              month: 'Month 6',
              title: 'Catering & Cloud Scaling',
              desc: 'Bulk 20-50 pax party catering packages, final P&L margin re-audit, and second kitchen evaluation.',
              tasksCount: 3,
            },
          ].map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-forest-900/80 border border-cream-200 dark:border-forest-800 shadow-xs space-y-3 relative overflow-hidden group hover:border-forest-600 dark:hover:border-lime-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-950 px-2.5 py-0.5 rounded-full">
                  {m.month}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-cream-400">
                  {m.tasksCount} Key Milestones
                </span>
              </div>
              <h4 className="text-base font-bold text-forest-950 dark:text-cream-50 font-display">
                {m.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-cream-300 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 rounded-3xl p-8 sm:p-14 text-white text-center sm:text-left relative overflow-hidden shadow-xl border border-forest-700">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
              Start Free Diagnosis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-cream-50 leading-tight">
              Ready to Stop Guessing and Start Operating with Clarity?
            </h2>
            <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
              Take our 5-minute Restaurant Problem Finder to uncover your specific profit leaks, or jump straight into the Food-Cost Calculator.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <Link
                to="/problem-finder"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-forest-950 font-extrabold text-sm shadow-md transition"
              >
                Start Problem Finder Assessment
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 font-bold text-sm border border-forest-600 transition"
              >
                View Demonstration Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
