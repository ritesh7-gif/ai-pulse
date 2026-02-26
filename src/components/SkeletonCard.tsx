import React from "react";

export const SkeletonCard = () => (
  <div className="glass rounded-[24px] p-6 h-72 relative overflow-hidden flex flex-col">
    <div className="shimmer absolute inset-0 opacity-30" />
    <div className="flex items-start justify-between mb-8">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03]" />
      <div className="w-20 h-7 rounded-xl bg-white/[0.03]" />
    </div>
    <div className="w-3/4 h-7 rounded-xl bg-white/[0.03] mb-4" />
    <div className="w-full h-4 rounded-lg bg-white/[0.02] mb-2" />
    <div className="w-2/3 h-4 rounded-lg bg-white/[0.02]" />
    <div className="mt-auto pt-6 border-t border-white/[0.03] flex justify-between items-center">
      <div className="w-24 h-5 rounded-lg bg-white/[0.03]" />
      <div className="w-8 h-8 rounded-full bg-white/[0.03]" />
    </div>
  </div>
);
