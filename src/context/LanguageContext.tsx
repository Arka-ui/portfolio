"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the supported languages
export type LanguageCode = "en" | "fr" | "es" | "de";

export interface Language {
    code: LanguageCode;
    name: string;
    flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

// Dictionary Structure
const DICTIONARY = {
    en: {
        nav: {
            home: "Home",
            about: "About",
            projects: "Projects",
            contact: "Contact",
            cmd_placeholder: "Type a command or search...",
            cmd_alliance: "ALLIANCE PROTOCOL ENGAGED..."
        },
        hero: {
            role: "Full Stack Developer",
            description: "I build pixel-perfect, engaging, and accessible digital experiences.",
            cta_projects: "View Projects",
            cta_contact: "Contact Me"
        },
        about: {
            title: "Experience & Education",
            subtitle: "My professional journey and academic background.",
            work: "Work",
            education: "Education",
            project: "Project"
        },
        projects: {
            title: "Featured Projects",
            subtitle: "A selection of projects that I'm proud of.",
            view_project: "View Project",
            source_code: "Source Code"
        },
        contact: {
            title: "Get in Touch",
            subtitle: "Have a project in mind or just want to say hi?",
            name: "Name",
            email: "Email",
            message: "Message",
            send: "Send Message",
            sending: "Sending...",
            placeholder_name: "John Doe",
            placeholder_email: "john@example.com",
            placeholder_message: "Your message here...",
            success_title: "Message Sent!",
            success_desc: "I'll get back to you as soon as possible."
        },
        footer: {
            rights: "All rights reserved.",
            built_with: "Built with Next.js, Tailwind & Framer Motion"
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            about: "À propos",
            projects: "Projets",
            contact: "Contact",
            cmd_placeholder: "Tapez une commande ou cherchez...",
            cmd_alliance: "PROTOCOLE ALLIANCE ACTIVÉ..."
        },
        hero: {
            role: "Développeur Full Stack",
            description: "Je conçois des expériences numériques parfaites, engageantes et accessibles.",
            cta_projects: "Voir mes projets",
            cta_contact: "Me contacter"
        },
        about: {
            title: "Expérience & Formation",
            subtitle: "Mon parcours professionnel et académique.",
            work: "Expérience",
            education: "Formation",
            project: "Projet"
        },
        projects: {
            title: "Projets à la Une",
            subtitle: "Une sélection de projets dont je suis fier.",
            view_project: "Voir le projet",
            source_code: "Code Source"
        },
        contact: {
            title: "Me Contacter",
            subtitle: "Vous avez un projet en tête ou voulez simplement dire bonjour ?",
            name: "Nom",
            email: "Email",
            message: "Message",
            send: "Envoyer",
            sending: "Envoi...",
            placeholder_name: "Jean Dupont",
            placeholder_email: "jean@exemple.com",
            placeholder_message: "Votre message ici...",
            success_title: "Message Envoyé !",
            success_desc: "Je vous répondrai dès que possible."
        },
        footer: {
            rights: "Tous droits réservés.",
            built_with: "Conçu avec Next.js, Tailwind & Framer Motion"
        }
    },
    es: {
        nav: {
            home: "Inicio",
            about: "Sobre mí",
            projects: "Proyectos",
            contact: "Contacto",
            cmd_placeholder: "Escribe un comando o busca...",
            cmd_alliance: "PROTOCOLO ALIANZA ACTIVADO..."
        },
        hero: {
            role: "Desarrollador Full Stack",
            description: "Creo experiencias digitales perfectas, atractivas y accesibles.",
            cta_projects: "Ver Proyectos",
            cta_contact: "Contactar"
        },
        about: {
            title: "Experiencia y Educación",
            subtitle: "Mi trayectoria profesional y académica.",
            work: "Trabajo",
            education: "Educación",
            project: "Proyecto"
        },
        projects: {
            title: "Proyectos Destacados",
            subtitle: "Una selección de proyectos de los que estoy orgulloso.",
            view_project: "Ver Proyecto",
            source_code: "Código Fuente"
        },
        contact: {
            title: "Contáctame",
            subtitle: "¿Tienes un proyecto en mente o solo quieres saludar?",
            name: "Nombre",
            email: "Correo",
            message: "Mensaje",
            send: "Enviar",
            sending: "Enviando...",
            placeholder_name: "Juan Pérez",
            placeholder_email: "juan@ejemplo.com",
            placeholder_message: "Tu mensaje aquí...",
            success_title: "¡Mensaje Enviado!",
            success_desc: "Te responderé lo antes posible."
        },
        footer: {
            rights: "Todos los derechos reservados.",
            built_with: "Construido con Next.js, Tailwind & Framer Motion"
        }
    },
    de: {
        nav: {
            home: "Startseite",
            about: "Über mich",
            projects: "Projekte",
            contact: "Kontakt",
            cmd_placeholder: "Befehl eingeben oder suchen...",
            cmd_alliance: "ALLIANZ-PROTOKOLL AKTIVIERT..."
        },
        hero: {
            role: "Full Stack Entwickler",
            description: "Ich entwickle pixelgenaue, ansprechende und barrierefreie digitale Erlebnisse.",
            cta_projects: "Projekte ansehen",
            cta_contact: "Kontaktieren"
        },
        about: {
            title: "Erfahrung & Ausbildung",
            subtitle: "Mein beruflicher Werdegang und akademischer Hintergrund.",
            work: "Arbeit",
            education: "Ausbildung",
            project: "Projekt"
        },
        projects: {
            title: "Ausgewählte Projekte",
            subtitle: "Eine Auswahl an Projekten, auf die ich stolz bin.",
            view_project: "Projekt ansehen",
            source_code: "Quellcode"
        },
        contact: {
            title: "Kontakt aufnehmen",
            subtitle: "Hast du ein Projekt im Sinn oder möchtest einfach Hallo sagen?",
            name: "Name",
            email: "E-Mail",
            message: "Nachricht",
            send: "Senden",
            sending: "Senden...",
            placeholder_name: "Max Mustermann",
            placeholder_email: "max@beispiel.de",
            placeholder_message: "Deine Nachricht hier...",
            success_title: "Nachricht Gesendet!",
            success_desc: "Ich werde mich so schnell wie möglich bei dir melden."
        },
        footer: {
            rights: "Alle Rechte vorbehalten.",
            built_with: "Erstellt mit Next.js, Tailwind & Framer Motion"
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(SUPPORTED_LANGUAGES[0]);

    // Load saved language on mount
    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) {
            const found = SUPPORTED_LANGUAGES.find(l => l.code === savedLang);
            if (found) setLanguageState(found);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang.code);
        // Optional: Update HTML lang attribute
        document.documentElement.lang = lang.code;
    };

    // Translation function
    // Usage: t("nav.home") or t("hero.role")
    const t = (key: string): string => {
        const keys = key.split(".");
        let value: any = DICTIONARY[language.code];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // Fallback to English if key missing
                let fallback: any = DICTIONARY["en"];
                for (const fk of keys) {
                    if (fallback && fallback[fk]) fallback = fallback[fk];
                    else return key; // Return key if absolutely nothing found
                }
                return fallback as string;
            }
        }
        return value as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
}
