"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Home, Code, User, Mail, Copy, Check, ExternalLink } from "lucide-react";
import { useWarp } from "@/context/WarpContext";

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const { warpTo } = useWarp();
    const [copied, setCopied] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(o => !o);
                setSearch("");
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const run = (action: () => void) => {
        setOpen(false);
        action();
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("hello@arka.dev");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <div className="relative w-full max-w-md bg-[#111] border border-white/[0.1] rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                <Command className="w-full" shouldFilter>
                    <div className="flex items-center border-b border-white/[0.07] px-4">
                        <Search className="w-4 h-4 text-white/30 mr-3 shrink-0" />
                        <Command.Input
                            autoFocus
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Search or jump to..."
                            className="w-full bg-transparent py-4 text-sm text-white placeholder-white/25 focus:outline-none"
                        />
                        <kbd className="hidden sm:inline-flex text-[11px] font-mono text-white/20 border border-white/[0.08] rounded px-1.5 py-0.5 ml-2 shrink-0">
                            ESC
                        </kbd>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto p-2">
                        <Command.List>
                            <Command.Empty className="py-8 text-center text-sm text-white/25">
                                No results found.
                            </Command.Empty>

                            <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-white/25 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest">
                                <CmdItem icon={<Home size={14} />} onSelect={() => run(() => warpTo("#"))}>Home</CmdItem>
                                <CmdItem icon={<User size={14} />} onSelect={() => run(() => warpTo("#about-intro"))}>About</CmdItem>
                                <CmdItem icon={<Code size={14} />} onSelect={() => run(() => warpTo("#projects"))}>Projects</CmdItem>
                                <CmdItem icon={<Mail size={14} />} onSelect={() => run(() => warpTo("#contact"))}>Contact</CmdItem>
                            </Command.Group>

                            <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-white/25 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest mt-1">
                                <CmdItem
                                    icon={copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    onSelect={() => run(handleCopyEmail)}
                                >
                                    {copied ? "Copied!" : "Copy email address"}
                                </CmdItem>
                                <CmdItem
                                    icon={<ExternalLink size={14} />}
                                    onSelect={() => run(() => window.open("https://github.com/arka-ui", "_blank"))}
                                >
                                    View GitHub profile
                                </CmdItem>
                            </Command.Group>
                        </Command.List>
                    </div>

                    <div className="border-t border-white/[0.06] px-4 py-2.5 flex justify-end gap-3 text-[10px] font-mono text-white/20">
                        <span>↑↓ navigate</span>
                        <span>↵ select</span>
                    </div>
                </Command>
            </div>
        </div>
    );
}

function CmdItem({ children, icon, onSelect }: {
    children: React.ReactNode;
    icon: React.ReactNode;
    onSelect: () => void;
}) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 cursor-pointer hover:bg-white/[0.06] hover:text-white aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
        >
            <span className="text-white/30">{icon}</span>
            {children}
        </Command.Item>
    );
}
