import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import personalData from "../data/personalData";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons/Icons";
import type { SyntheticEvent } from "react";
import type { IconType } from "react-icons";
import {
    SiJavascript,
    SiPython,
    SiTypescript,
    SiCplusplus,
    SiReact,
    SiTailwindcss,
    SiExpress,
    SiNodedotjs,
    SiGnubash,
    SiMermaid,
    SiGithubactions,
    SiAnsible,
    SiNginx,
    SiCloudflare,
    SiGrafana,
    SiPrometheus,
    SiOpentelemetry,
    SiTerraform,
    SiRaspberrypi,
    SiDigitalocean,
    SiKubernetes,
    SiArgo,
    SiTailscale,
    SiTrivy,
    SiNeovim,
    SiTmux,
    SiOpenjdk,
    SiVite,
    SiNixos,
} from "react-icons/si";
import { FaJava, FaGitAlt, FaDocker, FaServer, FaCode, FaGolang, FaLock } from "react-icons/fa6";

const iconMap: Record<string, IconType> = {
    SiJavascript,
    SiPython,
    SiTypescript,
    SiCplusplus,
    SiReact,
    SiTailwindcss,
    SiExpress,
    SiNodedotjs,
    SiGnubash,
    SiMermaid,
    SiGithubactions,
    SiAnsible,
    SiNginx,
    SiCloudflare,
    FaJava,
    FaGitAlt,
    FaDocker,
    FaServer,
    FaGolang,
    FaLock,
    SiGrafana,
    SiPrometheus,
    SiOpentelemetry,
    SiTerraform,
    SiRaspberrypi,
    SiDigitalocean,
    SiKubernetes,
    SiArgo,
    SiTailscale,
    SiTrivy,
    SiNeovim,
    SiTmux,
    SiOpenjdk,
    SiVite,
    SiNixos,
};

