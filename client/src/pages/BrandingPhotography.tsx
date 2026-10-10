import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Play,
} from 'lucide-react';

export const BrandingPhotography: React.FC = () => {
  // Interactive Lighting Simulator Setup
  const [lightingSetup, setLightingSetup] = useState<'window' | 'twoway' | 'backlit'>('window');

  const lightingScenarios = {
    window: {
      name: 'North Window + Foam Core Reflector (₹80 Budget)',
      shadows: 'Soft, natural diffuse shadows with creamy falloff',
      bestFor: 'Handmade soaps, artisanal bakery items, ceramics, scented candles',
      diagram: 'Window (Left) ──> [ Product on Table ] <── White Foam Board (Right)',
      tip: 'Shoot within 3 feet of the window between 9 AM and 11 AM when light is non-directional.',
    },
    twoway: {
      name: '45-Degree Side-Fill Setup (Crisp Commercial)',
      shadows: 'Subtle definition with clear dimensional texture',
      bestFor: 'Jewelry, skincare bottles, leather goods, textured textiles',
      diagram: 'Key Light (45° Left) ──> [ Product ] <── Fill Light / Reflector (45° Right)',
      tip: 'Keep the key light 1 stop brighter than the fill to preserve tactile shadow depth.',
    },
    backlit: {
      name: 'Backlit Glamour Setup (Beverages & Steam)',
      shadows: 'Dramatic rim lighting highlighting transparency and edges',
      bestFor: 'Cocktails, hot coffee cups, clear glass cosmetics, golden pastries',
      diagram: '[ Product ] <── Backlight (Rear) | Front Reflector bounces glow into face',
      tip: 'Shield the phone camera lens with your hand or cardboard flag to prevent lens flare.',
    },
  };

  const current = lightingScenarios[lightingSetup];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 dark:from-amber-950 dark:via-orange-950 dark:to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-amber-950">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Visual Identity & Commercial Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Branding & Smartphone Photography Academy
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Your online photo is your product. Master commercial visual aesthetics, lighting
            diagrams, brand psychology, and smartphone catalog shoots on an everyday budget.
          </p>
        </div>
      </div>

      {/* Interactive DIY Lighting Studio Simulator */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Interactive Studio Simulator
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
              Low-Budget Lighting Setup Architect
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {(['window', 'twoway', 'backlit'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setLightingSetup(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  lightingSetup === mode
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mode === 'window' ? 'Window Light' : mode === 'twoway' ? 'Dual Fill' : 'Backlit Glow'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Schematic visual box */}
          <div className="p-6 rounded-2xl bg-slate-900 text-amber-300 font-mono text-xs sm:text-sm space-y-4 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
              <span>Studio Schematic Diagram</span>
              <span className="text-emerald-400">● Active Setup</span>
            </div>
            <div className="py-6 text-center text-slate-100 font-semibold tracking-wide">
              {current.diagram}
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 text-slate-300 text-xs">
              <span className="font-bold text-amber-400">Shadow Characteristics: </span>
              {current.shadows}
            </div>
          </div>

          {/* Practical Application Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{current.name}</h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Best For: </strong> {current.bestFor}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Pro Secret: </strong> {current.tip}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              💡 <strong>The ₹80 Foam Core Secret:</strong> Avoid expensive softbox lights. A simple
              white polystyrene board propped with books reflects 85% of ambient light into shadows!
            </div>
          </div>
        </div>
      </section>

      {/* 4 Non-Negotiable Smartphone Camera Rules */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Hardware Optimization
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            Smartphone Camera Mastery Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Always Wipe the Lens</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              50% of washed-out mobile photos are caused by fingerprint grease. Use a microfiber cloth.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Step Back & Use 2x/3x</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The default 1x lens warps product shapes. Stepping back 3 feet with optical zoom eliminates distortion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Lock Focus & Lower Exposure</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tap & hold on the product (AE/AF lock), then drag exposure slider down 15% to preserve highlights.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">45° Dining Table Angle</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Match natural human perspective for food & drinks. Use 90° flat lay only for apparel or beauty sets.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Identity & Strategy Curriculum */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6 transition-colors">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Brand Psychology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Building An Unforgettable Brand Identity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-sm text-white">Color Palette Psychology</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Limit your brand to 1 primary color, 1 neutral, and 1 high-contrast accent. Avoid
              using more than 3 colors across your website, packaging, and social grids.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-sm text-white">Typography Hierarchy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pair a distinct personality display font (e.g. Outfit or Playfair) for headlines with
              an ultra-legible geometric sans (e.g. Inter) for descriptions and pricing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-sm text-white">Packaging & Unboxing Experience</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Include custom parchment wrap, a brand sticker, and a handwritten postcard. Unboxing
              is the primary catalyst for organic customer Instagram story tags!
            </p>
          </div>
        </div>
      </section>

      {/* Video Tutorial CTA */}
      <div className="text-center space-y-3 pt-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
          Ready to watch the live studio breakdown?
        </h3>
        <Link
          to="/videos/smartphone-product-photography-budget-lighting"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Watch Smartphone Studio Video Tutorial</span>
        </Link>
      </div>
    </div>
  );
};
