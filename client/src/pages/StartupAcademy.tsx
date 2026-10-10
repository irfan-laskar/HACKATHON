import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Store,
  Utensils,
  Shirt,
  ShoppingBag,
  MapPin,
  TrendingUp,
  Calculator,
  ArrowRight,
} from 'lucide-react';

export const StartupAcademy: React.FC = () => {
  // Interactive Calculator State
  const [costOfGoods, setCostOfGoods] = useState<number>(350);
  const [packagingCost, setPackagingCost] = useState<number>(45);
  const [shippingLabor, setShippingLabor] = useState<number>(80);
  const [sellingPrice, setSellingPrice] = useState<number>(899);

  const totalCost = costOfGoods + packagingCost + shippingLabor;
  const netProfit = sellingPrice - totalCost;
  const grossMarginPercent = sellingPrice > 0 ? ((netProfit / sellingPrice) * 100).toFixed(1) : '0';

  const steps = [
    {
      num: 1,
      title: 'Identify a Validated Business Idea',
      desc: 'Look for friction points, poor existing customer service, or localized market gaps.',
    },
    {
      num: 2,
      title: 'Analyze Competitors & Customer Pain',
      desc: 'Order from 3 existing rivals. Read 1-star reviews to pinpoint their unmet needs.',
    },
    {
      num: 3,
      title: 'Define Your Initial 100 Target Tribe',
      desc: 'Profile exact demographics and psychographics of high-urgency buyers.',
    },
    {
      num: 4,
      title: 'Estimate Lean Startup Budget',
      desc: 'Map out bare-minimum initial working capital (target under ₹25,000).',
    },
    {
      num: 5,
      title: 'Choose Brand Name & Visual Palette',
      desc: 'Verify trademark & domain availability; craft clean two-color aesthetic.',
    },
    {
      num: 6,
      title: 'Secure Foundation Registrations',
      desc: 'Obtain PAN, zero-fee Udyam MSME, and sector licenses (e.g. FSSAI).',
    },
    {
      num: 7,
      title: 'Price for Gross Margin Resilience',
      desc: 'Target minimum 50% to 65% gross margins to fund marketing reinvestment.',
    },
    {
      num: 8,
      title: 'Draft 30-Day Marketing Blueprint',
      desc: 'Focus on 2 core organic channels: local WhatsApp groups + Instagram Reels.',
    },
    {
      num: 9,
      title: 'Pre-Sell to First 20 Customers',
      desc: 'Validate proof-of-demand with upfront deposits before bulk inventory buy.',
    },
    {
      num: 10,
      title: 'Deliver With "Delight Factor"',
      desc: 'Handwritten thank-you notes and samples turn first buyers into raving advocates.',
    },
    {
      num: 11,
      title: 'Collect Video Reviews & Testimonials',
      desc: 'Systematically request WhatsApp photo/video proof within 48h of delivery.',
    },
    {
      num: 12,
      title: 'Reinvest Profits & Scale Distribution',
      desc: 'Plow 70% of cash flow back into inventory, local SEO, and referral incentives.',
    },
  ];

  const guides = [
    {
      icon: Utensils,
      title: 'Home-Based Bakery & Food Setup',
      desc: 'FSSAI basic registration, hygienic kitchen protocols, shelf-life testing, and custom cake packaging.',
      link: '/articles/12-step-roadmap-launching-profitable-business-budget',
    },
    {
      icon: Store,
      title: 'Growing a Local Retail Shop',
      desc: 'Google Business Profile 3-pack ranking, acrylic QR review stands, and window display visual merchandising.',
      link: '/articles/google-business-profile-local-seo-retail-shops',
    },
    {
      icon: Shirt,
      title: 'Launching a Small Clothing Brand',
      desc: 'Fabric sourcing in local textile hubs, low-MOQ stitching units, hangtag branding, and fit guides.',
      link: '/articles/12-step-roadmap-launching-profitable-business-budget',
    },
    {
      icon: ShoppingBag,
      title: 'Selling Products Online (D2C)',
      desc: 'Setting up Shopify or WhatsApp stores, courier logistics (Shiprocket), and minimizing COD RTO losses.',
      link: '/knowledge-hub',
    },
    {
      icon: MapPin,
      title: 'Google Business Profile Local Dominance',
      desc: 'How cafes and retail shops capture high-intent "near me" customer searches without ad agencies.',
      link: '/articles/google-business-profile-local-seo-retail-shops',
    },
    {
      icon: TrendingUp,
      title: 'Zero-Budget Customer Acquisition',
      desc: 'Leveraging organic reels, micro-creator gift boxes, and localized referral systems.',
      link: '/videos/zero-budget-digital-marketing-first-100-customers',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-emerald-950">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            Startup & Growth Academy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            The Bootstrapper’s Playbook: Idea to First ₹1 Lakh
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            No venture capital required. A pragmatic, step-by-step master roadmap for beginners
            starting from home with limited capital.
          </p>
        </div>
      </div>

      {/* Interactive 12-Step Sequential Roadmap */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Sequential Execution
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            The 12-Step Business Launch Path
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500 transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                  {s.num}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{s.title}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-11">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Lean Margin & Profit Calculator */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Interactive Pricing Tool</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-1">
              Unit Economics & Gross Margin Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Never underprice. Test your product costs and verify that your margins cover overhead and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 items-center">
          {/* Input Sliders & Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Cost of Goods / Raw Materials (₹)</span>
                <span className="text-white font-bold">₹{costOfGoods}</span>
              </label>
              <input
                type="range"
                min="20"
                max="2000"
                step="10"
                value={costOfGoods}
                onChange={(e) => setCostOfGoods(Number(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Packaging, Tape & Custom Labels (₹)</span>
                <span className="text-white font-bold">₹{packagingCost}</span>
              </label>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Shipping, Courier or Assembly Labor (₹)</span>
                <span className="text-white font-bold">₹{shippingLabor}</span>
              </label>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={shippingLabor}
                onChange={(e) => setShippingLabor(Number(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Proposed Selling Retail Price (₹)</span>
                <span className="text-white font-bold">₹{sellingPrice}</span>
              </label>
              <input
                type="range"
                min="100"
                max="4000"
                step="50"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full accent-brand-500 mt-2"
              />
            </div>
          </div>

          {/* Output Metric Cards */}
          <div className="bg-slate-800/80 dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-700 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Total Unit Cost</span>
                <p className="text-2xl font-black text-slate-200 mt-1">₹{totalCost}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Net Profit Per Unit</span>
                <p className={`text-2xl font-black mt-1 ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{netProfit}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Gross Profit Margin</span>
                <p className={`text-3xl font-black font-display mt-0.5 ${Number(grossMarginPercent) >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {grossMarginPercent}%
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${Number(grossMarginPercent) >= 50 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {Number(grossMarginPercent) >= 50 ? 'Healthy Margin' : 'Thin Margin — Re-evaluate'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Bootstrapper Rule:</strong> If your gross margin is below 50%, you will struggle to afford paid shipping returns, customer discounts, or marketing. Aim for 55%+.
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated Industry Guides */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Niche Blueprints
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            Dedicated Small Business Playbooks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g, idx) => {
            const Icon = g.icon;
            return (
              <Link
                key={idx}
                to={g.link}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500 shadow-2xs hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{g.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  <span>Read Playbook</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
