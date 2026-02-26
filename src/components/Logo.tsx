import React, { useState, memo, useMemo } from "react";
import { Cpu } from "lucide-react";

interface LogoProps {
  tool: any;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = memo(({ tool, className = "", size = "md" }: LogoProps) => {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-12 h-12 rounded-xl",
    lg: "w-20 h-20 rounded-2xl"
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 32
  };

  const logoUrl = useMemo(() => {
    // Priority 1: Direct image fields
    if (tool.image) return typeof tool.image === 'string' ? tool.image : tool.image.url;
    if (tool.thumbnail) return typeof tool.thumbnail === 'string' ? tool.thumbnail : tool.thumbnail.url;
    if (tool.logo) return typeof tool.logo === 'string' ? tool.logo : tool.logo.url;

    // Priority 2: GitHub specific avatar
    if (tool.owner?.avatar_url) return tool.owner.avatar_url;

    // Priority 3: Clearbit logo from domain
    try {
      const urlToParse = tool.website || tool.url;
      if (urlToParse) {
        const url = new URL(urlToParse);
        const domain = url.hostname.replace('www.', '');
        // Only use Clearbit for non-github domains to avoid generic github logos for every repo
        if (domain !== 'github.com') {
          return `https://logo.clearbit.com/${domain}`;
        }
      }
    } catch (e) {
      // Fallback handled by error state
    }
    return null;
  }, [tool.image, tool.thumbnail, tool.logo, tool.owner?.avatar_url, tool.website, tool.url]);

  if (error || !logoUrl) {
    return (
      <div className={`${sizeClasses[size]} bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
        <Cpu className="text-accent-purple" size={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      <img
        src={logoUrl}
        alt={tool.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        onError={() => setError(true)}
      />
    </div>
  );
});

Logo.displayName = "Logo";
