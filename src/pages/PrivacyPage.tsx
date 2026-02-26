import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';

const PrivacyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Data Collection",
            icon: Eye,
            content: "We collect minimal information necessary to provide our services, including account details for authenticated users and anonymous usage analytics to improve our platform experience."
        },
        {
            title: "Information Usage",
            icon: FileText,
            content: "Your data is used exclusively to personalize your experience, synchronize your saved tools across devices, and communicate essential platform updates or security alerts."
        },
        {
            title: "Data Security",
            icon: Lock,
            content: "We employ industry-standard encryption and secure Supabase authentication protocols to protect your personal information from unauthorized access, disclosure, or alteration."
        },
        {
            title: "Your Rights",
            icon: Shield,
            content: "You maintain full control over your data. You can request access to, correction of, or deletion of your personal information at any time through your profile settings or by contacting us."
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-[9px] uppercase tracking-[0.3em] font-bold text-accent-purple mb-6">
                        <Shield size={12} />
                        <span>Trust & Transparency</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-white/50 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        At AI Pulse, we believe in radical transparency. Learn how we protect your data while you discover the future of AI.
                    </p>
                </motion.div>

                <div className="grid gap-8 mb-16">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <SpotlightCard
                                spotlightColor="rgba(139, 92, 246, 0.2)"
                                className="glass p-8 rounded-3xl border-white/5 hover:border-white/10 transition-all duration-500 group"
                                onClick={() => { }}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-purple/10 transition-all duration-500">
                                        <section.icon size={24} className="text-accent-purple" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold text-white/90 mb-3 flex items-center gap-2">
                                            {section.title}
                                            <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                                        </h3>
                                        <p className="text-white/40 text-base leading-relaxed font-medium">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass p-10 rounded-[40px] border-white/5 text-center"
                >
                    <h3 className="text-2xl font-display font-bold text-white/90 mb-4">Questions about your privacy?</h3>
                    <p className="text-white/40 mb-8 font-medium">
                        Our team is here to help. Reach out to us for any clarifications regarding our data practices.
                    </p>
                    <a href="mailto:riteshyadav70701@gmail.com?subject=Support%20Inquiry%20-%20AI%20Pulse" className="inline-block">
                        <button className="px-8 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-wider text-[11px] hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5">
                            Contact Support
                        </button>
                    </a>
                </motion.div>

                <div className="mt-16 text-center text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
                    Last updated: February 24, 2026
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
