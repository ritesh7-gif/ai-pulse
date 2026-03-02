import React, { useState, useEffect, useLayoutEffect, useMemo, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { CursorGlow } from './CursorGlow';
import ScrollToTopButton from './ScrollToTopButton';
import { motion } from 'framer-motion';
import HomePage from '../pages/HomePage';
import StartupsPage from '../pages/StartupsPage';
import GithubPage from '../pages/GithubPage';

const PageLoader = () => (
  <div style={{
    width: "100%",
    height: "100%",
    background: "#020203"
  }} />
);

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

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isMainTabPage = ['/', '/startups', '/opensource'].includes(location.pathname);

  return (
    <>
      <CursorGlow />
      <Header activePage={activePage} setActivePage={handleNavigateTab} />

      <main className="relative w-full">
        <Suspense fallback={<PageLoader />}>
          {/* Main Tab Pages Container (always in DOM, visible only when needed) */}
          <div className={isMainTabPage ? 'relative w-full' : 'hidden'}>
            {/* Home Page */}
            <div className={activePage === 'home' ? 'relative w-full' : 'hidden'}>
              <HomePage />
            </div>

            {/* Startups Page */}
            <div className={activePage === 'startups' ? 'relative w-full' : 'hidden'}>
              <StartupsPage />
            </div>

            {/* Open Source Page */}
            <div className={activePage === 'opensource' ? 'relative w-full' : 'hidden'}>
              <GithubPage />
            </div>
          </div>

          {/* Sub Pages (Profile, Login, etc.) */}
          {!isMainTabPage && (
            <Outlet />
          )}
        </Suspense>
      </main>

      <ScrollToTopButton />
    </>
  );
}
