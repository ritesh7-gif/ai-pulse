import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ToolCard } from '../components/ToolCard';
import { GithubToolCard } from '../components/GithubToolCard';
import { Tool, GithubTool } from '../types';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

const SavedPage = () => {
  const { user, savedTools } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Please log in</h1>
        <p className="text-white/60">You need to be logged in to view your saved tools.</p>
      </div>
    );
  }

  const productTools = savedTools.filter(t => !('stars' in t)) as Tool[];
  const githubTools = savedTools.filter(t => 'stars' in t) as GithubTool[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
      <h1 className="text-4xl font-display font-bold tracking-tight text-gradient mb-12">Saved Tools</h1>
      {savedTools.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl">
          <Bookmark size={48} className="mx-auto text-white/20 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No saved tools yet</h2>
          <p className="text-white/60 mb-6">Your saved tools will appear here.</p>
          <Link to="/" className="text-accent-purple font-bold hover:underline">Explore Tools</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {productTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} onClick={() => {}} />
          ))}
          {githubTools.map(tool => (
            <GithubToolCard key={tool.id} tool={tool} onClick={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
