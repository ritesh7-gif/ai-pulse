import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Users, Cpu, BarChart, Palette } from 'lucide-react';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-bg-dark text-white/90 selection:bg-accent-purple/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="floating-blob w-[500px] h-[500px] bg-accent-purple/10 top-[-10%] left-[-10%]" />
        <div className="floating-blob w-[400px] h-[400px] bg-accent-blue/10 bottom-[-5%] right-[-5%] delay-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05),transparent_50%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-[9px] uppercase tracking-[0.3em] font-bold text-accent-cyan mb-6 shadow-xl">
              <Sparkles size={12} />
              <span>Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-gradient mb-6">
              Charting the AI Frontier
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              AI Pulse is dedicated to mapping the rapidly expanding universe of artificial intelligence. We provide a comprehensive, real-time directory of AI tools, startups, and open-source projects to empower builders, researchers, and innovators worldwide.
            </p>
          </div>

          <div className="glass p-10 rounded-[32px] border-white/5 space-y-8">
            <h2 className="text-3xl font-display font-bold text-center text-gradient">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <FeatureItem icon={Cpu} title="Curate & Verify">
                Our team meticulously selects and verifies every entry, ensuring a high-quality, signal-rich database of the most promising AI technologies.
              </FeatureItem>
              <FeatureItem icon={Zap} title="Real-time Intelligence">
                Through direct API integrations with platforms like Product Hunt and GitHub, we deliver the most current data on funding, popularity, and development activity.
              </FeatureItem>
              <FeatureItem icon={Users} title="Community Focused">
                We serve a global community of developers, entrepreneurs, and investors, providing the critical insights needed to stay ahead in the fast-paced world of AI.
              </FeatureItem>
              <FeatureItem icon={BarChart} title="Data-Driven Insights">
                AI Pulse isn't just a list; it's an intelligence layer. We analyze trends to highlight what's new, what's growing, and what's shaping the future.
              </FeatureItem>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, children }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex-none flex items-center justify-center">
      <Icon size={20} className="text-accent-cyan" />
    </div>
    <div>
      <h3 className="font-bold text-white/90 mb-1">{title}</h3>
      <p className="text-white/50 leading-relaxed">{children}</p>
    </div>
  </div>
);

export default AboutPage;
