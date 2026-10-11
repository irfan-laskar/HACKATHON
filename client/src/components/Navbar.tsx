import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  AlertTriangle,
  Lightbulb,
  Calculator,
  Compass,
  CalendarCheck2,
  LayoutDashboard,
  BookOpen,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  MessageSquareHeart,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: UtensilsCrossed },
    { name: 'Problems', path: '/problems', icon: AlertTriangle },
    { name: 'Solutions', path: '/solutions', icon: Lightbulb },
    { name: 'Problem Finder', path: '/problem-finder', icon: Compass, badge: 'Assess' },
    { name: 'Business Tools', path: '/tools', icon: Calculator },
    { name: 'Growth Planner', path: '/growth-planner', icon: CalendarCheck2 },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learning Hub', path: '/learning-hub', icon: BookOpen },
    { name: 'Feedback', path: '/feedback', icon: MessageSquareHeart },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-50/95 dark:bg-forest-950/95 backdrop-blur-md border-b border-cream-200/80 dark:border-forest-800/80 transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-forest-800 via-forest-700 to-forest-600 dark:from-forest-700 dark:to-lime-600 flex items-center justify-center text-lime-400 shadow-md shadow-forest-900/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400 dark:text-cream-50" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-display font-black tracking-tight text-forest-950 dark:text-cream-50 flex items-center gap-1">
                  Scale<span className="text-[#790D16] dark:text-[#AEC4D4]">trix</span>
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#790D16] dark:text-[#AEC4D4] -mt-1 hidden sm:block">
                  Restaurant Growth OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition relative whitespace-nowrap ${
                      active
                        ? 'text-forest-900 dark:text-lime-300 bg-forest-100/70 dark:bg-forest-800/60 shadow-xs'
                        : 'text-slate-700 dark:text-cream-200 hover:text-forest-900 dark:hover:text-cream-50 hover:bg-cream-100/80 dark:hover:bg-forest-900/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-forest-700 dark:text-lime-400' : 'text-slate-400 dark:text-cream-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="ml-0.5 text-[8px] font-black uppercase tracking-wider px-1 py-0.2 rounded-full bg-[#AEC4D4] text-[#220306] dark:bg-[#AEC4D4]/30 dark:text-[#AEC4D4]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cream-100 dark:bg-forest-900 hover:bg-cream-200 dark:hover:bg-forest-800 text-forest-800 dark:text-lime-300 flex items-center justify-center transition border border-cream-200 dark:border-forest-700 cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-forest-700" />}
              </button>

              {/* Primary Assessment CTA */}
              <button
                type="button"
                onClick={() => navigate('/problem-finder')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#790D16] hover:bg-[#91111c] text-white dark:bg-[#AEC4D4] dark:hover:bg-[#cde0ee] dark:text-[#220306] font-extrabold text-xs shadow-md transition-all hover:scale-[1.02] shrink-0 whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#E5D3AF] dark:text-[#220306]" />
                <span className="text-white dark:text-[#220306] font-extrabold">Problem Finder</span>
              </button>

              {/* Mobile menu hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-forest-800 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-forest-900 transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-200 dark:border-forest-800 bg-cream-50/98 dark:bg-forest-950/98 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      active
                        ? 'bg-forest-700 text-white dark:bg-forest-800 dark:text-lime-300'
                        : 'text-slate-700 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-forest-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-lime-300' : 'text-forest-600 dark:text-lime-400'}`} />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-200 dark:bg-lime-900/60 text-forest-900 dark:text-lime-300">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-cream-200 dark:border-forest-800">
              <Link
                to="/problem-finder"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-800 text-cream-50 font-bold text-sm shadow-md"
              >
                <Compass className="w-4 h-4 text-lime-400" />
                <span>Start Restaurant Diagnosis</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
