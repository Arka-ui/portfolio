"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, FolderGit2 } from "lucide-react";
import useSWR from "swr";
import BlueprintWrapper from "@/components/BlueprintWrapper";

// User can replace this with their own JSON Resume Gist URL
const RESUME_URL = "https://gist.githubusercontent.com/Arka-ui/raw/resume.json";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        if (res.status === 400 || res.status === 404) return null;
        throw new Error('An error occurred while fetching the data.');
    }
    return res.json();
};

interface Job {
    position: string;
    name: string;
    startDate: string;
    endDate?: string;
    summary: string;
}

interface Education {
    area: string;
    institution: string;
    startDate: string;
    endDate: string;
    studyType: string;
    score?: string;
}

interface ResumeData {
    work?: Job[];
    education?: Education[];
}

const fallbackExperience = [
    {
        type: "work",
        title: "Propriétaire & Co-fondateur",
        company: "EclozionMC",
        period: "Octobre 2025 - Présent",
        description: "Développement d'un serveur Minecraft avec Nexos (rencontré en cours). Site web : eclozionmc.ovh - Serveur en préparation"
    },
    {
        type: "project",
        title: "Développeur de plugins Minecraft",
        company: "Projets Personnels",
        period: "Octobre 2025",
        description: "Création de plugins Minecraft en Java avant les vacances d'Halloween"
    },
    {
        type: "work",
        title: "Développeur d'application iOS",
        company: "Mairie de Cambrai (Stage)",
        period: "Juin 2025",
        description: "Développement d'une application de news pour la ville de Cambrai en Swift lors d'un stage"
    },
    {
        type: "project",
        title: "Projets Python",
        company: "Projets Personnels",
        period: "2023",
        description: "Développement de divers projets en Python pour renforcer les compétences en programmation"
    },
    {
        type: "education",
        title: "Apprentissage Développement Web",
        company: "Auto-formation",
        period: "Début 2023",
        description: "Initiation au développement web avec HTML et création de premiers projets personnels"
    }
];

export default function Timeline() {
    // const { data, error } = useSWR(RESUME_URL, fetcher);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = null as ResumeData | null; // Fallback to local data until valid Gist URL is provided

    // Transform JSON Resume data to our format if available
    const experience = data ? [
        ...(data.work || []).map((job: Job) => ({
            type: "work",
            title: job.position,
            company: job.name,
            period: `${job.startDate} - ${job.endDate || "Present"}`,
            description: job.summary
        })),
        ...(data.education || []).map((edu: Education) => ({
            type: "education",
            title: edu.area,
            company: edu.institution,
            period: `${edu.startDate} - ${edu.endDate}`,
            description: `${edu.studyType} - ${edu.score || ""}`
        }))
    ].sort((a, b) => new Date(b.period.split(" - ")[0]).getTime() - new Date(a.period.split(" - ")[0]).getTime())
        : fallbackExperience;

    return (
        <section className="py-32 container mx-auto px-4" id="experience">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-center mb-20"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                    Experience & Education
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    My professional journey and academic background.
                </p>
            </motion.div>

            <div className="max-w-4xl mx-auto relative">
                {/* Vertical Line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent transform md:-translate-x-1/2" />

                <div className="space-y-12">
                    {experience.map((item, index) => (

                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Timeline Dot */}
                            <div className={`absolute left-[-8px] md:left-1/2 md:-ml-[8px] top-6 z-10`}>
                                <BlueprintWrapper label="MARKER" description="Milestone Node" direction={index % 2 === 0 ? "left" : "right"}>
                                    <div className={`w-4 h-4 rounded-full border-4 border-background shadow-[0_0_10px_rgba(0,0,0,0.5)] ${item.type === "work" ? "bg-primary shadow-primary/50" : item.type === "education" ? "bg-accent shadow-accent/50" : "bg-green-500 shadow-green-500/50"
                                        }`} />
                                </BlueprintWrapper>
                            </div>

                            {/* Content */}
                            <div className="ml-8 md:ml-0 md:w-1/2 group">
                                <BlueprintWrapper label="DATA_RECORD" description={`${item.type.toUpperCase()} Entry`} direction={index % 2 === 0 ? "right" : "left"}>
                                    <div className={`relative bg-card/20 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${index % 2 === 0 ? "md:text-left" : "md:text-right"
                                        }`}>
                                        <div className={`flex items-center gap-2 mb-4 ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                                            }`}>
                                            <div className={`p-2 rounded-lg bg-white/5 ${item.type === "work" ? "text-primary" : item.type === "education" ? "text-accent" : "text-green-500"}`}>
                                                {item.type === "work" ? (
                                                    <Briefcase className="w-4 h-4" />
                                                ) : item.type === "education" ? (
                                                    <GraduationCap className="w-4 h-4" />
                                                ) : (
                                                    <FolderGit2 className="w-4 h-4" />
                                                )}
                                            </div>
                                            <span className={`text-sm font-bold uppercase tracking-wider ${item.type === "work" ? "text-primary" : item.type === "education" ? "text-accent" : "text-green-500"
                                                }`}>{item.type}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-lg font-medium text-white/60 mb-4">{item.company}</p>

                                        <div className={`flex items-center gap-2 text-muted-foreground text-sm mb-6 ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                                            }`}>
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-mono">{item.period}</span>
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </BlueprintWrapper>
                            </div>

                            {/* Empty space for the other side */}
                            <div className="hidden md:block md:w-1/2" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
