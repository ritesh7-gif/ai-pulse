import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login, signup, loginWithGoogle, user, loading } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Redirect to home if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        const { error: err } = await loginWithGoogle();
        if (err) {
            setError(err);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error: err } = await login(email, password);
                if (err) setError(err);
            } else {
                if (!name.trim()) {
                    setError('Name is required for signup');
                    setIsLoading(false);
                    return;
                }
                const { error: err } = await signup(email, password, name);
                if (err) {
                    setError(err);
                } else {
                    // Supabase sends a confirmation email by default
                    setError('Success! Please check your email for a confirmation link.');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div
                    className="relative rounded-3xl overflow-hidden shadow-2xl z-10"
                    style={{
                        background: 'rgba(10, 10, 16, 0.95)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <div className="px-8 pt-10 pb-8">
                        {/* Logo / Brand */}
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}
                            >
                                <Zap size={28} className="text-accent-purple" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                                    {isLogin ? 'Welcome back' : 'Create an account'}
                                </h1>
                                <p className="text-sm text-white/40 mt-1.5">
                                    {isLogin ? 'Sign in to continue to AI Pulse' : 'Join our community of AI enthusiasts'}
                                </p>
                            </div>
                        </div>

                        {/* Error message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`mb-6 p-3 rounded-xl border text-xs font-medium text-center ${error.includes('Success')
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Auth Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-purple transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-purple/50 focus:ring-4 focus:ring-accent-purple/10 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-purple transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-purple/50 focus:ring-4 focus:ring-accent-purple/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-purple transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-purple/50 focus:ring-4 focus:ring-accent-purple/10 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs mt-4 hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-white/[0.08]" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">or continue with</span>
                            <div className="flex-1 h-px bg-white/[0.08]" />
                        </div>

                        {/* Social Auth */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/[0.03] border border-white/[0.08] text-white/90 hover:bg-white/[0.06] hover:border-white/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>

                        {/* Switch Mode */}
                        <div className="mt-8 text-center pt-6 border-t border-white/[0.05]">
                            <p className="text-sm text-white/40 font-medium">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="ml-2 text-accent-purple hover:text-accent-purple/80 transition-colors font-bold"
                                >
                                    {isLogin ? 'Sign up' : 'Log in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

