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
  Star,
  Flame,
  Award,
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

              {/* Featured Plating Visual Bar */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-50 dark:ring-forest-900 object-cover"
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=120&q=80"
                    alt="Chef plating"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-50 dark:ring-forest-900 object-cover"
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=120&q=80"
                    alt="Biryani handi"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-50 dark:ring-forest-900 object-cover"
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80"
                    alt="Restaurant dining"
                  />
                </div>
                <div className="text-xs text-slate-600 dark:text-cream-300">
                  <div className="flex items-center gap-1 font-bold text-forest-950 dark:text-cream-50">
                    <span className="text-amber-500 flex">★★★★★</span>
                    <span>4.9 / 5</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-cream-400">
                    Trusted by 450+ independent Indian eateries
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Profit Leak Teaser Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-forest-900/90 rounded-3xl p-6 sm:p-8 shadow-xl border border-cream-200 dark:border-forest-700/80 space-y-6 relative overflow-hidden">
                
                {/* Visual Header Image Banner */}
                <div className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 h-28 overflow-hidden mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
                    alt="Indian Tandoor Platter"
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-cream-50">
                    <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                      Live Unit Economics
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-forest-800/80 border border-forest-600 text-cream-100">
                      Target 30% Food Cost
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-cream-100 dark:border-forest-800">
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

      {/* 3. CORE PROBLEM CATEGORIES (18 CATEGORIES OVERVIEW) */}
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
              className="bg-white dark:bg-forest-900/80 rounded-3xl overflow-hidden border border-cream-200 dark:border-forest-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {prob.imageUrl && (
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img
                      src={prob.imageUrl}
                      alt={prob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-forest-900/90 text-lime-300">
                        {prob.category}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        {prob.impactLevel} Leak
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <h3 className="text-base font-bold text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-lime-400 transition-colors leading-snug">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-cream-300/90 leading-relaxed line-clamp-2">
                    {prob.shortDesc}
                  </p>

                  <div className="p-2.5 rounded-xl bg-cream-50 dark:bg-forest-950/60 border border-cream-200/80 dark:border-forest-800 text-xs flex justify-between items-center">
                    <span className="text-slate-500 dark:text-cream-400">Typical Loss:</span>
                    <span className="font-extrabold text-rose-600 dark:text-rose-400">{prob.estimatedMonthlyLoss}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-cream-100 dark:border-forest-800 mt-2">
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

      {/* 4. FEATURED PRACTICAL SOLUTIONS WITH IMAGERY */}
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
                className="bg-forest-950/80 rounded-3xl overflow-hidden border border-forest-800 flex flex-col justify-between space-y-5 hover:border-lime-500/50 transition-colors group"
              >
                <div>
                  {sol.imageUrl && (
                    <div className="relative h-44 overflow-hidden bg-forest-950">
                      <img
                        src={sol.imageUrl}
                        alt={sol.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-forest-900 text-lime-300 border border-forest-700">
                          {sol.category}
                        </span>
                        <span className="text-xs text-cream-400 flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {sol.readTime}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-cream-50 leading-snug">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-cream-300 leading-relaxed line-clamp-2">
                      {sol.summary}
                    </p>

                    <div className="p-3 rounded-2xl bg-forest-900/80 border border-forest-800 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-lime-400">Estimated Payoff</span>
                      <p className="font-extrabold text-cream-100">{sol.estimatedRoi}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/solutions"
                    className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-lime-300 font-bold text-xs text-center border border-forest-700 transition block"
                  >
                    View Full Step-by-Step SOP →
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
              <span className="text-[#AEC4D4] !text-[#AEC4D4]">Run a Real Business.</span>
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
