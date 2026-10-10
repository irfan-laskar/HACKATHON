import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const LegalCompliance: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<'proprietorship' | 'llp' | 'pvt_ltd'>('proprietorship');

  const structures = {
    proprietorship: {
      title: 'Sole Proprietorship',
      cost: '₹0 – ₹1,500',
      time: '1 to 2 business days',
      liability: 'Unlimited (Personal assets are not legally shielded)',
      compliances: 'Very Low: Individual Income Tax Return (ITR-3/4)',
      bestFor: 'Solo beginners, freelancers, home bakers, local artisans, small shop owners',
      verdict: 'Recommended starting point if launching bootstrapped with low initial risk.',
    },
    llp: {
      title: 'Limited Liability Partnership (LLP)',
      cost: '₹6,000 – ₹10,000',
      time: '7 to 10 business days',
      liability: 'Limited to partner contribution agreed in LLP deed',
      compliances: 'Moderate: MCA Form 11 (Annual Return) & Form 8 (Statement of Accounts)',
      bestFor: '2+ partners, boutique agencies, design studios, professional service firms',
      verdict: 'Ideal for partnerships who want liability protection without heavy Pvt Ltd audits.',
    },
    pvt_ltd: {
      title: 'Private Limited Company (Pvt Ltd)',
      cost: '₹8,000 – ₹15,000',
      time: '7 to 14 business days',
      liability: 'Limited to face value of unpaid shares',
      compliances: 'High: Statutory Auditor appointment, AGM, ROC AOC-4/MGT-7, Director KYC',
      bestFor: 'Startups planning institutional venture capital fundraising or stock options (ESOPs)',
      verdict: 'Do not incorporate until you have proven product-market fit or require VC investment.',
    },
  };

  const portalLinks = [
    {
      title: 'Official Udyam MSME Portal',
      url: 'https://udyamregistration.gov.in',
      desc: '100% Free government portal. Never pay agents ₹1,500 on counterfeit domains.',
      verified: 'Verified Feb 2026',
    },
    {
      title: 'Official GST Portal',
      url: 'https://www.gst.gov.in',
      desc: 'Official Central Board of Indirect Taxes & Customs portal for registration and monthly returns.',
      verified: 'Verified Feb 2026',
    },
    {
      title: 'Ministry of Corporate Affairs (MCA)',
      url: 'https://www.mca.gov.in',
      desc: 'Name approval (RUN), SPICe+ incorporation, and company DIN filings.',
      verified: 'Verified Feb 2026',
    },
    {
      title: 'FSSAI Food Licensing (FoSCoS)',
      url: 'https://foscos.fssai.gov.in',
      desc: 'Mandatory Food Safety & Standards Authority registration for bakeries, cloud kitchens and food stalls.',
      verified: 'Verified Feb 2026',
    },
  ];

  const current = structures[selectedStructure];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 dark:from-teal-950 dark:via-emerald-950 dark:to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-teal-950">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Indian Statutory Compliance & Registrations
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Business Registration, GST & Legal Clarity
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Demystifying government portals, MSME Udyam, tax thresholds, and legal structures for
            first-time Indian founders and small businesses.
          </p>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="font-bold">Educational Disclaimer — Not Formal Legal or Tax Advice</p>
          <p className="text-amber-800 dark:text-amber-300">
            Information provided herein is for general educational guidance. Statutory tax slabs,
            registration limits, and municipal rules change frequently. Always consult a practicing
            Chartered Accountant (CA) or Company Secretary (CS) before executing corporate filings.
          </p>
        </div>
      </div>

      {/* Interactive Business Entity Selector */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Interactive Comparison
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
              Which Business Structure Fits Your Stage?
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['proprietorship', 'llp', 'pvt_ltd'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedStructure(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedStructure === key
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {key === 'proprietorship' ? 'Sole Proprietorship' : key === 'llp' ? 'LLP' : 'Pvt Ltd'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Output Card */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-inner border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-teal-300">{current.title}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                {current.time}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Estimated Setup Cost</span>
                <span className="font-bold text-white text-base">{current.cost}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Personal Asset Liability</span>
                <span className="text-slate-200">{current.liability}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Annual Compliance Overhead</span>
                <span className="text-slate-200">{current.compliances}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-800 text-xs text-teal-200 leading-relaxed">
              <strong>Recommendation: </strong> {current.verdict}
            </div>
          </div>

          {/* Detailed Criteria */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Who is this best suited for?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{current.bestFor}</p>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key Decision Checkpoints
              </h5>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Are you taking outside venture capital investment right now? If no, avoid Pvt Ltd.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Are you multiple co-founders with shared capital? If yes, consider an LLP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Can you sell on Amazon or Shopify as a Sole Proprietor? Yes, 100%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Indian Registrations Explained */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Mandatory vs Optional
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            Core Indian Business Registrations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Udyam */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Free & Mandatory
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Takes 15 mins</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Udyam MSME Registration</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official central government MSME ID. Grants priority sector lending, collateral-free
              bank loans, and statutory 45-day payment protections against corporate clients.
            </p>
          </div>

          {/* GST */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Threshold Dependent
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Takes 3-5 days</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Goods & Services Tax (GST)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mandatory if goods turnover exceeds ₹40 Lakhs (₹20 Lakhs for services), or if selling
              inter-state across state borders on Amazon/Flipkart/D2C ecommerce.
            </p>
          </div>

          {/* FSSAI */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Food Businesses Only
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">₹100 / year</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">FSSAI Basic Registration</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mandatory for home bakers, cloud kitchens, cafes, and snack makers with under ₹12 Lakhs
              turnover. Required before listing on Swiggy or Zomato.
            </p>
          </div>

          {/* Trademark */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Optional But Recommended
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">50% MSME Subsidy</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trademark Registration (TM)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Protects brand name & logo from imitators. With your Udyam certificate, government fee
              is subsidized from ₹9,000 down to ₹4,500.
            </p>
          </div>
        </div>
      </section>

      {/* Authoritative Government Portal Directory */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6 transition-colors">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Verified Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Authoritative Official Government Portals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Always apply directly on .gov.in websites. Avoid middleman scams charging bogus verification fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {portalLinks.map((p, idx) => (
            <a
              key={idx}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl bg-slate-800 dark:bg-slate-900/80 hover:bg-slate-750 dark:hover:bg-slate-850 border border-slate-700 dark:border-slate-800 transition flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition">
                    {p.title}
                  </h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {p.verified}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition shrink-0" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
