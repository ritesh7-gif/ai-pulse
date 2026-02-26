import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ArrowLeft,
  ChevronRight,
  Search,
  Filter,
  LayoutGrid,
  PenTool,
  Code,
  Palette,
  Megaphone,
  Zap,
  Cpu,
  Bot,
  BarChart,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { GithubTool, CATEGORIES } from "../types";
import { GithubToolCard } from "../components/GithubToolCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { Magnetic } from "../components/Magnetic";
import { ToolModal } from "../components/ToolModal";
import { AuthModal } from "../components/AuthModal";
import { mergeTools, saveToolsToStorage, loadToolsFromStorage } from "../utils/storage";

const iconMap: Record<string, any> = {
  PenTool,
  Code,
  Palette,
  Megaphone,
  Zap,
  Cpu,
  LayoutGrid,
  Bot,
  BarChart,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  }
} as const;

export default function GithubPage() {
  const [tools, setTools] = useState<GithubTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTool, setSelectedTool] = useState<GithubTool | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const hasAnimated = useRef(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Initial load from storage for instant visibility
    const savedTools = loadToolsFromStorage<GithubTool>("github");
    if (savedTools.length > 0) {
      setTools(savedTools);
      setLoading(false);
    }

    fetchTools(1); // Fetch fresh data from backend proxy

    if (!hasAnimated.current) {
      const timer = setTimeout(() => {
        hasAnimated.current = true;
        forceUpdate({}); // Trigger one re-render to start the animation
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchTools = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        if (tools.length === 0) setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`/api/github-tools?page=${pageNum}`);
      if (!res.ok) {
        console.warn("GitHub API Route Error:", res.status);
        return;
      }

      const data = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setTools(prevTools => {
          const merged = pageNum === 1 ? data : [...prevTools, ...data];

          // Deduplicate
          const unique = mergeTools(prevTools, data);

          if (pageNum === 1) saveToolsToStorage("github", unique);
          return unique;
        });
      }
    } catch (err) {
      console.error("GitHub fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchTools(nextPage);
        return nextPage;
      });
    }
  };

  const filteredTools = useMemo(() => {
    const getKeywords = (category: string) => {
      switch (category.toLowerCase()) {
        case "coding": return ["code", "dev", "framework", "lib", "lang", "api", "sdk", "cli"];
        case "writing": return ["text", "content", "editor", "write", "blog", "copy"];
        case "design": return ["ui", "image", "video", "art", "design", "graphic", "svg", "css"];
        case "marketing": return ["marketing", "seo", "social", "analytics", "growth", "email"];
        case "productivity": return ["productivity", "task", "manage", "note", "calendar", "time"];
        case "automation": return ["workflow", "agent", "bot", "automation", "script", "cron"];
        case "ai agents": return ["agent", "bot", "llm", "chat", "assistant", "autonomous"];
        case "data & analytics": return ["data", "analytics", "visualization", "chart", "graph", "database", "sql"];
        default: return [category.toLowerCase()];
      }
    };

    return tools.filter((tool) => {
      const name = tool.name.toLowerCase();
      const description = (tool.description || "").toLowerCase();
      const language = (tool.language || "").toLowerCase();

      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        description.includes(query) ||
        language.includes(query);

      let matchesCategory = false;
      if (selectedCategory === "All") {
        matchesCategory = true;
      } else {
        const keywords = getKeywords(selectedCategory);
        const text = `${name} ${description} ${language}`;
        matchesCategory = keywords.some(k => text.includes(k));
      }

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-bg-dark text-white/90 selection:bg-accent-purple/30 pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-[9px] uppercase tracking-[0.3em] font-bold text-accent-blue mb-6 shadow-xl">
            <Github size={12} />
            <span>GitHub Ecosystem</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
            Discover Open Source <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-cyan">
              AI Innovation
            </span>
          </h1>
          <p className="text-white/70 text-base max-w-xl mx-auto leading-relaxed font-medium">
            Explore the most popular and cutting-edge AI repositories on GitHub.
            Curated list of tools shaping the future of open source artificial intelligence.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/80 group-focus-within:text-accent-blue transition-colors z-10">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full pl-16 pr-14 py-4 bg-white/[0.03] backdrop-blur-md border border-white/[0.1] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] focus:shadow-[0_0_50px_rgba(56,189,248,0.2)] transition-all duration-300 text-base placeholder:text-white/40 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-6 flex items-center text-white/40 hover:text-white/80 transition-colors z-10"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Adjusted Size Single Row */}
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-center gap-3 text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Filter size={12} />
            Filter by Category
          </div>
          <motion.div
            variants={containerVariants}
            initial={false}
            animate={hasAnimated.current ? "visible" : "hidden"}
            className="flex items-center justify-center gap-1.5 md:gap-2 overflow-hidden"
          >
            {CATEGORIES.map((cat, idx) => {
              const Icon = iconMap[cat.icon];
              const isActive = selectedCategory === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  variants={itemVariants}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex-none flex items-center gap-2 px-3.5 py-2 md:px-5 md:py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap group ${isActive
                    ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-105"
                    : "bg-white/[0.05] border-white/[0.1] text-white/70 hover:bg-white/[0.08] hover:text-white hover:border-white/20"
                    }`}
                >
                  <Icon size={14} className={isActive ? "text-black" : "text-white/40 group-hover:text-white transition-colors"} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{cat.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="glass rounded-[40px] p-10 text-center max-w-lg mx-auto border-white/5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-accent-blue/10 text-accent-blue mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">No Repositories Found</h3>
            <p className="text-white/30 mb-8 leading-relaxed text-sm font-medium">
              We couldn't find any open source tools matching your search.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full"
                >
                  <Magnetic strength={5} scale={1.01} className="block h-full w-full">
                    <GithubToolCard tool={tool} onClick={() => setSelectedTool(tool)} />
                  </Magnetic>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && selectedCategory === "All" && filteredTools.length > 0 && (
              <div className="mt-20 text-center">
                <Magnetic strength={5}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-5 px-14 py-6 glass rounded-[32px] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all group shadow-2xl active:scale-95 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading Tools...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Tools</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>
            )}
          </>
        )}
      </main>
      <ToolModal
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
