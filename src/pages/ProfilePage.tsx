import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Settings, LogOut, Bookmark, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ToolCard } from "../components/ToolCard";
import { GithubToolCard } from "../components/GithubToolCard";
import { Tool, GithubTool } from "../types";
import { ProductToolModal } from "../components/ProductToolModal";
import { ToolModal } from "../components/ToolModal";
import EditProfileModal from "../components/EditProfileModal";
import { UserAvatar } from "../components/UserAvatar";


export default function ProfilePage() {
  const { user, logout, savedTools } = useAuth();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedGithubTool, setSelectedGithubTool] = useState<GithubTool | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [playProfileAnimation, setPlayProfileAnimation] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem("profileAnimationPlayed");

    if (!alreadyPlayed) {
      setPlayProfileAnimation(true);
      sessionStorage.setItem("profileAnimationPlayed", "true");
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const isProductTool = (tool: Tool | GithubTool): tool is Tool => {
    return (tool as Tool).votesCount !== undefined;
  };

  const handleToolClick = (tool: Tool | GithubTool) => {
    if (isProductTool(tool)) {
      setSelectedTool(tool);
    } else {
      setSelectedGithubTool(tool);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white/90 pb-20 pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={playProfileAnimation ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass rounded-[40px] p-10 md:p-16 mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <UserAvatar
                user={user}
                className="w-32 h-32 text-4xl"
                showDot={false}
              />
            </div>


            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-display font-bold mb-2">{user.name}</h1>
              <p className="text-white/40 mb-6">{user.email} • Joined {user.joinDate}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button onClick={() => setIsEditOpen(true)} className="px-6 py-3 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                  <Settings size={14} />
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-3 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <div className="text-3xl font-display font-bold mb-1">{savedTools.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Saved</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saved Tools Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-accent-cyan font-bold uppercase tracking-[0.3em] text-[10px]">
              <Bookmark size={16} />
              <span>Saved Collection</span>
            </div>
          </div>

          {savedTools.length === 0 ? (
            <div className="text-center py-20 glass rounded-[24px] border-white/5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 text-white/20 mb-4">
                <Bookmark size={24} />
              </div>
              <p className="text-white/40 font-medium">No saved tools yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedTools.map((tool) => (
                <div key={tool.id} className="h-[320px]">
                  {isProductTool(tool) ? (
                    <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
                  ) : (
                    <GithubToolCard tool={tool as GithubTool} onClick={() => handleToolClick(tool)} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductToolModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
      />

      <ToolModal
        tool={selectedGithubTool}
        onClose={() => setSelectedGithubTool(null)}
      />
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
}
