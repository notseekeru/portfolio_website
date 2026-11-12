import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import personalData from "../data/personalData";
import { fade, maskRise, pop, slideIn, stagger, revealViewport } from "../utils/reveal";
import { GitHubIcon } from "./icons/Icons";
import { loadBlogs, type BlogPost } from "../utils/blogLoader";
import type { ProjectItem } from "../data/personalData";

import { SiReact, SiTerraform, SiGrafana, SiAnsible, SiRaspberrypi, SiNixos, SiC, SiN8N } from "react-icons/si";
import { FaJava, FaGolang, FaLock, FaAws } from "react-icons/fa6";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
    SiReact,
    SiTerraform,
    SiGrafana,
    SiAnsible,
    FaJava,
    FaGolang,
    FaLock,
    FaAws,
    SiRaspberrypi,
    SiNixos,
    SiC,
    SiN8N,
};

const displayAddress = (p: ProjectItem) => (p.link ?? p.github ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function Projects() {
    const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

    return (
        <div id="projects" className="py-16 sm:py-20 lg:py-24">
            <div className="max-w-shell mx-auto px-6 sm:px-8 lg:px-12">
                <m.div variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={revealViewport} className="mb-16">
                    <m.span variants={slideIn} className="font-mono text-xs tracking-widest text-accent">
                        01 / WORK
                    </m.span>
                    <m.h1 variants={maskRise} className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-5">
                        Projects
                    </m.h1>
                    <m.p variants={fade} className="text-muted max-w-lg">
                        Things I've built, broken, and learned from.
                    </m.p>
                </m.div>

                <m.div variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={revealViewport} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {personalData.projects.map((project) => (
                        <ProjectCard key={project.title} project={project} onOpen={() => setActiveProject(project)} />
                    ))}
                </m.div>
            </div>

            <AnimatePresence>{activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}</AnimatePresence>
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectItem;
    onOpen: () => void;
}

function ProjectCard({ project, onOpen }: ProjectCardProps) {
    const address = displayAddress(project);
    const actions: { href?: string; label: string }[] = [];
    if (project.link) actions.push({ href: project.link, label: "Live site" });
    if (project.github) actions.push({ href: project.github, label: "Source code" });
    // No live target and no repo is a state, not a gap: the bar still carries the card's artifact.
    const cells = actions.length ? actions : [{ label: project.blogs?.length ? "Writeup" : "Details" }];
    const cellClass = (i: number) => `flex items-center gap-2 px-5 py-3 font-mono text-xs transition-colors hover:bg-ink/40 ${i === 0 ? "text-accent" : "text-muted hover:text-accent"}`;

    return (
        <m.article
            variants={pop}
            whileHover={{ y: -4 }}
            className="cursor-pointer min-w-0 w-full"
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
            aria-label={`Open ${project.title}`}
        >
            <div className="group relative flex flex-col border border-border bg-surface hover:border-accent/40 transition-colors duration-300 h-full">
                <div className="flex flex-col h-full w-full text-left cursor-pointer">
                    <div className="relative">
                        {/* browser chrome */}
                        <div className="flex items-center gap-2 border-b border-border bg-ink/60 pl-3 pr-1 h-8">
                            <span className="flex gap-1.5 shrink-0">
                                <span className="h-2 w-2 rounded-full bg-amber/70" />
                                <span className="h-2 w-2 rounded-full bg-accent/60" />
                                <span className="h-2 w-2 rounded-full bg-muted/50" />
                            </span>
                            {address ? <span className="ml-2 min-w-0 flex-1 truncate rounded-sm bg-surface px-2 py-0.5 text-[10px] font-mono text-muted">{address}</span> : <span className="flex-1" />}
                            {project.favorite && (
                                <span className="flex h-6 shrink-0 items-center px-1 text-amber" title="Personal favorite">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <div className="relative aspect-video bg-ink/40 overflow-hidden flex items-center justify-center">
                            {project.status && <span className="absolute left-3 top-3 z-10 border border-accent/40 bg-ink/80 px-2 py-0.5 text-[10px] font-mono text-accent">{project.status}</span>}
                            <span className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center border border-border bg-ink/80 text-muted group-hover:border-accent/40 group-hover:text-accent transition-colors" aria-hidden="true">
                                <ChevronRight size={12} />
                            </span>
                            {project.video ? (
                                <video src={project.video} autoPlay muted loop playsInline className="h-full w-full object-contain" />
                            ) : project.image ? (
                                <img src={project.image} alt={project.title} className="h-full w-full object-contain" />
                            ) : (
                                <div className="text-5xl text-muted/40 group-hover:text-accent/60 transition-colors duration-300 select-none">{project.icon ? <ProjectIcon icon={project.icon} /> : <span className="text-5xl font-display text-muted/40">{project.title.charAt(0)}</span>}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <ProjectTitle project={project} />
                        <p className="text-muted text-sm leading-relaxed flex-1 line-clamp-4">{project.description}</p>

                        {project.techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {project.techStack.slice(0, 4).map((tech) => (
                                    <span key={tech} className="text-[10px] font-mono text-accent/80 bg-ink/60 border border-border px-2 py-0.5">
                                        {tech}
                                    </span>
                                ))}
                                {project.techStack.length > 4 && <span className="text-[10px] font-mono text-accent/70">+{project.techStack.length - 4}</span>}
                            </div>
                        )}

                        <div className={`-mx-5 -mb-5 mt-4 grid border-t border-border ${cells.length > 1 ? "grid-cols-2 divide-x divide-border" : "grid-cols-1"}`}>
                            {cells.map((cell, i) =>
                                cell.href ? (
                                    <a key={cell.label} href={cell.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={cellClass(i)}>
                                        {cell.label === "Source code" ? <GitHubIcon size={13} /> : <ExternalArrow size={12} />}
                                        {cell.label}
                                    </a>
                                ) : (
                                    <button key={cell.label} type="button" onClick={onOpen} className={`${cellClass(i)} text-left`}>
                                        <ChevronRight size={13} />
                                        {cell.label}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </m.article>
    );
}

function ProjectIcon({ icon, size = 28 }: { icon: string; size?: number }) {
    const Icon = iconMap[icon];
    if (Icon) return <Icon size={size} />;
    return null;
}

function ExternalArrow({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
    );
}

function ChevronRight({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

interface ProjectModalProps {
    project: ProjectItem;
    onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
    const address = displayAddress(project);

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    useEffect(() => {
        const slugs = project.blogs;
        if (!slugs?.length) return;
        let cancelled = false;
        loadBlogs().then((all) => {
            if (cancelled) return;
            const ordered = slugs.map((slug) => all.find((b) => b.slug === slug)).filter((b): b is BlogPost => Boolean(b));
            setRelatedBlogs(ordered);
        });
        return () => {
            cancelled = true;
        };
    }, [project.blogs]);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <m.button type="button" aria-label="Close" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md cursor-default" />
            <m.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border bg-surface rounded-2xl shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label={project.title}
            >
                <div className="relative overflow-hidden border-b border-border">
                    {/* browser chrome */}
                    <div className="flex items-center gap-2 bg-ink/60 px-4 h-9">
                        <span className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                            <span className="h-2.5 w-2.5 rounded-full bg-muted/50" />
                        </span>
                        {address ? <span className="ml-3 min-w-0 flex-1 truncate rounded-sm bg-surface px-3 py-1 text-xs font-mono text-muted">{address}</span> : <span className="flex-1" />}
                    </div>
                    <div className="relative h-56 sm:h-72 lg:h-[32rem] bg-ink/60 overflow-hidden flex items-center justify-center">
                        {project.status && <span className="absolute left-4 top-4 z-10 border border-accent/40 bg-ink/80 px-2.5 py-1 text-xs font-mono text-accent">{project.status}</span>}
                        {project.video ? (
                            <video src={project.video} autoPlay muted loop playsInline className="h-full w-full object-contain" />
                        ) : project.image ? (
                            <img src={project.image} alt={project.title} className="h-full w-full object-contain" />
                        ) : (
                            <div className="text-6xl text-muted/40 select-none">{project.icon ? <ProjectIcon icon={project.icon} size={48} /> : <span className="text-6xl font-display text-muted/40">{project.title.charAt(0)}</span>}</div>
                        )}
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display text-bone text-2xl leading-snug">{project.title}</h3>
                        <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 text-zinc-500 hover:text-zinc-100 transition-colors p-1">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-muted text-base leading-relaxed mb-6">{project.description}</p>

                    {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.techStack.map((tech) => (
                                <span key={tech} className="text-xs font-mono text-accent/80 bg-ink/60 border border-border px-2.5 py-1">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {relatedBlogs.length > 0 && (
                        <div className="mb-8">
                            <h4 className="font-mono text-xs tracking-widest text-accent mb-4">RELATED POSTS</h4>
                            <div className="flex flex-col gap-2">
                                {relatedBlogs.map((blog) => (
                                    <Link key={blog.slug} to={`/blog/${blog.slug}`} className="group/link flex items-center justify-between gap-4 px-4 py-3 border border-border bg-surface/40 hover:border-accent/40 transition-colors">
                                        <div>
                                            <div className="text-sm text-bone group-hover/link:text-accent transition-colors">{blog.title}</div>
                                            {blog.date && <div className="text-xs text-zinc-600 font-mono mt-0.5">{new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</div>}
                                        </div>
                                        <span className="text-zinc-600 group-hover/link:text-accent transition-colors">
                                            <ChevronRight size={14} />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {(project.link || project.github) && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-border">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent text-base font-mono hover:underline underline-offset-2">
                                    <ExternalArrow size={16} />
                                    Live site
                                </a>
                            )}
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted text-base font-mono hover:text-accent transition-colors">
                                    <GitHubIcon size={16} />
                                    Source code
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </m.div>
        </div>,
        document.body,
    );
}

function ProjectTitle({ project }: { project: ProjectItem }) {
    return (
        <h3 className="font-display text-bone mb-2 group-hover:text-accent transition-colors duration-200 leading-snug flex items-center gap-2">
            {project.icon && (
                <span className="text-accent/80 group-hover:text-accent shrink-0">
                    <ProjectIcon icon={project.icon} size={22} />
                </span>
            )}
            <span>{project.title}</span>
        </h3>
    );
}
