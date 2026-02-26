import React, { useRef } from "react";
import { motion } from "motion/react";
import { TrendingUp, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Tool } from "../types";
import { Logo } from "./Logo";
import { formatToolName } from "../utils/format";

export const ToolCard = ({ tool, onClick }: { tool: Tool; onClick: () => void }) => {
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
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group glass rounded-[24px] p-6 cursor-pointer relative flex flex-col h-full border-white/[0.03] hover:border-white/[0.1] spotlight-card transition-all duration-500"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <Logo tool={tool} className="group-hover:border-white/10 transition-all duration-500" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/30 text-[10px] font-bold tracking-wider uppercase group-hover:bg-accent-purple/5 group-hover:text-accent-purple group-hover:border-accent-purple/10 transition-all duration-500">
            <TrendingUp size={10} className="text-accent-purple" />
            {tool.votesCount}
          </div>
        </div>
        
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-display font-bold group-hover:text-white transition-colors leading-tight tracking-tight text-white/90">
              {formatToolName(tool.name)}
            </h3>
            {tool.votesCount > 500 && (
              <CheckCircle2 size={12} className="text-accent-blue" />
            )}
          </div>
          <p className="text-white/60 text-xs leading-relaxed line-clamp-2 font-medium group-hover:text-white/80 transition-colors">
            {tool.tagline}
          </p>
        </div>

        <div className="mt-auto pt-5 border-t border-white/[0.03] flex items-center justify-between">
          <div className="flex gap-2">
            {tool.topics.edges.slice(0, 1).map(edge => (
              <span key={edge.node.name} className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/60 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.08]">
                {edge.node.name}
              </span>
            ))}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/[0.02] flex items-center justify-center text-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
