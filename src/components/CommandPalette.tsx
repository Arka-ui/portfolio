"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Home, Code, User, Mail, Terminal, Settings, Copy, Check } from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useBlueprint } from "@/context/BlueprintContext";

// Since we might not have a Dialog component, we'll build a raw accessible modal
// Actually, cmdk handles the dialog part if configured, but usually needs a wrapper.
// Let's implement a simple wrapper using fixed positioning.

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const { warpTo } = useWarp();
    const { toggleBlueprintMode } = useBlueprint();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
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
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <Command className="w-full">
                    <div className="flex items-center border-b border-slate-700/50 px-3">
                        <Search className="w-5 h-5 text-slate-400 mr-2" />
                        <Command.Input
                            autoFocus
                            placeholder="Type a command or search..."
                            className="w-full bg-transparent p-4 text-base text-white placeholder-slate-400 focus:outline-none"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                        <Command.List>
                            <Command.Empty className="py-6 text-center text-sm text-slate-500">
                                No results found.
                            </Command.Empty>

                            <Command.Group heading="Navigation" className="text-xs font-bold text-slate-400 mb-2 px-2">
                                <CommandItem onSelect={() => run(() => warpTo("#"))} icon={<Home />}>Home</CommandItem>
                                <CommandItem onSelect={() => run(() => warpTo("#about"))} icon={<User />}>About</CommandItem>
                                <CommandItem onSelect={() => run(() => warpTo("#projects"))} icon={<Code />}>Projects</CommandItem>
                                <CommandItem onSelect={() => run(() => warpTo("#contact"))} icon={<Mail />}>Contact</CommandItem>
                            </Command.Group>

                            <Command.Group heading="System" className="text-xs font-bold text-slate-400 mb-2 px-2 mt-4">
                                <CommandItem onSelect={() => run(toggleBlueprintMode)} icon={<Terminal />}>Toggle Blueprint Mode</CommandItem>
                                <CommandItem onSelect={() => run(handleCopyEmail)} icon={copied ? <Check className="text-green-400" /> : <Copy />}>
                                    {copied ? "Email Copied!" : "Copy Email"}
                                </CommandItem>
                            </Command.Group>
                        </Command.List>
                    </div>

                    <div className="border-t border-slate-700/50 p-2 flex justify-between items-center text-[10px] text-slate-500 bg-slate-900/50">
                        <div className="flex gap-2">
                            <span className="bg-slate-800 px-1 rounded">PROTIP</span>
                            <span>Use arrows to navigate</span>
                        </div>
                        <div className="flex gap-2">
                            <span>ESC to close</span>
                            <span>ENTER to select</span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
}

function CommandItem({ children, icon, onSelect }: { children: React.ReactNode, icon: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 cursor-pointer transition-colors aria-selected:bg-indigo-500/20 aria-selected:text-indigo-300"
        >
            <div className="w-4 h-4 text-slate-500 group-hover:text-indigo-400">
                {icon}
            </div>
            {children}
        </Command.Item>
    );
}
