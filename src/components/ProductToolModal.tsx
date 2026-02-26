import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, TrendingUp, LayoutGrid, Bookmark, Zap } from "lucide-react";
import { Tool } from "../types";
import { formatToolName } from "../utils/format";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useToolVisit } from "../utils/useToolVisit";

interface ProductToolModalProps {
  tool: Tool | null;
  onClose: () => void;
  onRequireLogin?: () => void;
}

export const ProductToolModal = ({ tool, onClose, onRequireLogin = () => { } }: ProductToolModalProps) => {
  const { user, toggleSaveTool, isToolSaved } = useAuth();
  const { visitTool } = useToolVisit(onRequireLogin);
  const isSaved = tool ? isToolSaved(tool) : false;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    if (tool) {
      document.documentElement.classList.add('lock-scroll');
      window.dispatchEvent(new Event('modalToggle'));
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      const activeModals = document.querySelectorAll('[data-modal-active="true"]').length;
      if (activeModals <= 1) {
        document.documentElement.classList.remove('lock-scroll');
      }
      window.dispatchEvent(new Event('modalToggle'));
    };
  }, [onClose, tool]);

  if (!tool) return null;

  return (
    <AnimatePresence>
      {tool && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-modal-active="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto scrollbar-hide overscroll-contain p-6 md:p-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-8">
                  <Logo tool={tool} size="lg" className="border-white/10" />
                  <div className="flex-1 pt-1">
                    <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                      {formatToolName(tool.name)}
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-accent-purple" />
                        Featured
                      </div>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5 text-accent-blue">
                        <Bookmark size={12} />
                        {tool.votesCount.toLocaleString()} Votes
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/20 mb-3">
                      About
                    </h3>
                    <p className="text-lg text-white/80 leading-relaxed font-medium">
                      {tool.tagline}
                    </p>
                    {tool.description && (
                      <p className="text-sm text-white/50 mt-4 leading-relaxed line-clamp-4">
                        {tool.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tool.topics.edges.map((edge) => (
                      <span
                        key={edge.node.name}
                        className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10px] uppercase tracking-wider font-bold text-white/40"
                      >
                        {edge.node.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action - Sticky Footer */}
              <div className="p-6 md:px-10 md:pb-10 pt-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    if (!user) {
                      onRequireLogin();
                    } else {
                      toggleSaveTool(tool);
                    }
                  }}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border ${isSaved
                    ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20 hover:bg-accent-purple/20"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                    }`}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Tool"}
                </button>
                <button
                  onClick={() => visitTool(tool.website)}
                  className="flex-[2] py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Visit Website
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
