import React, { useRef } from "react";
import { motion } from "motion/react";
import { Github, Star, ArrowUpRight } from "lucide-react";
import { GithubTool } from "../types";
import { Logo } from "./Logo";
import { formatToolName } from "../utils/format";

export const GithubToolCard = ({ tool, onClick }: { tool: GithubTool; onClick?: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { clientX, clientY } = e;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group glass rounded-[24px] p-6 cursor-pointer relative flex flex-col h-full border-white/[0.03] hover:border-white/[0.1] spotlight-card transition-all duration-500"
      onClick={onClick || (() => window.open(tool.url, "_blank"))}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <Logo tool={tool} className="group-hover:border-white/10 transition-all duration-500" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/30 text-[10px] font-bold tracking-wider uppercase group-hover:bg-accent-blue/5 group-hover:text-accent-blue group-hover:border-accent-blue/10 transition-all duration-500">
            <Star size={10} className="text-accent-blue" />
            {tool.stars.toLocaleString()}
          </div>
        </div>
        
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-display font-bold group-hover:text-white transition-colors leading-tight tracking-tight text-white/90">
              {formatToolName(tool.name)}
            </h3>
            <Github size={14} className="text-white/20" />
          </div>
          <p className="text-white/60 text-xs leading-relaxed line-clamp-2 font-medium group-hover:text-white/80 transition-colors">
            {tool.description}
          </p>
        </div>

        <div className="mt-auto pt-5 border-t border-white/[0.03] flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/60 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.08]">
              {tool.language || "Open Source"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/[0.02] flex items-center justify-center text-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
