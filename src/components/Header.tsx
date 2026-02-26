import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Zap, User, LogOut, Bookmark, ChevronDown, Search, Menu, X as CloseIcon } from "lucide-react";

import { Magnetic } from "./Magnetic";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { AIPulseLogo } from './AIPulseLogo';
import { smoothScrollToTop } from "../utils/scroll";
import { UserAvatar } from "./UserAvatar";


export function Header({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.classList.add('lock-scroll');
    } else {
      const activeModals = document.querySelectorAll('[data-modal-active="true"]').length;
      if (activeModals === 0) {
        document.documentElement.classList.remove('lock-scroll');
      }
    }
    return () => {
      const activeModals = document.querySelectorAll('[data-modal-active="true"]').length;
      if (activeModals === 0) {
        document.documentElement.classList.remove('lock-scroll');
      }
    };
  }, [isMobileMenuOpen]);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      smoothScrollToTop();
    } else {
      setActivePage('home');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (page: string) => {
    if (page === 'home' && activePage === 'home') {
      smoothScrollToTop();
    } else {
      setActivePage(page);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out w-full max-w-full box-border ${scrolled || isMobileMenuOpen ? "py-4 bg-[#0A0A0E] shadow-2xl shadow-black/40" : "py-5 bg-transparent"}`}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div onClick={handleLogoClick} className="flex items-center gap-3 text-xl font-display font-bold tracking-tight group cursor-pointer relative z-50">
          <AIPulseLogo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Magnetic strength={4} scale={1.1}>
            <button onClick={() => handleNavigation('home')} className={activePage === 'home' ? 'nav-active' : 'nav-link'}>
              HOME
            </button>
          </Magnetic>
          <Magnetic strength={4} scale={1.1}>
            <button onClick={() => handleNavigation('startups')} className={activePage === 'startups' ? 'nav-active' : 'nav-link'}>
              STARTUPS
            </button>
          </Magnetic>
          <Magnetic strength={4} scale={1.1}>
            <button onClick={() => handleNavigation('opensource')} className={activePage === 'opensource' ? 'nav-active' : 'nav-link'}>
              OPEN SOURCE
            </button>
          </Magnetic>
        </nav>

        {/* Desktop Profile Section */}
        <div className="hidden md:block relative" ref={profileRef}>
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <UserAvatar
                user={user}
                className="w-10 h-10 group-hover:border-accent-purple/50 transition-all text-sm"
              />
              <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-white text-black rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all shadow-lg shadow-white/5"
            >
              Login
            </button>
          )}

          <AnimatePresence>
            {isProfileOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                className="absolute right-0 top-full mt-1 w-64 rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl z-[100] backdrop-blur-xl origin-top-right"
                style={{ background: "rgba(10,10,14,0.95)" }}
              >
                <div className="p-5 border-b border-white/[0.08]">
                  <p className="text-sm font-semibold text-white/90 mb-0.5">{user.name}</p>
                  <p className="text-xs text-white/50 truncate font-medium">{user.email}</p>
                </div>

                <div className="p-2 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-sm font-medium text-white/80 hover:text-white transition-all duration-200 group"
                  >
                    <User size={16} className="text-white/50 group-hover:text-accent-purple transition-colors" />
                    My Profile
                  </Link>
                </div>

                <div className="p-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-medium text-red-400 hover:text-red-300 transition-all duration-200 group text-left"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden relative z-50">
          {user && (
            <Link to="/profile">
              <UserAvatar user={user} className="w-8 h-8 text-[10px]" />
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              data-modal-active="true"
              className="fixed inset-0 top-0 bg-bg-dark/95 backdrop-blur-2xl z-40 md:hidden flex flex-col pt-32 px-10 pb-12"
            >
              <nav className="flex flex-col gap-8 flex-1">
                <button
                  onClick={() => handleNavigation('home')}
                  className={`text-2xl font-display font-bold tracking-tight text-left ${activePage === 'home' ? 'text-accent-purple' : 'text-white/60'}`}
                >
                  HOME
                </button>
                <button
                  onClick={() => handleNavigation('startups')}
                  className={`text-2xl font-display font-bold tracking-tight text-left ${activePage === 'startups' ? 'text-accent-purple' : 'text-white/60'}`}
                >
                  STARTUPS
                </button>
                <button
                  onClick={() => handleNavigation('opensource')}
                  className={`text-2xl font-display font-bold tracking-tight text-left ${activePage === 'opensource' ? 'text-accent-purple' : 'text-white/60'}`}
                >
                  OPEN SOURCE
                </button>
              </nav>

              <div className="mt-auto space-y-6">
                {!user ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs"
                  >
                    Login to AI Pulse
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold uppercase tracking-widest text-xs border border-red-500/20"
                  >
                    Log Out
                  </button>
                )}
                <div className="text-center text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold">
                  Curated AI Ecosystem
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
