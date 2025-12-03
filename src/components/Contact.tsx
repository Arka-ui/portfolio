"use client";

import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';
import BlueprintWrapper from "@/components/BlueprintWrapper";

export default function Contact() {
    const [state, handleSubmit] = useForm("xblnyneb");

    if (state.succeeded) {
        return (
            <section className="py-32 container mx-auto px-4 relative overflow-hidden" id="contact">
                <div className="max-w-md mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                    <p className="text-muted-foreground">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                </div>
            </section>
        );
    }

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
                <div className="relative bg-card/30 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-3xl overflow-hidden group hover:border-primary/20 transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="text-center mb-12">
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

                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Have a project in mind or just want to say hi? Send me a message below.
                        </p>
                    </div>

                    <BlueprintWrapper
                        label="COMM_UPLINK"
                        description="Secure Message Transmission"
                        direction="top"
                        techSpecs={{
                            "Protocol": "HTTPS/POST",
                            "Service": "Formspree",
                            "Encryption": "TLS 1.3"
                        }}
                    >
                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 relative z-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                        placeholder="john@example.com"
                                        required
                                    />
                                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
                                <input
                                    id="subject"
                                    type="text"
                                    name="subject"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                    placeholder="Project Inquiry"
                                    required
                                />
                                <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs" />
                            </div>

                            <button
                                type="submit"
                                disabled={state.submitting}
                                className="w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                <span className="relative">{state.submitting ? 'Sending...' : 'Send Message'}</span>
                                {!state.submitting && <Send className="w-5 h-5 relative transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                            </button>
                        </form>
                    </BlueprintWrapper>
                </div>
            </motion.div>
        </section>
    );
}
