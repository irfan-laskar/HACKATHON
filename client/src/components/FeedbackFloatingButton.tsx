import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareHeart, Sparkles } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

export const FeedbackFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-950/90 dark:bg-cream-100/90 text-cream-50 dark:text-forest-950 text-[11px] font-bold shadow-md backdrop-blur-xs pointer-events-none border border-forest-800 dark:border-cream-300"
            >
              <Sparkles className="w-3 h-3 text-lime-400 dark:text-[#790D16]" />
              <span>Share Feedback</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full bg-[#790D16] hover:bg-[#91111c] dark:bg-[#AEC4D4] dark:hover:bg-[#c6d9e7] text-white dark:text-[#220306] shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 dark:border-forest-900/20 cursor-pointer"
          aria-label="Give feedback"
        >
          <div className="relative">
            <MessageSquareHeart className="w-4 h-4 text-lime-300 dark:text-[#790D16] group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-400 dark:bg-[#790D16] animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-400 dark:bg-[#790D16]" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline text-white dark:text-[#220306]">
            Feedback
          </span>
        </motion.button>
      </div>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
