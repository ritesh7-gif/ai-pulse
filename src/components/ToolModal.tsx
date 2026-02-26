import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Github, Star, ExternalLink, Code, User, Bookmark } from "lucide-react";
import { GithubTool } from "../types";
import { formatToolName } from "../utils/format";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useToolVisit } from "../utils/useToolVisit";

interface ToolModalProps {
  tool: GithubTool | null;
  onClose: () => void;
  onRequireLogin?: () => void;
}

export const ToolModal = ({ tool, onClose, onRequireLogin = () => { } }: ToolModalProps) => {
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
                        <User size={12} />
                        {tool.owner.login}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5 text-accent-blue">
                        <Star size={12} />
                        {tool.stars.toLocaleString()} Stars
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
                      {tool.description || "No description available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                        <Code size={12} />
                        Language
                      </div>
                      <div className="text-white font-medium">
                        {tool.language || "Not specified"}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                        <Github size={12} />
                        Repository
                      </div>
                      <div className="text-white font-medium truncate">
                        {formatToolName(tool.name)}
                      </div>
                    </div>
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
                    ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20 hover:bg-accent-blue/20"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                    }`}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Tool"}
                </button>
                <button
                  onClick={() => visitTool(tool.url)}
                  className="flex-[2] py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Open on GitHub
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
