import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AIPulseLogo } from './AIPulseLogo';
import { Sparkles } from 'lucide-react';
import { smoothScrollToTop } from '../utils/scroll';

const Footer = () => {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      smoothScrollToTop();
    } else {
      navigate('/');
      window.scrollTo(0, 0);
    }
  };

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (window.location.pathname === path) {
      smoothScrollToTop();
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const handleFeaturedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      document.getElementById('startups')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('startups')?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Delay to allow page transition
    }
  };

  return (
    <footer className="bg-bg-dark border-t border-white/[0.05] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05),transparent_40%)]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Side - Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <AIPulseLogo />
            </Link>
            <p className="text-sm text-white/40 max-w-xs">
              Discover the future of AI tools, curated from the global startup ecosystem.
            </p>
          </div>

          {/* Center - Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  onClick={handleHomeClick}
                  className="text-white/50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/startups"
                  onClick={(e) => handleTabClick(e, '/startups')}
                  className="text-white/50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Startups
                </a>
              </li>
              <li>
                <a
                  href="/opensource"
                  onClick={(e) => handleTabClick(e, '/opensource')}
                  className="text-white/50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Open Source
                </a>
              </li>
              <li>
                <a
                  href="/#startups"
                  onClick={handleFeaturedClick}
                  className="text-white/50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Featured AI
                </a>
              </li>
              <li><Link to="/about" className="text-white/50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">About</Link></li>
              <li><Link to="/privacy" className="text-white/50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Privacy</Link></li>
            </ul>
          </div>

          {/* Right Side - Platform Info */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Platform</h3>
            <p className="text-sm text-white/40 max-w-xs">
              AI Pulse is a discovery engine for the latest artificial intelligence tools, powered by live data and community curation.
            </p>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/[0.05] text-center text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} AI Pulse — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
