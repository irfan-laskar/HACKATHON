import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Info,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  UtensilsCrossed,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Why was Scaletrix built specifically for small restaurants in India?',
    a: 'More than 60% of new food businesses in India shut down within their first 18 months, not because their food tastes bad, but because they bleed cash on uncalculated plate costs, aggregator commission traps (22-26%), and poor cash flow separation. Scaletrix was created to provide realistic financial tools, diagnostic audits, and SOPs designed specifically for Indian operational realities.',
  },
  {
    q: 'Does Scaletrix promise or guarantee specific business results?',
    a: 'No. Scaletrix strictly adheres to honest mathematical modeling and unit economics best practices. We do not make fake claims of guaranteed revenues or instant overnight doubling of profits. Success in the restaurant business depends on rigorous daily kitchen discipline, portion control, recipe consistency, and customer service.',
  },
  {
    q: 'How accurate are the food-cost and menu-pricing formulas?',
    a: 'Our formulas are built on hospitality industry standard formulas calibrated for India: Food Cost % = (Raw Plate Cost / Selling Price) * 100. For delivery pricing, our model incorporates the exact non-ITC 5% GST structure, packaging overheads, and aggregator commission percentages to preserve your exact dine-in gross margin.',
  },
  {
    q: 'Can cloud kitchens and home chefs also use these tools?',
    a: 'Absolutely. The Problem Finder, Food-Cost Calculator, and Brand Brainstormer are engineered to support dedicated cloud kitchens, single-station kiosks, dhabas, regional cafes, and home bakers alike.',
  },
  {
    q: 'Are our financial numbers and assessment answers stored securely?',
    a: 'Your assessment responses and progress checklist states are stored locally on your own browser (localStorage) for your personal convenience. We do not sell or monetize your operational figures.',
  },
];

export const AboutContact: React.FC = () => {
  const { showToast } = useToast();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRestaurant, setFormRestaurant] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formTopic, setFormTopic] = useState('Unit Economics Audit');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      showToast('Please fill in your name, email, and message', 'warning');
      return;
    }

    setIsSubmitting(true);
    // Simulate API request to Express backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Thank you! Your message has been sent to our team.', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-forest-200 dark:border-forest-700">
            <Info className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            Our Mission & Commitment
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
            Protecting the Dreams of <br className="hidden sm:inline" />
            <span className="text-forest-700 dark:text-lime-400">Independent Restaurant Owners</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed">
            Scaletrix exists to ensure that small eateries, cloud kitchens, dhabas, and neighborhood cafes have access to the same financial rigor and unit economics clarity that large franchise chains take for granted.
          </p>
        </div>

        {/* Culinary Photographic Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-3xl overflow-hidden">
          <div className="md:col-span-7 relative h-72 sm:h-96 rounded-3xl overflow-hidden group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
              alt="Indian dining hospitality"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full bg-forest-950/80 backdrop-blur-md text-lime-400 text-xs font-bold uppercase tracking-wider mb-2 border border-lime-400/30">
                Hospitality & Community
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-cream-50 leading-snug">
                Where neighborhood culinary warmth meets resilient unit economics
              </h3>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-rows-2 gap-4">
            <div className="relative h-44 sm:h-[11.25rem] rounded-3xl overflow-hidden group shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=600&q=80"
                alt="Commercial kitchen chef craftsmanship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-bold text-lime-300 block">Kitchen Precision</span>
                <p className="text-xs text-cream-100 font-medium">Standardized gram portions & minimal prep waste</p>
              </div>
            </div>

            <div className="relative h-44 sm:h-[11.25rem] rounded-3xl overflow-hidden group shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
                alt="Authentic Indian spices and seasonings"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-bold text-lime-300 block">Mandi Sourcing & Seasonings</span>
                <p className="text-xs text-cream-100 font-medium">Direct mandi procurement saving 14% on wholesale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-forest-900 p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-400 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
              Indian Culinary Realism
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 leading-relaxed">
              We do not copy generic Western restaurant advice. Everything is tailored to Indian market dynamics: Swiggy/Zomato commission structures, flat 5% GST without ITC, mandi vegetable yield variations, and UPI cash flows.
            </p>
          </div>

          <div className="bg-white dark:bg-forest-900 p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
              No Fake Claims or Guarantees
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 leading-relaxed">
              We never promise overnight millions or fake business outcomes. We provide the hard mathematical truths about food cost %, gross margin, and daily break-even covers so owners can make informed, resilient decisions.
            </p>
          </div>

          <div className="bg-white dark:bg-forest-900 p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
              Empowering the Underdog
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 leading-relaxed">
              Small restaurant owners put their life savings and 16 hours of daily labor into their kitchens. Scaletrix is built to protect that sacrifice with actionable tools, clear checklists, and zero corporate fluff.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Support Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-display font-bold text-forest-950 dark:text-cream-50">
                  Connect With the Scaletrix Team
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 mt-1">
                  Have questions about your unit economics, want a customized kitchen audit, or wish to suggest a new tool? We are here to support you.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 dark:text-cream-50 block">Email Support</span>
                    <span className="text-slate-500 dark:text-cream-400">hello@scaletrix.in / support@scaletrix.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 dark:text-cream-50 block">WhatsApp Helplines</span>
                    <span className="text-slate-500 dark:text-cream-400">+91 98200 12345 (Mon - Sat, 10 AM - 7 PM IST)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 dark:text-cream-50 block">Culinary Hubs</span>
                    <span className="text-slate-500 dark:text-cream-400">Bengaluru • Pune • Delhi-NCR • Mumbai</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-850 text-xs text-slate-600 dark:text-cream-300">
                🔒 We respect your privacy. Your contact details are never shared with aggregator salespeople or external third parties.
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-forest-800 shadow-sm">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-forest-950 dark:text-cream-50">
                    Message Received!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-cream-300 max-w-md mx-auto">
                    Thank you for reaching out, <span className="font-bold text-forest-900 dark:text-cream-50">{formName}</span>. One of our restaurant growth advisors will review your inquiry and reply via email or WhatsApp within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormMessage('');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-xs hover:bg-forest-900 transition"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-display font-bold text-forest-950 dark:text-cream-50 mb-2">
                    Send Us a Direct Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-lime-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. rahul@kitchen.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-lime-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Restaurant / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formRestaurant}
                        onChange={(e) => setFormRestaurant(e.target.value)}
                        placeholder="e.g. The Spice Table"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-lime-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        City & State
                      </label>
                      <input
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-lime-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                      Topic of Discussion
                    </label>
                    <select
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-lime-500"
                    >
                      <option value="Unit Economics Audit">Request a Unit Economics Audit</option>
                      <option value="Recipe & Portioning Assistance">Recipe & Portioning Standardization</option>
                      <option value="Direct Ordering Strategy">Direct Delivery & WhatsApp Ordering Setup</option>
                      <option value="Partnership & Mentorship">Advisory / Mentorship Consultation</option>
                      <option value="General Feedback">Feedback or Suggest a Tool</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                      Message / Challenges You Are Facing *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Share details about your seating capacity, food cost challenges, aggregator cuts, or current monthly turnover..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-lime-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-sm hover:bg-forest-900 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-8 border-t border-cream-200 dark:border-forest-800 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-display font-bold text-forest-950 dark:text-cream-50">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-cream-400 mt-1">
              Common questions about our methodology, data privacy, and tools.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-forest-900 rounded-2xl border border-cream-200 dark:border-forest-800 overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-forest-950 dark:text-cream-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-cream-300 leading-relaxed border-t border-cream-100 dark:border-forest-850 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
