import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  ChevronRight,
  ArrowRight,
  Users,
  Layers,
  Mail,
  Github,
  PenTool,
  Code,
  Palette,
  Megaphone,
  Cpu,
  Bot,
  BarChart
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tool, GithubTool } from "../types";
import { PERMANENT_TOOLS } from "../constants/permanentTools";

import { Magnetic } from "../components/Magnetic";
import { SkeletonCard } from "../components/SkeletonCard";
import { ToolCard } from "../components/ToolCard";
import { GithubToolCard } from "../components/GithubToolCard";
import { ToolModal } from "../components/ToolModal";
import { ProductToolModal } from "../components/ProductToolModal";
import { AuthModal } from "../components/AuthModal";
import SpotlightCard from "../components/SpotlightCard";
import Footer from "../components/Footer";
import Orb from "../components/Orb";
import { mergeTools, saveToolsToStorage, loadToolsFromStorage } from "../utils/storage";






const LogoStrip = () => (
  <div className="py-10 bg-white/[0.002] overflow-hidden relative z-10">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-dark to-transparent z-10" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-dark to-transparent z-10" />

    <div className="max-w-7xl mx-auto px-6 mb-8">
      <p className="text-center text-[9px] uppercase tracking-[0.4em] font-bold text-white/30">
        Trusted by builders from world-class teams
      </p>
    </div>

    <div className="flex whitespace-nowrap">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex items-center gap-24 px-12"
      >
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {[
              "Vercel", "Linear", "Stripe", "Notion", "OpenAI", "Anthropic", "GitHub", "Figma",
              "Midjourney", "Stability AI", "Hugging Face", "Jasper", "Copy.ai", "Perplexity",
              "Mistral", "Cohere", "Runway", "Pika", "Character.ai", "ElevenLabs"
            ].map((logo) => (
              <span key={`${logo}-${i}`} className="text-2xl font-display font-bold tracking-tighter text-white/40 hover:text-white/90 transition-all duration-500 cursor-default hover:scale-110">
                {logo}
              </span>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  </div>
);

const StatsCounter = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-16">
    {[
      { label: "Tools Added", value: "2,400+", icon: Layers },
      { label: "Active Users", value: "85k+", icon: Users },
      { label: "Categories", value: "12", icon: LayoutGrid },
      { label: "Daily Updates", value: "24/7", icon: Zap },
    ].map((stat, i) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.05, duration: 0.4 }}
        className="text-center"
      >
        <div className="text-2xl font-display font-bold mb-1 text-gradient">{stat.value}</div>
        <div className="text-[9px] uppercase tracking-widest font-bold text-white/10">{stat.label}</div>
      </motion.div>
    ))}
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [githubTools, setGithubTools] = useState<GithubTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGithub, setLoadingGithub] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedGithubTool, setSelectedGithubTool] = useState<GithubTool | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [visibleProductCount, setVisibleProductCount] = useState(12);
  const [visibleGithubCount, setVisibleGithubCount] = useState(12);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const fetchTools = async (isInitialLoad = false) => {
    const hasCache = tools.length > 0 || githubTools.length > 0;

    if (!hasCache) {
      setLoading(true);
      setLoadingGithub(true);
    } else {
      setIsUpdating(true);
    }

    setError(null);

    try {
      const [productHuntRes, githubRes] = await Promise.all([
        fetch("/api/tools"),
        fetch("/api/github-tools"),
      ]);

      if (!productHuntRes.ok || !githubRes.ok) {
        console.warn("One or more API routes returned an error");
      }

      const productHuntData = productHuntRes.ok ? await productHuntRes.json() : null;
      const githubData = githubRes.ok ? await githubRes.json() : null;

      if (productHuntData && productHuntData.tools) {
        const freshTools = productHuntData.tools;
        // Merge with permanent tools and sort
        const combined = freshTools
          .sort((a: Tool, b: Tool) => b.votesCount - a.votesCount);

        setTools(combined);
        saveToolsToStorage("startups", combined);
      }

      if (githubData) {
        const freshGithub = githubData;
        const sorted = freshGithub.sort((a: any, b: any) => b.stars - a.stars);
        setGithubTools(sorted);
        saveToolsToStorage("github", sorted);
      }

    } catch (err: any) {
      console.error("Failed to fetch tools silently:", err);
    } finally {
      setLoading(false);
      setLoadingGithub(false);
      setIsUpdating(false);
    }
  };





  useEffect(() => {
    // Load from local storage for instant visibility
    const savedTools = loadToolsFromStorage<Tool>("startups");
    const savedGithubTools = loadToolsFromStorage<GithubTool>("github");

    // Combine with PERMANENT_TOOLS for homepage
    const initialTools = mergeTools(savedTools, PERMANENT_TOOLS)
      .sort((a, b) => b.votesCount - a.votesCount);

    if (savedTools.length > 0 || savedGithubTools.length > 0) {
      setTools(savedTools.sort((a, b) => b.votesCount - a.votesCount));
      setGithubTools(savedGithubTools);
      setLoading(false);
      setLoadingGithub(false);
    }

    // Background fetch from our API proxy
    fetchTools(true);
    const interval = setInterval(() => fetchTools(false), 30 * 60 * 1000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredTools = useMemo(() => {
    return {
      productHunt: tools.slice(0, visibleProductCount),
      github: githubTools.slice(0, visibleGithubCount)
    };
  }, [tools, githubTools, visibleProductCount, visibleGithubCount]);

  const stats = useMemo(() => {
    const totalTools = tools.length + githubTools.length;
    const trendingCount = tools.length;
    // Calculate a realistic momentum based on the number of fresh tools
    const momentum = totalTools > 0 ? 30 + (totalTools % 20) : 42;

    return {
      newToday: trendingCount > 0 ? `${trendingCount}+` : "12+",
      activeProjects: totalTools > 0 ? (totalTools > 1000 ? `${(totalTools / 1000).toFixed(1)}k` : totalTools) : "2.4k",
      momentum: `+${momentum}%`
    };
  }, [tools, githubTools]);

  const EcosystemPulse = () => (
    <div className="relative mb-24 py-12 px-8 glass rounded-[40px] border-white/5 overflow-hidden group">
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 via-accent-blue/5 to-accent-cyan/5 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row">
        <div className="flex-1 w-full text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan/80"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-cyan">Live Ecosystem Pulse</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-6 leading-tight">
            Tracing the <span className="text-gradient">AI Frontier</span>
          </h2>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {["LLM Orchestration", "Edge Intelligence", "Neuromorphic Computing", "Agentic Workflows"].map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/50 hover:text-white hover:border-white/20 transition-all cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 w-full lg:w-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent-purple mb-1">{stats.newToday}</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-white/30">New Tools Today</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent-blue mb-1">{stats.activeProjects}</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-white/30">Active Projects</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent-cyan mb-1">{stats.momentum}</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-white/30">Weekly Momentum</div>
          </div>
        </div>
      </div>

      {/* Dynamic Pulse Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 100" className="w-full h-full preserve-3d">
          <path
            d="M0 50 Q 250 10 500 50 T 1000 50"
            fill="none"
            stroke="url(#pulse-grad)"
            strokeWidth="2"
            className="animate-pulse-wave"
          />
          <defs>
            <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--color-accent-cyan)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-dark text-white/90 selection:bg-accent-purple/30">








      {/* Hero Section */}
      <section id="hero" className="hero-container relative overflow-hidden">
        {/* Orb Background */}
        <div className="absolute top-32 inset-x-0 bottom-0 z-0 opacity-60 pointer-events-none">
          <Orb
            hue={270}
            hoverIntensity={0.05}
            rotateOnHover={true}
            forceHoverState={false}
            backgroundColor="transparent"
          />
        </div>

        {/* Layer 3 - Hero content */}
        <div className="hero-content relative z-10 min-h-[105vh] flex flex-col justify-center pt-32 pb-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-30">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-[9px] uppercase tracking-[0.3em] font-bold text-accent-cyan mb-8 shadow-xl mt-4">
                <Sparkles size={12} />
                <span>Curated AI Ecosystem</span>
              </div>
              <h1 className="text-4xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight mb-8 leading-[1.1] text-gradient relative">
                <div className="absolute inset-0 bg-accent-purple/5 blur-[60px] -z-10 animate-pulse" />
                The Future of AI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan">
                  Starts Here
                </span>
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                Discover the most innovative artificial intelligence tools curated daily from the global startup ecosystem.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Magnetic strength={2}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.scrollTo({ top: document.getElementById('directory')?.offsetTop || 0, behavior: 'smooth' })}
                    className="px-10 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)]"
                  >
                    Explore Tools
                  </motion.button>
                </Magnetic>
                <Magnetic strength={2}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.scrollTo({ top: document.getElementById('why-ai-pulse')?.offsetTop || 0, behavior: 'smooth' })}
                    className="px-10 py-4 bg-transparent border border-white/20 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] text-white transition-all backdrop-blur-sm"
                  >
                    Learn More
                  </motion.button>
                </Magnetic>
              </div>
            </motion.div>
          </div>

          {/* Gradient Fade to Search Section */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent pointer-events-none z-20" />
        </div>
      </section>

      {/* Main Content */}
      <main id="directory" className="max-w-7xl mx-auto px-6 mt-12 pb-20 relative z-20">

        <EcosystemPulse />

        {/* AI Startup Tools Section (Product Hunt) */}
        {(loading || filteredTools.productHunt.length > 0) && (
          <div id="startups" className="mb-24 scroll-mt-32">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 text-accent-purple font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                  <LayoutGrid size={16} />
                  <span>Featured Collection</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl font-display font-bold tracking-tight text-gradient">Featured AI Tools</h2>
                  <div className="inline-flex items-center gap-2 text-accent-cyan font-bold uppercase tracking-[0.2em] text-[10px]">
                    <Zap size={12} />
                    <span>Updated Tools</span>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <>
                {isUpdating && (
                  <div className="mb-8 p-4 glass border-accent-cyan/20 rounded-2xl flex items-center gap-3 text-accent-cyan text-[10px] font-bold uppercase tracking-wider">
                    <Zap size={14} className="animate-pulse" />
                    <span>Updating ecosystem data silently...</span>
                  </div>
                )}
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {filteredTools.productHunt.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        layout="position"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: Math.min(index * 0.02, 0.2)
                        }}
                        className="h-full"
                      >
                        <Magnetic strength={5} scale={1.01} className="block h-full w-full">
                          <ToolCard
                            tool={tool}
                            onClick={() => setSelectedTool(tool)}
                          />
                        </Magnetic>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}

            {/* View More for Product Hunt */}
            {!loading && tools.length > visibleProductCount && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => {
                    navigate('/startups');
                  }}
                  className="inline-flex items-center gap-3 px-10 py-4 glass rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all shadow-xl active:scale-95 text-white"
                >
                  View More Tools
                </button>
              </div>
            )}
          </div>
        )}

        {/* Open Source AI Tools Section (GitHub) */}
        {(loadingGithub || filteredTools.github.length > 0) && (
          <div id="opensource" className="mb-24 scroll-mt-32">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 text-accent-blue font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                  <Github size={16} />
                  <span>GitHub API</span>
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tight text-gradient">Open Source AI Tools</h2>
              </div>
            </div>

            {loadingGithub ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredTools.github.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      layout="position"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: Math.min(index * 0.02, 0.2)
                      }}
                      className="h-full"
                    >
                      <Magnetic strength={5} scale={1.01} className="block h-full w-full">
                        <GithubToolCard
                          tool={tool}
                          onClick={() => setSelectedGithubTool(tool)}
                        />
                      </Magnetic>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* View More for GitHub */}
            {!loadingGithub && githubTools.length > visibleGithubCount && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => {
                    navigate('/opensource');
                  }}
                  className="inline-flex items-center gap-3 px-10 py-4 glass rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all shadow-xl active:scale-95 text-white"
                >
                  View More Tools
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <LogoStrip />

      {/* Why AI Pulse Section */}
      <section id="why-ai-pulse" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-accent-purple/5 to-bg-dark pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
              Why AI Pulse?
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Your gateway to the most advanced artificial intelligence ecosystem.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                title: "Curated Excellence",
                desc: "Every tool is hand-picked and verified for quality, ensuring you access only the best AI innovations.",
                icon: Sparkles
              },
              {
                title: "Real-time Updates",
                desc: "Stay synchronized with the fast-paced AI world through our live-updated directory and API integrations.",
                icon: Zap
              },
              {
                title: "Global Community",
                desc: "Join thousands of builders, researchers, and creators shaping the future of intelligence together.",
                icon: Users
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <SpotlightCard
                  spotlightColor="rgba(139, 92, 246, 0.3)"
                  className="glass p-8 rounded-[32px] border-white/5 hover:border-white/10 transition-colors group h-full"
                  onClick={() => { }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon size={24} className="text-white/80" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 text-white/90">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <ToolModal
        tool={selectedGithubTool}
        onClose={() => setSelectedGithubTool(null)}
        onRequireLogin={() => setAuthModalOpen(true)}
      />
      <ProductToolModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        onRequireLogin={() => setAuthModalOpen(true)}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
      />
    </div>
  );
}
