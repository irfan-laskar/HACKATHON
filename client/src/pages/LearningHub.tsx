import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle2,
  Download,
  Copy,
  Check,
  FileText,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LEARNING_ARTICLES, LearningArticle } from '../data/restaurantData';
import { useToast } from '../context/ToastContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

interface OperationalTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

const TEMPLATES: OperationalTemplate[] = [
  {
    id: 'tmpl-kitchen-opening',
    title: 'Daily Kitchen Opening & Food Safety Checklist',
    category: 'Operations & Hygiene',
    description: 'Mandatory 15-minute morning audit for head cook and shift supervisor before gas stoves are lit.',
    content: `SCALETRIX OPERATIONAL TEMPLATE: Daily Kitchen Opening Checklist
Date: [   /   / 202X ] | Shift Supervisor: [ ____________ ]

1. REFRIGERATION & COLD STORAGE AUDIT:
[ ] Walk-in / Deep Freezer temperature checked (Target: -18°C or colder).
[ ] Reach-in dairy chiller temperature checked (Target: 2°C to 4°C).
[ ] All marinating proteins and gravies date-labeled and covered with lids.
[ ] First-In, First-Out (FIFO) verified: older batches positioned at the front.

2. HYGIENE & PEST INTEGRITY:
[ ] All food contact prep tables sanitized with food-grade sanitizing solution.
[ ] Insect fly-catcher light tubes powered on and clean.
[ ] Handwashing sinks equipped with antibacterial soap and paper towels.
[ ] Cooks and helpers wearing clean aprons, hair nets, and cut-resistant gloves.

3. PREPARATION & PORTION SCALES:
[ ] 2 digital kitchen scales calibrated and set to 0.00g tare.
[ ] Standard portion ladles (60ml, 120ml, 240ml) arranged at sauce stations.
[ ] LPG pipeline pressure verified, cylinder valves inspected for zero leakage.`,
  },
  {
    id: 'tmpl-waste-log',
    title: 'Weekly Raw Ingredient Spoilage & Waste Log',
    category: 'Cost Control',
    description: 'Track daily burnt, spilled, and expired ingredients in rupee value to stop back-door shrinkage.',
    content: `SCALETRIX OPERATIONAL TEMPLATE: Weekly Food Waste & Spoilage Log
Week Ending: [   /   / 202X ] | Outlet Name: [ ____________ ]

| Date | Item Name | Quantity Lost | Unit Cost (₹) | Total Rupee Loss | Reason (Burnt / Soured / Over-prepped) | Cook Signature |
|---|---|---|---|---|---|---|
| Mon | Malai Paneer | 1.2 kg | ₹380/kg | ₹456 | Chiller power trip overnight | ________ |
| Tue | Onion Gravy | 3.0 L | ₹75/L | ₹225 | Soured; held past 48h limit | ________ |
| Wed | Tandoori Naan dough | 1.5 kg | ₹60/kg | ₹90 | Over-fermented in summer heat | ________ |
| Thu | Boneless Chicken | 0.8 kg | ₹260/kg | ₹208 | Dropped on floor during rush | ________ |
| Fri | Milk / Dairy | 2.0 L | ₹66/L | ₹132 | Curdled during boiling | ________ |

TOTAL WEEKLY FOOD LOSS: ₹ 1,111
ACTION: Adjust gravy prep batches from 4 days down to 2 days.`,
  },
  {
    id: 'tmpl-recipe-card',
    title: 'Standard Recipe Specification Sheet (Recipe Card)',
    category: 'Standardization',
    description: 'Laminated card placed at kitchen prep line to ensure identical taste and portion size regardless of who is cooking.',
    content: `SCALETRIX OPERATIONAL TEMPLATE: Recipe Specification Card
Dish Name: Butter Chicken (Single Serving) | Category: Non-Veg Curry
Target Food Cost: 30% | Current Selling Price: ₹ 320

INGREDIENT BREAKDOWN:
- Tandoori Chicken Tikka (pre-roasted, 80% yield): 180 grams (Cost: ₹48)
- Tomato-Makhani Base Gravy: 220 ml (Cost: ₹24)
- Amul Butter: 25 grams (Cost: ₹14)
- Fresh Dairy Cream: 25 ml (Cost: ₹10)
- Ginger-Garlic & Kasuri Methi Paste: 15 grams (Cost: ₹4)
TOTAL RAW PLATE COST: ₹ 100.00 (Food Cost %: 31.25%)

PORTIONING & PRESENTATION RULES:
1. Always weigh chicken on digital scale before dropping into kadai.
2. Simmer for precisely 4 minutes on medium flame.
3. Serve in 400ml copper handi garnished with 1 swirl of cream and ginger julienne.
4. If serving delivery, use 450ml tamper-evident container with heat seal.`,
  },
  {
    id: 'tmpl-cash-reconciliation',
    title: 'Staff End-of-Day Tender & Cash Reconciliation Sheet',
    category: 'Cash Flow',
    description: 'Four-way reconciliation comparing POS billed totals against drawer cash, UPI settlements, and cards.',
    content: `SCALETRIX OPERATIONAL TEMPLATE: Daily Shift-End Cash Reconciliation
Date: [   /   / 202X ] | Cashier Name: [ ____________ ] | Manager: [ ____________ ]

POS SYSTEM TOTALS (Z-Report):
1. Total Billed Sales: ₹ _________
2. Total Customer Discounts Given: ₹ _________
3. Total Voided / Canceled Bills: ₹ _________ (Reason slips attached)

PAYMENT TENDER RECONCILIATION:
A. Physical Cash in Register Drawer: ₹ _________
   - Minus Opening Cash Float: -₹ 2,000
   = Net Cash Collected: ₹ _________
B. UPI Direct Bank Settlement (Paytm/PhonePe/GPay): ₹ _________
C. Card POS Machine Settlement Slip: ₹ _________
D. Delivery Aggregator Net Payout Slips (Swiggy/Zomato): ₹ _________

TOTAL RECONCILED TENDERS (A + B + C + D): ₹ _________
VARIANCE (POS Sales vs Reconciled Tenders): ₹ _________ (Acceptable: < ₹50)
Cashier Signature: __________________ | Manager Approval: __________________`,
  },
];

