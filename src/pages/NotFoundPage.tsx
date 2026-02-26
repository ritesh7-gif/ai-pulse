import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass rounded-2xl p-10 max-w-lg w-full"
      >
        <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-white/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
          <Home size={16} />
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
