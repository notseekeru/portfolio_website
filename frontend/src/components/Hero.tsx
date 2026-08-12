import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import personalData from "../data/personalData";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons/Icons";
import type { SyntheticEvent } from "react";

export default function Hero() {
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
                    <h2 className="text-xl lg:text-2xl font-light text-zinc-400 mb-4">{personalData.title}</h2>

                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6),0_0_14px_rgba(0,217,255,0.6)]" />
                        <span className="text-xs font-mono text-zinc-400 tracking-wide">{personalData.status}</span>
                    </div>

                    <p className="text-zinc-500 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10">{personalData.bio}</p>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <Link to="/#contact" className="px-6 py-3 bg-accent text-[#0d0d0d] font-semibold text-sm rounded-md hover:bg-accent/90 transition-all duration-200">
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

                <div className="flex-shrink-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="relative w-56 h-56 lg:w-72 lg:h-72">
                        <div className="relative w-full h-full rounded-2xl border border-gradient overflow-hidden">
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
                </div>
            </div>

            <div className="relative z-10 flex justify-center pb-8 -mt-4">
                <Link to="/#projects" className="flex flex-col items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300 transition-colors">
                    Scroll
                    <svg className="animate-bounce" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </Link>
            </div>
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