export const LearningHub: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [readingArticle, setReadingArticle] = useState<LearningArticle | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  const categories = useMemo(() => {
    return ['All', 'Legal & Compliance', 'Unit Economics', 'Operational SOPs', 'Case Studies'];
  }, []);

  const filteredArticles = useMemo(() => {
    return LEARNING_ARTICLES.filter((art) => {
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Case Studies' && !art.title.toLowerCase().includes('case study')) {
          return false;
        }
        if (selectedCategory !== 'Case Studies' && art.category !== selectedCategory) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const copyTemplate = (tmpl: OperationalTemplate) => {
    navigator.clipboard.writeText(tmpl.content);
    setCopiedTemplateId(tmpl.id);
    showToast(`Copied "${tmpl.title}" template to clipboard!`, 'success');
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-forest-200 dark:border-forest-700">
            <BookOpen className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            Educational Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
            Small Restaurant <br className="hidden sm:inline" />
            <span className="text-forest-700 dark:text-lime-400">Playbooks, Templates & Case Studies</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed">
            Curated guides on FSSAI licenses, 5% GST rules, cloud kitchen unit economics, and copyable kitchen operational checklists.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-md rounded-2xl p-5 border border-cream-200 dark:border-forest-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cream-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by FSSAI, GST, cloud kitchen, food waste, recipes..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-medium focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-500 dark:text-forest-950 shadow-xs'
                    : 'bg-cream-100 dark:bg-forest-800/60 text-slate-700 dark:text-cream-200 hover:bg-cream-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Educational Articles & Deep Dives */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-forest-950 dark:text-cream-50">
              Featured Restaurant Playbooks
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-cream-400">
              {filteredArticles.length} Articles available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white dark:bg-forest-900 rounded-3xl border border-cream-200 dark:border-forest-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest-950/80 text-lime-300 backdrop-blur-md">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTime}</span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-lime-400 transition leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setReadingArticle(art)}
                    className="w-full py-2.5 rounded-xl bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-forest-900 transition cursor-pointer shadow-2xs"
                  >
                    Read Playbook <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Downloadable / Copyable Operational Checklists & Templates */}
        <div className="space-y-6 pt-8 border-t border-cream-200 dark:border-forest-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-forest-950 dark:text-cream-50">
                Ready-to-Use Operational Checklists & SOP Templates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-cream-400 mt-1">
                Click any template to copy formatted checklist text for your clipboard, WhatsApp group, or print station.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-cream-200 dark:border-forest-800 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-extrabold uppercase tracking-wider text-forest-800 dark:text-lime-300 px-2 py-0.5 rounded bg-forest-100 dark:bg-forest-800">
                      {tmpl.category}
                    </span>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>

                  <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-300 mt-1 leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-cream-50 dark:bg-forest-950 font-mono text-[11px] text-slate-600 dark:text-cream-300 max-h-32 overflow-y-auto whitespace-pre-wrap border border-cream-200 dark:border-forest-850">
                    {tmpl.content.slice(0, 240)}...
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyTemplate(tmpl)}
                  className="w-full py-2.5 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 font-bold text-xs sm:text-sm hover:bg-cream-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedTemplateId === tmpl.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> Copied Full Template!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" /> Copy Complete SOP Checklist
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Full Article Reading Drawer / Popup */}
        {readingArticle && (
          <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white dark:bg-forest-900 w-full max-w-3xl rounded-3xl p-6 sm:p-10 border border-cream-200 dark:border-forest-800 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
              
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-cream-100 dark:bg-forest-800 hover:bg-cream-200 text-slate-600 dark:text-cream-300 transition"
                aria-label="Close article modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300">
                    {readingArticle.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-forest-950 dark:text-cream-50 mt-3 leading-snug">
                    {readingArticle.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-cream-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingArticle.readTime}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <MarkdownRenderer content={readingArticle.content} showOutline={false} />
                </div>

                {readingArticle.keyTakeaways && (
                  <div className="p-5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 space-y-2.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-forest-800 dark:text-lime-300 block">
                      Executive Takeaways
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-cream-300">
                      {readingArticle.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setReadingArticle(null)}
                    className="px-6 py-2.5 rounded-xl bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-xs sm:text-sm hover:bg-forest-900 transition"
                  >
                    Done Reading
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
