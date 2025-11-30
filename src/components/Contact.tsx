"use client";

import { motion } from "framer-motion";
import { Send, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
    return (
        <section className="py-32 container mx-auto px-4 relative overflow-hidden" id="contact">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="relative bg-card/30 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-3xl overflow-hidden text-center group hover:border-primary/20 transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-8 border border-white/5 shadow-inner"
                    >
                        <Mail className="w-8 h-8 text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Let's Work Together
                    </h2>

                    <p className="text-muted-foreground mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Have a project in mind or just want to say hi? I'm always open to new opportunities and interesting conversations.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:hello@arka.dev"
                            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                            <span className="relative">Say Hello</span>
                            <Send className="w-5 h-5 relative transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>

                        <a
                            href="https://discord.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded-full font-bold text-lg transition-all hover:bg-white/10 hover:scale-105 border border-white/10 backdrop-blur-sm"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Discord</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
