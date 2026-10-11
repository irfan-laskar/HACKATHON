import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Sparkles,
  Send,
  MessageSquareHeart,
  Lightbulb,
  Calculator,
  Bug,
  BookOpen,
  MessageCircle,
  Building2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted?: () => void;
}

const CATEGORIES = [
  { id: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  { id: 'tool_suggestion', label: 'Tool Improvement', icon: Calculator, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
  { id: 'user_experience', label: 'Praise & Experience', icon: MessageSquareHeart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  { id: 'content_idea', label: 'SOP / Learning Topic', icon: BookOpen, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  { id: 'bug_report', label: 'Bug / Issue', icon: Bug, color: 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800' },
  { id: 'general', label: 'General Thoughts', icon: MessageCircle, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' },
];

const RATING_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: 'Needs Significant Work', emoji: '😕' },
  2: { text: 'Fair, Has Potential', emoji: '🙂' },
  3: { text: 'Good & Helpful', emoji: '😊' },
  4: { text: 'Very Good & Impactful', emoji: '😃' },
  5: { text: 'Outstanding / Game Changer!', emoji: '🚀' },
};

const SUGGESTED_TAGS = [
  'Food Costing',
  'Menu Pricing',
  'Profit Tracker',
  'Growth Plan',
  'Direct Ordering',
  'Cloud Kitchen',
  'Packaging Costs',
  'FSSAI & GST',
  'Mobile UI',
  'Excel Export',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onFeedbackSubmitted,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('feature_request');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [restaurantName, setRestaurantName] = useState('');
  const [businessType, setBusinessType] = useState('Casual Dine-in');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      showToast('Please provide both a title and details for your feedback.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: isAnonymous ? 'Anonymous Restaurateur' : name.trim() || user?.name || 'Anonymous Restaurateur',
        email: isAnonymous ? '' : email.trim() || user?.email || '',
        restaurantName: restaurantName.trim(),
        businessType,
        category,
        rating,
        title: title.trim(),
        message: message.trim(),
        tags: selectedTags,
        isPublic: true,
      };

      const res = await api.post('/feedback', payload);

      if (res.data.success) {
        setIsSuccess(true);
        showToast('Thank you! Your feedback has been received.', 'success');
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          // reset form fields
          setTitle('');
          setMessage('');
          setSelectedTags([]);
        }, 1800);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit feedback.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-forest-950/75 dark:bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#F5EFE1] dark:bg-[#220306] rounded-2xl shadow-2xl border border-cream-200 dark:border-forest-800 overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-cream-200/80 dark:border-forest-800/80 flex items-center justify-between bg-white/40 dark:bg-forest-900/40 backdrop-blur-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#790D16] text-[#F5EFE1] dark:bg-[#AEC4D4] dark:text-[#220306] flex items-center justify-center shadow-xs">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-display font-black text-forest-950 dark:text-cream-50 leading-tight">
                  Share Your Feedback
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-cream-300">
                  Help us empower independent restaurant owners across India
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-cream-100 dark:bg-forest-900 hover:bg-cream-200 dark:hover:bg-forest-800 text-slate-500 dark:text-cream-300 flex items-center justify-center transition cursor-pointer"
              aria-label="Close feedback modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-forest-950 dark:text-cream-50 flex-1">
            {isSuccess ? (
              <div className="py-10 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                  Feedback Received!
                </h3>
                <p className="text-xs text-slate-600 dark:text-cream-300 max-w-sm mx-auto">
                  Thank you for taking the time to guide our roadmap. Your suggestion will help hundreds of food entrepreneurs build sustainable, profitable kitchens!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* 1. Rating Selector */}
                <div className="bg-white/70 dark:bg-forest-900/70 p-3 rounded-xl border border-cream-200 dark:border-forest-800 text-center space-y-1 shadow-2xs">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-cream-300">
                    How has your experience with Scaletrix been?
                  </span>

                  <div className="flex items-center justify-center gap-1 pt-0.5">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = starVal <= activeRating;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                          aria-label={`Rate ${starVal} out of 5 stars`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                : 'text-slate-300 dark:text-forest-700'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs font-bold text-forest-900 dark:text-cream-100 flex items-center justify-center gap-1.5 min-h-[1.1rem]">
                    <span>{RATING_LABELS[activeRating]?.emoji}</span>
                    <span>{RATING_LABELS[activeRating]?.text}</span>
                  </div>
                </div>

                {/* 2. Category selection chips */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-cream-300 mb-1.5">
                    Feedback Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-[#790D16] text-[#F5EFE1] border-[#790D16] dark:bg-[#AEC4D4] dark:text-[#220306] dark:border-[#AEC4D4] shadow-xs font-bold'
                              : 'bg-white/80 dark:bg-forest-900/80 text-slate-700 dark:text-cream-200 border-cream-200 dark:border-forest-700 hover:bg-white dark:hover:bg-forest-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate text-xs">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Feedback Title */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-cream-300 mb-1">
                    Feedback Summary / Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Add multi-portion batch scaling to Food Cost tool"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs font-semibold focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden shadow-2xs"
                  />
                </div>

                {/* 4. Feedback Message */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-cream-300">
                      Detailed Suggestion or Experience *
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-cream-400">
                      {message.length}/2000
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share specific details, pain points in your kitchen operations, or how this feature would help you save money..."
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-xs font-medium focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden shadow-2xs leading-relaxed"
                  />
                </div>

                {/* 5. Quick Tags */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-cream-300 mb-1">
                    Add Topic Tags (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#790D16] text-[#F5EFE1] dark:bg-[#AEC4D4] dark:text-[#220306] font-bold'
                              : 'bg-white/80 dark:bg-forest-900 text-slate-600 dark:text-cream-300 border border-cream-200 dark:border-forest-700 hover:bg-cream-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Restaurant & Business Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-cream-300 mb-1">
                      Kitchen / Brand Name (Optional)
                    </label>
                    <div className="relative">
                      <Building2 className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="e.g. Royal Chai & Kebabs"
                        className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-white dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs text-forest-950 dark:text-cream-50 font-medium focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-cream-300 mb-1">
                      Business Model
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs text-forest-950 dark:text-cream-50 font-semibold focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden"
                    >
                      <option value="Cloud Kitchen">Cloud Kitchen / Delivery-only</option>
                      <option value="Cafe / Bistro">Cafe / Bistro</option>
                      <option value="Casual Dine-in">Casual Dine-in Restaurant</option>
                      <option value="Fine Dine">Fine Dining</option>
                      <option value="Bakery / Dessert">Bakery / Dessert Shop</option>
                      <option value="QSR / Street Food">QSR / Fast Food / Kiosk</option>
                      <option value="Dhaba / Regional Eatery">Dhaba / Regional Eatery</option>
                      <option value="Aspiring Food Entrepreneur">Aspiring Food Founder</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* 7. Contact Info & Anonymous Toggle */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#790D16] focus:ring-[#790D16] dark:text-[#AEC4D4] border-cream-300 dark:border-forest-700 cursor-pointer"
                    />
                    <label htmlFor="anonCheck" className="text-[11px] font-medium text-slate-600 dark:text-cream-300 cursor-pointer">
                      Post feedback anonymously (hide personal name on community board)
                    </label>
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name (Optional)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs text-forest-950 dark:text-cream-50 font-medium focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email (for roadmap updates)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs text-forest-950 dark:text-cream-50 font-medium focus:ring-2 focus:ring-[#790D16] dark:focus:ring-[#AEC4D4] outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#790D16] hover:bg-[#91111c] text-white dark:bg-[#AEC4D4] dark:hover:bg-[#c3d8e7] dark:text-[#220306] font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Valuable Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Link to Dedicated Feedback Page */}
          <div className="px-5 py-2.5 bg-cream-100/70 dark:bg-forest-900/60 border-t border-cream-200/80 dark:border-forest-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-cream-300 shrink-0">
            <span>Want to see what others are requesting?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/feedback');
              }}
              className="font-bold text-[#790D16] dark:text-[#AEC4D4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Feedback Wall</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
