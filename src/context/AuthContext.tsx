import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Tool, GithubTool } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

type SavedTool = Tool | GithubTool;

interface AuthContextType {
  user: User | null;
  login: (email?: string, password?: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
  savedTools: SavedTool[];
  toggleSaveTool: (tool: SavedTool) => void;
  isToolSaved: (tool: SavedTool) => boolean;
  updateUser: (data: { name: string; }) => void;
  loading: boolean;
  pendingToolUrl: string | null;
  setPendingToolUrl: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const meta = supabaseUser.user_metadata ?? {};
  const name =
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    supabaseUser.email?.split('@')[0] ||
    'User';

  const avatar =
    meta.avatar_url ||
    meta.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B5CF6&color=fff&size=100`;

  const joinDate = new Date(supabaseUser.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return { id: supabaseUser.id, name, email: supabaseUser.email ?? '', avatar, joinDate };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [pendingToolUrl, setPendingToolUrl] = useState<string | null>(null);

  const fetchSavedTools = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_tools')
        .select('tool_data')
        .eq('user_id', userId);

      if (error) throw error;
      if (data) {
        setSavedTools(data.map(item => item.tool_data as SavedTool));
      }
    } catch (error) {
      console.error('[Auth] Error fetching saved tools:', error);
    }
  };

  useEffect(() => {
    // Check existing session on page load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Auth] ❌ getSession error:', error.message);
      } else if (session?.user) {
        console.log('[Auth] ✅ Session found on load:', session.user.email);
        setUser(mapSupabaseUser(session.user));
        fetchSavedTools(session.user.id);
      } else {
        console.log('[Auth] ℹ️ No active session on load.');
        setUser(null);
        setSavedTools([]);
      }
      setLoading(false);
    });

    // Listen to auth changes (fires after OAuth redirect, login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] 🔄 Auth state changed:', event, session?.user?.email ?? 'no user');
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        fetchSavedTools(session.user.id);
      } else {
        setUser(null);
        setSavedTools([]);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const login = async (email?: string, password?: string): Promise<{ error?: string }> => {
    if (!email || !password) return { error: 'Email and password are required.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Supabase] Login error:', error.message);
      return { error: error.message };
    }
    return {};
  };

  const loginWithGoogle = async (): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error('[Supabase] Google Login error:', error.message);
      return { error: error.message };
    }
    return {};
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      console.error('[Supabase] Sign up error:', error.message);
      return { error: error.message };
    }
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSavedTools([]);
    localStorage.removeItem('saved_tools'); // Clean up old local storage
  };

  const toggleSaveTool = async (tool: SavedTool) => {
    if (!user) return; // Must be logged in to save tools

    const exists = savedTools.some(t => t.id === tool.id);
    const newTools = exists ? savedTools.filter(t => t.id !== tool.id) : [...savedTools, tool];

    // Optimistic UI update
    setSavedTools(newTools);

    try {
      if (exists) {
        // Remove from Supabase
        const { error } = await supabase
          .from('saved_tools')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', tool.id);

        if (error) throw error;
      } else {
        // Add to Supabase
        const { error } = await supabase
          .from('saved_tools')
          .insert({
            user_id: user.id,
            tool_id: tool.id,
            tool_data: tool,
          });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error('[Auth] Error updating saved tool:', error);
      // Revert optimistic update on failure
      setSavedTools(savedTools);
      alert(`Failed to save tool. Note: If you have not created the 'saved_tools' table in Supabase yet, you must do so first.\nError: ${error.message}`);
    }
  };

  const isToolSaved = (tool: SavedTool) => savedTools.some(t => t.id === tool.id);

  const updateUser = (data: { name: string }) => {
    if (user) {
      setUser({ ...user, ...data });
      supabase.auth.updateUser({ data: { full_name: data.name } }).catch(err =>
        console.error('[Supabase] Failed to update user metadata:', err.message)
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, savedTools, toggleSaveTool, isToolSaved, updateUser, loading, pendingToolUrl, setPendingToolUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
