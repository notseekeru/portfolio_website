import { Link } from "react-router-dom";
import * as m from "motion/react-m";
import personalData from "../data/personalData";
import { fade, revealViewport, stagger } from "../utils/reveal";
import { GitHubIcon, LinkedInIcon } from "./icons/Icons";

export default function Footer() {
    return (
        <footer className="border-t border-border py-10">
            <m.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={revealViewport} className="max-w-shell mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <m.div variants={fade} className="text-center md:text-left">
                    <p className="font-serif text-bone">
                        {personalData.name}
                        <span className="text-muted mx-2">·</span>
                        <span className="text-muted text-sm">{personalData.title}</span>
                    </p>
                    <p className="text-xs text-muted mt-1">{new Date().getFullYear()} · Built with React + Vite + Tailwind</p>
                </m.div>

                <m.nav variants={fade} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    {[
                        { label: "Home", to: "/#home" },
                        { label: "Projects", to: "/#projects" },
                        { label: "Infrastructure", to: "/#infrastructure-diagram" },
                        { label: "Blog", to: "/#blog" },
                        { label: "Contact", to: "/#contact" },
                    ].map((link) => (
                        <Link key={link.to} to={link.to} className="text-xs text-muted hover:text-accent transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </m.nav>

                <m.div variants={fade} className="flex items-center gap-4">
                    <a href={personalData.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="GitHub">
                        <GitHubIcon />
                    </a>
                    <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="LinkedIn">
                        <LinkedInIcon />
                    </a>
                </m.div>
            </m.div>
        </footer>
    );
}
