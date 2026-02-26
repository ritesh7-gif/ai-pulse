import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
    const { login, signup, pendingToolUrl, setPendingToolUrl, loginWithGoogle } = useAuth();
    const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens or tab changes
    useEffect(() => {
        if (isOpen) {
            setTab(initialTab);
            setEmail('');
            setPassword('');
            setName('');
            setError('');
            setSuccess('');
            setTimeout(() => emailRef.current?.focus(), 150);
        }
    }, [isOpen, initialTab]);

    useEffect(() => {
        setError('');
        setSuccess('');
    }, [tab]);

    // Close on Escape key & Background Scroll Lock
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);

        if (isOpen) {
            document.documentElement.classList.add('lock-scroll');
            window.dispatchEvent(new Event('modalToggle'));
        }

        return () => {
            document.removeEventListener('keydown', handler);
            // Only remove if no other modals are active (including mobile menu)
            const activeModals = document.querySelectorAll('[data-modal-active="true"]').length;
            if (activeModals <= 1) {
                document.documentElement.classList.remove('lock-scroll');
            }
            window.dispatchEvent(new Event('modalToggle'));
        };
    }, [onClose, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (tab === 'login') {
            const { error: err } = await login(email, password);
            if (err) {
                setError(err);
            } else {
                // If there's a pending tool URL, open it then clear
                if (pendingToolUrl) {
                    setTimeout(() => {
                        window.open(pendingToolUrl, '_blank', 'noopener,noreferrer');
                        setPendingToolUrl(null);
                    }, 300);
                }
                onClose();
            }
        } else {
            if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
            if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }
            const { error: err } = await signup(email, password, name);
            if (err) {
                setError(err);
            } else {
                setSuccess('Account created! Check your email to confirm your account, then log in.');
            }
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        // Note: Reusing the existing Supabase auth instance instead of Firebase,
        // as the entire project is powered by Supabase.
        const { error: err } = await loginWithGoogle();
        if (err) {
            setError(err);
        } else {
            onClose();
        }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        data-modal-active="true"
                        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto md:overflow-y-hidden scrollbar-hide overflow-x-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />

                            <div
                                className="relative rounded-2xl overflow-hidden shadow-2xl"
                                style={{ background: 'rgba(10, 10, 16, 0.97)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-8 pt-8 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                                            <Zap size={16} className="text-accent-purple" />
                                        </div>
                                        <span className="text-sm font-bold text-white/60 uppercase tracking-widest">AI Pulse</span>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Tab switcher */}
                                <div className="px-8 pb-6">
                                    <div className="flex rounded-xl bg-white/[0.04] p-1 gap-1">
                                        {(['login', 'signup'] as const).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setTab(t)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 ${tab === t
                                                    ? 'bg-white text-black shadow-md'
                                                    : 'text-white/40 hover:text-white/70'
                                                    }`}
                                            >
                                                {t === 'login' ? 'Log In' : 'Sign Up'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={tab}
                                            initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: tab === 'login' ? 10 : -10 }}
                                            transition={{ duration: 0.18 }}
                                            className="space-y-4"
                                        >
                                            {/* Heading */}
                                            <div className="pb-2">
                                                <h2 className="text-xl font-bold text-white">
                                                    {tab === 'login' ? 'Welcome back' : 'Create account'}
                                                </h2>
                                                <p className="text-sm text-white/40 mt-1">
                                                    {tab === 'login'
                                                        ? pendingToolUrl
                                                            ? 'Sign in to visit this tool.'
                                                            : 'Sign in to access your saved tools.'
                                                        : 'Join AI Pulse and start saving your favourite tools.'}
                                                </p>
                                            </div>

                                            {/* Name (signup only) */}
                                            {tab === 'signup' && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Full Name</label>
                                                    <div className="relative">
                                                        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={e => setName(e.target.value)}
                                                            placeholder="Alex Smith"
                                                            required
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.07] transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Email */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Email</label>
                                                <div className="relative">
                                                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                                    <input
                                                        ref={emailRef}
                                                        type="email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        placeholder="you@example.com"
                                                        required
                                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.07] transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Password</label>
                                                <div className="relative">
                                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        placeholder={tab === 'signup' ? 'At least 8 characters' : '••••••••'}
                                                        required
                                                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.07] transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(v => !v)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Error / Success messages */}
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
                                                    >
                                                        <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                                                        <p className="text-sm text-red-300">{error}</p>
                                                    </motion.div>
                                                )}
                                                {success && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20"
                                                    >
                                                        <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                                                        <p className="text-sm text-green-300">{success}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                        </svg>
                                                        {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                                                    </span>
                                                ) : tab === 'login' ? 'Sign In' : 'Create Account'}
                                            </button>

                                            <div className="flex items-center gap-3 my-4">
                                                <div className="flex-1 h-px bg-white/10" />
                                                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Or</span>
                                                <div className="flex-1 h-px bg-white/10" />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                disabled={loading}
                                                className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white font-bold text-sm hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2 shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                                Continue with Google
                                            </button>

                                            {/* Switch tab link */}
                                            <p className="text-center text-sm text-white/40">
                                                {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                                                    className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
                                                >
                                                    {tab === 'login' ? 'Sign up' : 'Log in'}
                                                </button>
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
