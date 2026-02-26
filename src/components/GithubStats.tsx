"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, Github, GitCommit, Zap, Code, Layers } from "lucide-react";
import BlueprintWrapper from "@/components/BlueprintWrapper";

// Placeholder - User should replace with their username
const GITHUB_USERNAME = "arka-ui";

interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
        url: string;
    };
    payload: {
        commits?: Array<{
            message: string;
            sha: string;
        }>;
        action?: string;
        ref?: string;
        ref_type?: string;
    };
    created_at: string;
}

interface GroupedEvent extends GitHubEvent {
    count: number;
}

const fetcher = async (url: string): Promise<GitHubEvent[]> => {
    const res = await fetch(url);
    if (!res.ok) {
        return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

function EventCard({ event }: { event: GroupedEvent }) {
    const getEventIcon = () => {
        switch (event.type) {
            case "PushEvent":
                return <GitCommit className="w-5 h-5 text-green-400" />;
            case "WatchEvent":
                return <Star className="w-5 h-5 text-yellow-400" />;
            case "CreateEvent":
                return <Zap className="w-5 h-5 text-blue-400" />;
            case "ForkEvent":
                return <GitFork className="w-5 h-5 text-purple-400" />;
            default:
                return <Github className="w-5 h-5 text-gray-400" />;
        }
    };

    const getEventDescription = () => {
        switch (event.type) {
            case "PushEvent":
                return `Pushed ${event.payload.commits?.length || 1} commit(s) to`;
            case "WatchEvent":
                return "Starred repository";
            case "CreateEvent":
                return `Created ${event.payload.ref_type || "repository"}`;
            case "ForkEvent":
                return "Forked repository";
            default:
                return "Contributed to";
        }
    };

    const formattedDate = new Date(event.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const repoName = event.repo.name.replace(`${GITHUB_USERNAME}/`, "");

    return (
        <motion.a
            href={`https://github.com/${event.repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-card/20 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {event.count > 1 && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                        <Layers className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium text-primary">+{event.count - 1}</span>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors">
                            {getEventIcon()}
                        </div>
                        <span className="text-xs text-white/40 font-mono">{formattedDate}</span>
                    </div>
                    {event.count === 1 && (
                        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                    )}
                </div>

                <div className="mb-2">
                    <div className="text-sm text-gray-400 mb-1">{getEventDescription()}</div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                        {repoName}
                    </h3>
                </div>

                {event.type === "PushEvent" && event.payload.commits && (
                    <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-start gap-2">
                            <Code className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-400 font-mono line-clamp-2">
                                {event.payload.commits[0].message}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Visual stack effect for multiple items */}
            {event.count > 1 && (
                <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-2xl border border-white/5 bg-card/20 opacity-50" />
            )}
        </motion.a>
    );
}

const groupEvents = (events: GitHubEvent[]): GroupedEvent[] => {
    if (!Array.isArray(events)) return [];

    const groupedMap = new Map<string, GroupedEvent>();
    const result: GroupedEvent[] = [];

    events.forEach(event => {
        const key = `${event.type}-${event.repo.name}`;

        if (groupedMap.has(key)) {
            const existing = groupedMap.get(key)!;
            existing.count += 1;
            // Keep the existing (latest) event as the display one, just increment count
        } else {
            const newGroup: GroupedEvent = { ...event, count: 1 };
            groupedMap.set(key, newGroup);
            result.push(newGroup);
        }
    });

    return result;
};

export default function GithubStats() {
    // Increase limit to get more potential duplicates to group
    const { data: events, error } = useSWR<GitHubEvent[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=20`,
        fetcher
    );

    if (error) return null;

    const groupedEvents = groupEvents(events || []).slice(0, 6);

    return (
        <section className="py-20 container mx-auto px-4" id="recent-activity">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-6">
                    <Github className="w-4 h-4" />
                    <span>Live Git Stream</span>
                </div>
                <BlueprintWrapper
                    label="GIT_STREAM"
                    description="Live GitHub Activity Feed"
                    direction="bottom"
                    techSpecs={{
                        "API": "GitHub Events",
                        "Grouped": "True"
                    }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                        Recent Activity
                    </h2>
                </BlueprintWrapper>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Real-time feed of my latest code contributions, creates, and stars.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    );
}
