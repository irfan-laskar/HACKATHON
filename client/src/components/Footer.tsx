import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Shield,
  Heart,
  Calculator,
  Compass,
  AlertTriangle,
  Lightbulb,
  CalendarCheck2,
  BookOpen,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-200 border-t border-forest-900 pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-900">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-lime-400 shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-black text-cream-50 tracking-tight">
                Scale<span className="text-lime-400">trix</span>
              </span>
            </Link>
            <p className="text-sm text-cream-300 max-w-sm leading-relaxed">
              Empowering independent restaurant owners, cloud kitchens, and food entrepreneurs across
              India to calculate real food costs, escape delivery commission traps, and build durable,
              profitable culinary businesses.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-lime-300 border border-forest-800">
                <Shield className="w-3.5 h-3.5 text-lime-400" />
                Zero Fluff • Real Unit Economics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-cream-300 border border-forest-800">
                ₹ INR Indian F&B Benchmarks
              </span>
            </div>
          </div>

          {/* Quick Pillars */}
          <div>
            <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-4">
              Diagnostic & Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/problem-finder" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-lime-400" />
                  Problem Finder
                </Link>
              </li>
              <li>
                <Link to="/tools?tab=food-cost" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-lime-400" />
                  Food-Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools?tab=menu-pricing" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-lime-400" />
                  Menu Pricing Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools?tab=profit-tracker" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-lime-400" />
                  Monthly Profit Tracker
                </Link>
              </li>
              <li>
                <Link to="/tools?tab=inventory" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-lime-400" />
                  Pantry Inventory Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Frameworks */}
          <div>
            <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-4">
              Solutions & Strategy
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/problems" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  18 Problem Library
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-lime-400" />
                  Practical Guides
                </Link>
              </li>
              <li>
                <Link to="/growth-planner" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <CalendarCheck2 className="w-3.5 h-3.5 text-lime-400" />
                  6-Month Action Plan
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-lime-400" />
                  Restaurant Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge & Mission */}
          <div>
            <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-4">
              Learning & About
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/learning-hub" className="hover:text-cream-50 transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-lime-400" />
                  FSSAI & GST Playbook
                </Link>
              </li>
              <li>
                <Link to="/learning-hub" className="hover:text-cream-50 transition">
                  Cloud Kitchen Unit Economics
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cream-50 transition">
                  Our Mission for Indian F&B
                </Link>
              </li>
              <li>
                <Link to="/about#contact" className="hover:text-cream-50 transition">
                  Contact & Mentorship
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="my-8 p-4 rounded-2xl bg-forest-900/60 border border-forest-800 text-xs text-cream-300/90 leading-relaxed">
          <p className="font-semibold text-lime-300 mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-lime-400" />
            Transparent Educational Disclaimer
          </p>
          Scaletrix is an independent educational and strategic modeling platform. We do not make guaranteed
          income promises, fake testimonial claims, or commercial aggregator promotions. Profit improvements depend
          strictly upon execution of kitchen SOPs, menu discipline, and localized neighborhood demand. Always verify
          statutory food safety (FSSAI) and taxation (GST) compliance with licensed professionals.
        </div>

        {/* Copyright bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {new Date().getFullYear()} Scaletrix Platform. Crafted for India's independent restaurant pioneers.</p>
          <div className="flex items-center gap-2">
            <span>Built with precision</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for restaurant entrepreneurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
