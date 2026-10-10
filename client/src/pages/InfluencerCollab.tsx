import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const InfluencerCollab: React.FC = () => {
  const { showToast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Rate Estimator State
  const [followerTier, setFollowerTier] = useState<'nano' | 'micro' | 'mid'>('nano');
  const [deliverableType, setDeliverableType] = useState<'story' | 'reel' | 'bundle'>('reel');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast('Proposal script copied to clipboard!', 'success');
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const templates = [
    {
      title: 'High-Converting "Gift Box With No Strings" Pitch (Nano/Micro)',
      subject: 'Collaboration with [Brand Name] x [Creator Name] — Loving your [Recent Post Topic]!',
      body: `Hi [Creator Name],

I’ve been following your page for a while, especially loved your recent breakdown on [mention a specific video or photo they created].

I’m [Your Name], founder of [Brand Name]. We craft [1-sentence unique value proposition, e.g. clean organic almond butter with zero palm oil or refined sugar].

Given your community’s focus on [creator's niche, e.g. mindful wellness], we’d love to send you our signature [Product Name] gift box with absolutely no strings attached.

If you love it as much as we think you will, we’d be thrilled to discuss a partnered reel or sponsored story sequence for our upcoming seasonal drop.

Can I confirm your preferred shipping address?

Warm regards,
[Your Name]
Founder, [Brand Name]
[Instagram / Website Link]`,
    },
    {
      title: 'Formal Brand-to-Brand Co-Marketing Proposal',
      subject: 'Joint Campaign Proposal: [Brand A] x [Brand B] — Audience Synergy',
      body: `Hi [Founder / Marketing Head Name],

I love the mission you've built at [Partner Brand], particularly your commitment to [Shared Value, e.g. sustainable eco-packaging].

I'm [Your Name], founder of [Your Brand]. Our customers match your exact profile: [Target Persona, e.g. working young professionals aged 24-35 in metropolitan cities].

We're planning a Spring Giveaway & Collaborative Bundle titled "[Theme Name]", where we cross-promote a curated kit featuring [Your Hero Product] and [Their Hero Product] to our combined 40,000 email subscribers and social communities.

We will sponsor all promotional creative design, logistics, and packing.

Would you be open to a 10-minute coffee chat next Tuesday at 3 PM to explore this?

Best,
[Your Name]
Founder, [Your Brand]`,
    },
  ];

  // Rate card estimates
  const rates: Record<string, Record<string, string>> = {
    nano: {
      story: '₹500 – ₹1,500 (or free product barter)',
      reel: '₹2,000 – ₹5,000',
      bundle: '₹3,500 – ₹7,000',
    },
    micro: {
      story: '₹1,500 – ₹4,000',
      reel: '₹6,000 – ₹18,000',
      bundle: '₹10,000 – ₹25,000',
    },
    mid: {
      story: '₹5,000 – ₹12,000',
      reel: '₹25,000 – ₹60,000',
      bundle: '₹40,000 – ₹80,000',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-indigo-950">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Brand Partnerships & Creator Outreach
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Influencer Marketing & Brand Collaborations
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Stop wasting budgets on celebrity ads with low conversions. Partner with authentic
            nano and micro creators using proven pitch scripts, fair rate cards, and ASCI disclosures.
          </p>
        </div>
      </div>

      {/* Copyable Outreach Email Scripts */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            One-Click Templates
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            Ready-to-Use Outreach Proposals
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{tmpl.title}</h3>
                  <button
                    onClick={() => copyToClipboard(tmpl.body, idx)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-2">
                  <strong>Subject:</strong> {tmpl.subject}
                </p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line mt-3 leading-relaxed max-h-72 overflow-y-auto">
                  {tmpl.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Influencer Rate Card Estimator */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Compensation Estimator</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-1">
              Indian Creator Fee Benchmark (ASCI Compliant)
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Fair market compensation ranges for authentic creators in Tier 1 and Tier 2 cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Creator Tier (Follower Count)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'nano', label: 'Nano (1k - 10k)' },
                  { key: 'micro', label: 'Micro (10k - 50k)' },
                  { key: 'mid', label: 'Mid (50k - 200k)' },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => setFollowerTier(tier.key as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                      followerTier === tier.key
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-800 dark:bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Deliverable Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'story', label: 'Instagram Story (2x)' },
                  { key: 'reel', label: 'Dedicated 60s Reel' },
                  { key: 'bundle', label: 'Reel + 3 Stories' },
                ].map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDeliverableType(d.key as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                      deliverableType === d.key
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-800 dark:bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800 dark:bg-slate-900/80 border border-slate-700 dark:border-slate-800 space-y-4">
            <span className="text-xs text-slate-400">Estimated Fair Market Fee</span>
            <p className="text-3xl font-black font-display text-indigo-300">
              {rates[followerTier][deliverableType]}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              💡 <strong>Negotiation Tip:</strong> Nano-creators (under 10k) usually welcome free
              product barter if your gift packaging is gorgeous and high quality. Micro-creators
              value long-term affiliate commission codes (10%-15% recurring on tracked sales).
            </p>
          </div>
        </div>
      </section>

      {/* ASCI Legal Advertising Disclosures */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-lg font-display text-slate-900 dark:text-white">
            Advertising Standards Council of India (ASCI) Disclosure Rules
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Both the brand and creator are legally responsible for transparency under Consumer
          Protection (E-Commerce) Rules and ASCI guidelines:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
            <span>
              <strong>First 2 Lines:</strong> The disclosure hashtag (#Ad, #Collab, #Sponsored) must
              appear in the first 2 lines of the caption before the "more" button.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
            <span>
              <strong>Video Overlay:</strong> For video reels, an overlay tag must be visible for at least 5 seconds or throughout the entire demonstration.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
            <span>
              <strong>Free Gifting:</strong> Even if no cash changed hands, products provided free for review must be labeled <strong>#Gifted</strong> or <strong>#FreeProduct</strong>.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
};
