import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  UtensilsCrossed,
  Compass,
  Calculator,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  MessageSquareHeart,
  Info,
  CalendarCheck2,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Camera,
  Scale,
  Video as VideoIcon,
  GraduationCap,
  FileCheck2,
  Tag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'All' | 'Tools' | 'Problems' | 'Solutions' | 'Guides'>('All');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  const navRef = useRef<HTMLDivElement>(null);
  const searchCategoryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (searchCategoryRef.current && !searchCategoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoryDropdownOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = (name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      if (searchCategory === 'Tools') navigate('/tools');
      else if (searchCategory === 'Problems') navigate('/problems');
      else if (searchCategory === 'Solutions') navigate('/solutions');
      else if (searchCategory === 'Guides') navigate('/learning-hub');
      else navigate('/search');
      return;
    }

    const categoryParam = searchCategory !== 'All' ? `&type=${searchCategory.toLowerCase()}` : '';
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}${categoryParam}`);
  };

  // Structured menu items for Dribbble-style dropdowns
  const navigationItems = [
    {
      id: 'explore',
      label: 'Explore',
      items: [
        {
          title: 'Problems & Leaks',
          desc: 'Analyze food waste, high commissions & rent overheads',
          path: '/problems',
          icon: AlertTriangle,
        },
        {
          title: 'Solutions Library',
          desc: 'Turnaround frameworks & unit economics stabilization',
          path: '/solutions',
          icon: Lightbulb,
        },
        {
          title: 'Problem Finder Audit',
          desc: '3-minute operational self-diagnostic assessment',
          path: '/problem-finder',
          icon: Compass,
          badge: 'Popular',
        },
        {
          title: 'Growth Planner',
          desc: '30-day kitchen execution roadmap & milestones',
          path: '/growth-planner',
          icon: CalendarCheck2,
        },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        {
          title: 'Business Tools Hub',
          desc: 'Complete suite of calculators for Indian food founders',
          path: '/tools',
          icon: Calculator,
        },
        {
          title: 'Recipe & Batch Costing',
          desc: 'Calculate raw food cost percentages per portion',
          path: '/tools',
          icon: UtensilsCrossed,
        },
        {
          title: 'Delivery Commission Modeler',
          desc: 'Simulate Swiggy/Zomato payouts & net margins',
          path: '/tools',
          icon: TrendingUp,
        },
        {
          title: 'Dashboard & Metrics',
          desc: 'Track restaurant KPIs & financial performance',
          path: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      id: 'services',
      label: 'Services',
      items: [
        {
          title: 'Branding & Food Photography',
          desc: 'High-converting food photography & packaging design',
          path: '/branding-photography',
          icon: Camera,
        },
        {
          title: 'Legal Compliance & FSSAI',
          desc: 'Food licensing, GST, fire safety & trademark filings',
          path: '/legal-compliance',
          icon: Scale,
        },
        {
          title: 'Influencer Collaborations',
          desc: 'Partner with local food bloggers & UGC creators',
          path: '/influencer-collab',
          icon: Sparkles,
        },
      ],
    },
    {
      id: 'learning',
      label: 'Learning',
      items: [
        {
          title: 'Restaurant Learning Hub',
          desc: 'SOPs, checklists, and manuals for day-to-day kitchens',
          path: '/learning-hub',
          icon: BookOpen,
        },
        {
          title: 'Knowledge Base',
          desc: 'Comprehensive founder guides on unit economics',
          path: '/knowledge-hub',
          icon: FileCheck2,
        },
        {
          title: 'Video Masterclasses',
          desc: 'Watch real kitchen case studies and tutorials',
          path: '/videos',
          icon: VideoIcon,
        },
        {
          title: 'Startup Academy',
          desc: 'Zero-to-launch roadmap for new food entrepreneurs',
          path: '/startup-academy',
          icon: GraduationCap,
        },
      ],
    },
    {
      id: 'community',
      label: 'Community',
      items: [
        {
          title: 'Feedback & Feature Wall',
          desc: 'Suggest new tools, upvote features & guide roadmap',
          path: '/feedback',
          icon: MessageSquareHeart,
          badge: 'Live',
        },
        {
          title: 'Restaurateur Blog',
          desc: 'Real stories & turnaround lessons from food founders',
          path: '/blog',
          icon: BookOpen,
        },
        {
          title: 'About Scaletrix',
          desc: 'Our mission to empower Indian independent kitchens',
          path: '/about',
          icon: Info,
        },
      ],
    },
  ];

  return (
    <>
      {/* 1. Top Crimson / Magenta Accent Bar (Dribbble Signature Stripe) */}
      <div className="h-1 sm:h-1.5 w-full bg-[#790D16] dark:bg-[#790D16] shrink-0" />

      {/* 2. Main Navigation Bar */}
      <header
        ref={navRef}
        className="sticky top-0 z-40 bg-white/95 dark:bg-[#180407]/95 backdrop-blur-md border-b border-slate-100 dark:border-forest-900/60 transition-colors duration-200"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18 gap-3 sm:gap-6">
            
            {/* Left Section: Brand Logo + Pill Search Bar */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
              {/* Dribbble-style Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <span className="text-2xl sm:text-[27px] font-black tracking-tight text-forest-950 dark:text-cream-50 font-display flex items-center">
                  Scale<span className="text-[#790D16] dark:text-[#AEC4D4] italic font-serif font-black">trix</span>
                </span>
              </Link>

              {/* Dribbble Signature Search Pill */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center bg-[#f3f3f4] dark:bg-forest-900/70 border border-transparent hover:border-slate-300 dark:hover:border-forest-700 focus-within:border-slate-400 dark:focus-within:border-forest-600 focus-within:bg-white dark:focus-within:bg-forest-950 rounded-full pl-3.5 pr-1 py-1 transition-all shadow-2xs"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="bg-transparent text-xs sm:text-sm text-forest-950 dark:text-cream-50 placeholder:text-slate-400 dark:placeholder:text-cream-400/60 outline-hidden w-36 lg:w-56 xl:w-64 focus:w-48 lg:focus:w-68 xl:focus:w-72 transition-all font-medium"
                />

                {/* Filter Selector (e.g. Shots ▾ in Dribbble) */}
                <div ref={searchCategoryRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-cream-200 hover:text-forest-950 dark:hover:text-cream-50 transition cursor-pointer"
                  >
                    <span>{searchCategory}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-forest-900 border border-slate-200 dark:border-forest-700 rounded-xl shadow-xl py-1 z-50 text-xs">
                      {(['All', 'Tools', 'Problems', 'Solutions', 'Guides'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSearchCategory(cat);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 transition font-medium cursor-pointer ${
                            searchCategory === cat
                              ? 'bg-cream-100 dark:bg-forest-800 text-[#790D16] dark:text-[#AEC4D4] font-bold'
                              : 'text-slate-700 dark:text-cream-200 hover:bg-cream-50 dark:hover:bg-forest-800/60'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pink / Crimson Search Button Icon */}
                <button
                  type="submit"
                  aria-label="Search"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#790D16] hover:bg-[#91111c] text-white flex items-center justify-center transition-all hover:scale-105 shrink-0 shadow-xs cursor-pointer ml-1"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>
            </div>

            {/* Center Navigation Links with Dropdown Menus */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navigationItems.map((nav) => {
                const isOpen = openDropdown === nav.id;
                return (
                  <div
                    key={nav.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(nav.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : nav.id)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer rounded-lg ${
                        isOpen
                          ? 'text-[#790D16] dark:text-[#AEC4D4]'
                          : 'text-slate-700 dark:text-cream-200 hover:text-forest-950 dark:hover:text-cream-50'
                      }`}
                    >
                      <span>{nav.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#790D16] dark:text-[#AEC4D4]' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Dribbble Style Floating Dropdown Card */}
                    {isOpen && (
                      <div className="absolute left-0 top-full pt-2 w-72 xl:w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-white dark:bg-[#1f0509] rounded-2xl p-2.5 shadow-2xl border border-slate-100 dark:border-forest-800/80 space-y-1">
                          {nav.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path + item.title}
                                to={item.path}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-cream-50 dark:hover:bg-forest-900/70 transition group text-left"
                              >
                                <div className="w-8 h-8 rounded-lg bg-cream-100 dark:bg-forest-850 flex items-center justify-center text-forest-800 dark:text-cream-200 shrink-0 group-hover:bg-[#790D16] group-hover:text-white dark:group-hover:bg-[#AEC4D4] dark:group-hover:text-[#220306] transition-colors">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-forest-950 dark:text-cream-50 group-hover:text-[#790D16] dark:group-hover:text-[#AEC4D4] transition-colors">
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#790D16]/10 text-[#790D16] dark:bg-[#AEC4D4]/20 dark:text-[#AEC4D4]">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-cream-400/80 leading-snug line-clamp-2 mt-0.5">
                                    {item.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Section: Theme Toggle + Sign up + Log in Pill */}
            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-forest-900 hover:bg-slate-200 dark:hover:bg-forest-800 text-slate-700 dark:text-amber-400 flex items-center justify-center transition border border-slate-200/60 dark:border-forest-700 cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {user ? (
                /* Logged In User Pill Dropdown */
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-forest-900 border border-slate-200 dark:border-forest-800 hover:bg-slate-200 dark:hover:bg-forest-800 transition cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#790D16] text-white flex items-center justify-center text-xs font-bold">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="text-xs font-bold text-forest-950 dark:text-cream-50 max-w-[100px] truncate hidden sm:inline">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-forest-900 rounded-xl shadow-xl border border-slate-200 dark:border-forest-700 py-1.5 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-forest-800">
                        <p className="font-bold text-forest-950 dark:text-cream-50 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-cream-200 hover:bg-cream-50 dark:hover:bg-forest-800 transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-cream-200 hover:bg-cream-50 dark:hover:bg-forest-800 transition"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Dribbble Style Sign up & Log in Buttons */
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    to="/register"
                    className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-cream-200 hover:text-forest-950 dark:hover:text-cream-50 transition px-2 py-1"
                  >
                    Sign up
                  </Link>

                  <Link
                    to="/login"
                    className="rounded-full bg-[#0d0c22] hover:bg-slate-800 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-[#0d0c22] font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 transition shadow-xs whitespace-nowrap"
                  >
                    Log in
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-700 dark:text-cream-200 hover:text-black dark:hover:text-white cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-forest-900 bg-white/98 dark:bg-[#180407]/98 px-4 pt-3 pb-6 space-y-4 shadow-xl">
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, playbooks, SOPs..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-forest-900 text-xs font-medium text-forest-950 dark:text-cream-50 outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {/* Mobile Menu Categories */}
            <div className="space-y-3">
              {navigationItems.map((group) => (
                <div key={group.id} className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-cream-400/60 px-2">
                    {group.label}
                  </span>
                  <div className="grid grid-cols-1 gap-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path + item.title}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-forest-900 transition"
                        >
                          <Icon className="w-3.5 h-3.5 text-[#790D16] dark:text-[#AEC4D4]" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#790D16]/10 text-[#790D16] dark:bg-[#AEC4D4]/20 dark:text-[#AEC4D4]">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Problem Finder Mobile CTA */}
            <div className="pt-2 border-t border-slate-100 dark:border-forest-900">
              <Link
                to="/problem-finder"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#790D16] text-white font-bold text-xs shadow-md"
              >
                <Compass className="w-4 h-4" />
                <span>Start Restaurant Diagnosis</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. Dribbble-Style Promo / Announcement Banner (Matching Screenshot!) */}
      {showPromoBanner && (
        <div className="px-4 sm:px-6 lg:px-8 py-2.5 bg-transparent shrink-0">
          <div className="max-w-6xl mx-auto rounded-full bg-[#fdf2f7] dark:bg-[#2b070d] border border-pink-200/70 dark:border-forest-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-cream-100 min-w-0">
              <span className="text-base shrink-0">🏷️</span>
              <p className="truncate sm:whitespace-normal font-medium text-[11px] sm:text-xs">
                <span>Free Operational Audit: Diagnose your restaurant's food costs, commissions, and margin leaks in under 3 minutes.</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/problem-finder')}
                className="px-3 py-1 rounded-full bg-white dark:bg-forest-900 hover:bg-slate-50 dark:hover:bg-forest-800 text-forest-950 dark:text-cream-50 font-bold text-[11px] border border-slate-200 dark:border-forest-700 transition shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={() => setShowPromoBanner(false)}
                className="w-6 h-6 rounded-full hover:bg-pink-100 dark:hover:bg-forest-800 text-slate-400 hover:text-slate-600 dark:hover:text-cream-200 flex items-center justify-center transition cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
