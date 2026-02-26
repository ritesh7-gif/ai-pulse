import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SubmitPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle form data submission to a backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass rounded-2xl p-10 max-w-lg w-full"
        >
          <CheckCircle size={48} className="mx-auto text-accent-cyan mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">Submission Received!</h1>
          <p className="text-white/60 mb-8">Thank you for contributing to AI Pulse. Our team will review your submission shortly.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
            Back to Home
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white/90 pb-20 pt-40 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-display font-bold text-center mb-4 text-gradient">Submit a Tool</h1>
          <p className="text-white/50 text-center mb-12 max-w-md mx-auto">Help us grow the largest directory of AI tools by submitting your favorite finds.</p>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 border border-white/10">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Tool Name</label>
              <input type="text" id="name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all" />
            </div>
            <div>
              <label htmlFor="url" className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Tool URL</label>
              <input type="url" id="url" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all" />
            </div>
            <div>
              <label htmlFor="tagline" className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Tagline / Short Description</label>
              <input type="text" id="tagline" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all" />
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Category</label>
              <select id="category" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all appearance-none">
                <option>Writing</option>
                <option>Design</option>
                <option>Coding</option>
                <option>Marketing</option>
                <option>Productivity</option>
                <option>Automation</option>
                <option>AI Agents</option>
                <option>Data & Analytics</option>
              </select>
            </div>
            <div className="pt-4">
              <button type="submit" className="w-full px-8 py-4 bg-white text-black rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">
                Submit Tool
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitPage;
