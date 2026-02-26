import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { CursorGlow } from './CursorGlow';
import ScrollToTopButton from './ScrollToTopButton';
import { motion } from 'framer-motion';
import HomePage from '../pages/HomePage';
import StartupsPage from '../pages/StartupsPage';
import GithubPage from '../pages/GithubPage';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activePage = useMemo(() => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/startups') return 'startups';
    if (location.pathname === '/opensource') return 'opensource';
    return 'none';
  }, [location.pathname]);

  const handleNavigateTab = (page: string) => {
    const newPath = page === 'home' ? '/' : `/${page}`;
    if (location.pathname !== newPath) {
      navigate(newPath);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isMainTabPage = ['/', '/startups', '/opensource'].includes(location.pathname);

  return (
    <>
      <CursorGlow />
      <Header activePage={activePage} setActivePage={handleNavigateTab} />

      {isMainTabPage ? (
        <div className="relative w-full">
          {/* Home Page */}
          <div
            className={activePage === 'home' ? 'relative w-full' : 'hidden'}
          >
            <HomePage />
          </div>

          {/* Startups Page */}
          <div
            className={activePage === 'startups' ? 'relative w-full' : 'hidden'}
          >
            <StartupsPage />
          </div>

          {/* Open Source Page */}
          <div
            className={activePage === 'opensource' ? 'relative w-full' : 'hidden'}
          >
            <GithubPage />
          </div>
        </div>
      ) : (
        <main>
          <Outlet />
        </main>
      )}

      <ScrollToTopButton />
    </>
  );
}