export default function Hero() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Lock page scroll while the modal is open
    useEffect(() => {
        if (!activeCategory) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [activeCategory]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setActiveCategory(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const stats = useMemo(
        () => [
            {
                value: personalData.projects.length,
                label: "Projects & Infrastructure",
                accent: true,
                items: [
                    ...personalData.projects.map((p) => ({
                        name: p.title,
                        icon: p.icon || "FaCode",
                        summary: p.description,
                        implementation: `Stack: ${p.techStack.join(", ")}`,
                    })),
                ],
            },
            {
                value: personalData.skills.tools.length,
                label: "Tools",
                accent: true,
                items: personalData.skills.tools,
            },
            {
                value: personalData.skills.frameworks.length,
                label: "Frameworks",
                accent: true,
                items: personalData.skills.frameworks,
            },
            {
                value: personalData.skills.languages.length,
                label: "Languages",
                accent: true,
                items: personalData.skills.languages,
            },
        ],
        [],
    );

    return (
        <section className="relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-24 min-h-[calc(100vh-6rem)] flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left animate-hero-in">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-4">
                        <span className="text-zinc-100">Hi, I'm </span>
                        <span className="text-gradient">{personalData.name}</span>
                    </h1>
                    <h2 className="text-xl lg:text-2xl font-light text-zinc-400 mb-6">{personalData.title}</h2>

                    <p className="text-zinc-500 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10">{personalData.bio}</p>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <Link to="/#contact" className="px-6 py-3 bg-accent text-[#0d0d0d] font-semibold text-sm rounded-md hover:bg-accent/90 glow-accent transition-all duration-200">
                            Contact Me
                        </Link>
                        <Link to="https://github.com/notseekeru" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-border text-zinc-300 font-medium text-sm rounded-md hover:border-zinc-500 hover:text-zinc-100 transition-all duration-200">
                            View Projects
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                        <div className="flex items-center gap-6">
                            <a href={personalData.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-100 transition-colors" aria-label="GitHub">
                                <GitHubIcon size={20} />
                            </a>
                            <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-100 transition-colors" aria-label="LinkedIn">
                                <LinkedInIcon size={20} />
                            </a>
                            <a href={`mailto:${personalData.email}`} className="text-zinc-500 hover:text-zinc-100 transition-colors" aria-label="Email">
                                <MailIcon size={20} />
                            </a>
                        </div>
                        <LiveClock />
                    </div>
                </div>

                <div className="flex-shrink-0 animate-fade-in-up flex flex-col items-center gap-8" style={{ animationDelay: "0.2s" }}>
                    <div className="relative w-56 h-56 lg:w-72 lg:h-72">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-accentPurple/20 blur-xl" />
                        <div className="relative w-full h-full rounded-2xl border border-gradient overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accentPurple/5" />
                            <img
                                src={personalData.profilePicture}
                                alt={personalData.name}
                                className="w-full h-full object-cover"
                                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                    const image = e.currentTarget;
                                    image.style.display = "none";
                                    const fallback = image.nextElementSibling as HTMLDivElement | null;
                                    if (fallback) {
                                        fallback.style.display = "flex";
                                    }
                                }}
                            />
                            <div className="hidden w-full h-full items-center justify-center text-5xl font-bold text-gradient" style={{ display: "none" }}>
                                {personalData.name.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-xl border border-border bg-surface flex flex-col items-center justify-center">
                            <img className="w-12 h-12" src="/ph.png" alt="PH" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
                        {stats.map((stat) => (
                            <button key={stat.label} type="button" onClick={() => setActiveCategory(stat.label)} className="relative w-full text-left border border-border bg-surface rounded-xl p-4 transition-colors duration-300 group hover:border-accent/40 cursor-pointer">
                                <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900/60 text-zinc-500 transition-all duration-300 group-hover:text-accent group-hover:rotate-90">
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </span>
                                <div className={`text-2xl font-bold mb-1 ${stat.accent ? "text-gradient" : "text-zinc-100"}`}>{stat.value}</div>
                                <div className="text-[11px] text-zinc-500 font-medium leading-snug group-hover:text-accent transition-colors">{stat.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {activeCategory &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <button type="button" aria-label="Close" onClick={() => setActiveCategory(null)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm animate-fade-in cursor-default" />
                        <div className="relative w-full max-w-4xl border border-zinc-800 bg-zinc-950 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[85vh] overflow-y-auto overflow-x-hidden animate-fade-in-up" role="dialog" aria-modal="true" aria-label="Category details">
                            <div className="flex justify-between items-center sticky top-0 bg-zinc-950/90 backdrop-blur-[2px] py-2 px-6 z-10 border-b border-zinc-800/50">
                                <h3 id="modal-title" className="text-2xl font-bold text-zinc-100">
                                    {activeCategory} Details
                                </h3>
                                <button type="button" onClick={() => setActiveCategory(null)} aria-label="Close" className="shrink-0 text-zinc-500 hover:text-zinc-100 transition-colors p-1">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-6 pb-6 pt-4">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {stats
                                        .find((s) => s.label === activeCategory)
                                        ?.items.map((item: { name: string; icon: string; summary: string; implementation: string }) => {
                                            const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : FaCode;
                                            return (
                                                <div key={item.name} className="p-4 border border-zinc-800/60 rounded-lg bg-zinc-900/40 hover:border-accent/30 transition-colors flex flex-col gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-accent text-xl">
                                                            <Icon />
                                                        </div>
                                                        <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                                                    </div>
                                                    {item.summary && <p className="text-xs text-zinc-400">{item.summary}</p>}
                                                    {item.implementation && (
                                                        <div className="mt-1 pt-2 border-t border-zinc-800/60">
                                                            <p className="text-xs text-zinc-500">
                                                                <span className="text-zinc-600 font-mono mr-1">Impl:</span>
                                                                {item.implementation}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </section>
    );
}

function LiveClock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Manila",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            setTime(`${formatter.format(now)} (UTC+8)`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    return (
        <div className="text-zinc-500 text-xs font-mono flex items-center gap-2 border-l border-zinc-800 pl-6 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            {time}
        </div>
    );
}
