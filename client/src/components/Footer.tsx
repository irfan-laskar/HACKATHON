import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, BookOpen, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 dark:border-slate-900 pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 dark:border-slate-900">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-extrabold text-white tracking-tight">
                Market<span className="text-sky-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier open educational knowledge hub and creator video platform for marketing,
              commercial photography, GST, legal compliance, and bootstrapped business growth.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Verified Educational Resources
              </span>
            </div>
          </div>

          {/* Column 1: Marketing Hub */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Marketing Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/knowledge-hub" className="hover:text-white transition">
                  4Ps & 7Ps Framework
                </Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-white transition">
                  STP & Buyer Personas
                </Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-white transition">
                  SEO & Keyword Research
                </Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-white transition">
                  WhatsApp Funnels
                </Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-white transition">
                  Organic vs Paid Ads
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Business Academy */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Startup Academy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/startup-academy" className="hover:text-white transition">
                  12-Step Business Roadmap
                </Link>
              </li>
              <li>
                <Link to="/startup-academy" className="hover:text-white transition">
                  Home Bakery & Food Setup
                </Link>
              </li>
              <li>
                <Link to="/startup-academy" className="hover:text-white transition">
                  Google Maps Local SEO
                </Link>
              </li>
              <li>
                <Link to="/legal-compliance" className="hover:text-white transition">
                  Udyam MSME Registration
                </Link>
              </li>
              <li>
                <Link to="/legal-compliance" className="hover:text-white transition">
                  GST Invoicing Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Visuals & Creator */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Creators & Visuals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/branding-photography" className="hover:text-white transition">
                  Smartphone Photography
                </Link>
              </li>
              <li>
                <Link to="/branding-photography" className="hover:text-white transition">
                  DIY Lighting Setups
                </Link>
              </li>
              <li>
                <Link to="/influencer-collab" className="hover:text-white transition">
                  Influencer Pitch Scripts
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-white transition">
                  Educational Videos
                </Link>
              </li>
              <li>
                <Link to="/creator/dashboard" className="hover:text-white transition">
                  Creator Studio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Educational Compliance Disclaimer
          </p>
          The regulatory, tax, and legal guides provided on MarketSphere (including GST, Udyam MSME, and
          business structures) are prepared strictly for educational purposes. Regulatory thresholds and
          statutory provisions change periodically. Always verify with official portals (e.g. gst.gov.in,
          udyamregistration.gov.in) and consult a practicing Chartered Accountant or legal counsel before
          executing formal transactions.
        </div>

        {/* Copyright bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MarketSphere Platform. Designed for modern entrepreneurs.</p>
          <div className="flex items-center gap-6">
            <Link to="/knowledge-hub" className="hover:text-slate-300 transition">
              Knowledge Hub
            </Link>
            <Link to="/videos" className="hover:text-slate-300 transition">
              Watch Videos
            </Link>
            <Link to="/legal-compliance" className="hover:text-slate-300 transition">
              Legal Guides
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
