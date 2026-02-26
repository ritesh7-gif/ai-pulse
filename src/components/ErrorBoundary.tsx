import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Zap } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-bg-dark flex items-center justify-center px-6 relative overflow-hidden">
                    {/* Background ambient glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
                        />
                        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
                            style={{ background: 'rgba(56,189,248,0.3)' }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="relative z-10 w-full max-w-lg"
                    >
                        <div className="glass rounded-[40px] p-12 border-white/5 shadow-2xl text-center relative overflow-hidden group">
                            {/* Subtle animated border glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-white/[0.03] border border-white/10 mb-8 shadow-xl">
                                    <AlertTriangle size={36} className="text-accent-purple" />
                                </div>

                                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 tracking-tight">
                                    Oops! Something <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-blue">
                                        Went Wrong
                                    </span>
                                </h1>

                                <p className="text-white/50 text-base mb-10 leading-relaxed max-w-md mx-auto font-medium">
                                    We've encountered an unexpected issue. Our team has been notified and we're working to fix it. Please try refreshing the page.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button
                                        onClick={this.handleReset}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-white/90 active:scale-95 transition-all shadow-xl"
                                    >
                                        <RefreshCw size={14} />
                                        Reload Page
                                    </button>

                                    <button
                                        onClick={this.handleGoHome}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-white/10 active:scale-95 transition-all"
                                    >
                                        <Home size={14} />
                                        Go Back Home
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Brand Logo Bottom */}
                        <div className="mt-12 flex items-center justify-center gap-2 opacity-20 hover:opacity-40 transition-opacity cursor-default">
                            <Zap size={14} className="text-accent-purple" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white">AI Pulse</span>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
