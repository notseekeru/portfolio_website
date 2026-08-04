import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import personalData from "../data/personalData";

const navLinks = [
    { label: "Home", path: "/#home" },
    { label: "Infrastructure", path: "/#infrastructure-diagram" },
    { label: "Projects", path: "/#projects" },
    { label: "Blog", path: "/#blog" },
    { label: "Contact", path: "/#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const prevLocation = useRef(location);
    useEffect(() => {
        if (prevLocation.current !== location) {
            setMenuOpen(false);
            prevLocation.current = location;
        }
    }, [location]);

    useEffect(() => {
        const sectionIds = navLinks.map((l) => l.path.replace("/#", "")).filter((id) => id !== "");
        const observers: IntersectionObserver[] = [];

        for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (!el) continue;
            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            window.history.replaceState({}, "", `/#${id}`);
                        }
                    }
                },
                { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
            );
            observer.observe(el);
            observers.push(observer);
        }

        return () => {
            for (const o of observers) o.disconnect();
        };
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0d0d0d]/90 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    onClick={() => {
                        if (location.pathname === "/") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                    className="font-mono text-sm font-medium text-accent tracking-widest uppercase"
                >
                    {personalData.name.split(" ")[0]}
                    <span className="text-zinc-500">.</span>
                    {personalData.name.split(" ")[1]}
                </Link>

                <ul className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                onClick={
                                    link.path.startsWith("/#") && location.pathname === "/"
                                        ? (e) => {
                                              e.preventDefault();
                                              const targetId = link.path.substring(2);
                                              const el = document.getElementById(targetId);
                                              if (el) {
                                                  el.scrollIntoView({ behavior: "smooth" });
                                                  window.history.pushState({}, "", link.path);
                                              }
                                          }
                                        : undefined
                                }
                                className={"text-sm font-medium transition-colors duration-200 text-zinc-400 hover:text-zinc-100"}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <a href={`mailto:${personalData?.email}`} className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 border border-accent/30 text-accent rounded-md hover:bg-accent/10 glow-accent-hover transition-all duration-200">
                    Email Me
                </a>

                <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
                    <span className={`block w-5 h-0.5 bg-zinc-300 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-zinc-300 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-zinc-300 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </nav>

            <div className={`md:hidden bg-[#0d0d0d]/95 backdrop-blur-md border-b border-border overflow-hidden transition-all duration-200 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                onClick={(e) => {
                                    if (link.path.startsWith("/#") && location.pathname === "/") {
                                        e.preventDefault();
                                        const targetId = link.path.substring(2);
                                        const el = document.getElementById(targetId);
                                        if (el) {
                                            el.scrollIntoView({ behavior: "smooth" });
                                            window.history.pushState({}, "", link.path);
                                        }
                                        setMenuOpen(false);
                                    }
                                }}
                                className={"block text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-100"}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
