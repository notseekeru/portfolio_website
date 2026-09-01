import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import personalData from "../data/personalData";
import { GitHubIcon } from "./icons/Icons";
import { useInView } from "../hooks/useInView";
import { loadBlogs, type BlogPost } from "../utils/blogLoader";
import type { ProjectItem } from "../data/personalData";

import { SiReact, SiTerraform, SiGrafana, SiAnsible, SiRaspberrypi, SiNixos } from "react-icons/si";
import { FaJava, FaGolang, FaLock } from "react-icons/fa6";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
    SiReact,
    SiTerraform,
    SiGrafana,
    SiAnsible,
    FaJava,
    FaGolang,
    FaLock,
    SiRaspberrypi,
    SiNixos,
};

export default function Projects() {
    const { ref: sectionRef, inView: sectionInView } = useInView();
    const { ref: headerRef, inView: headerInView } = useInView();
    const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

    return (
        <div id="projects" ref={sectionRef} className={`py-16 sm:py-20 lg:py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div ref={headerRef} className={`transition-all duration-500 mb-16 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                    <span className="font-mono text-xs tracking-widest text-accent">01 / WORK</span>
                    <h1 className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-5">Projects</h1>
                    <p className="text-muted max-w-lg">Things I've built, broken, and learned from.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {personalData.projects.map((project, i) => (
                        <ProjectCard key={project.title} project={project} index={i} onOpen={() => setActiveProject(project)} />
                    ))}
                </div>
            </div>

            {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectItem;
    index: number;
    onOpen: () => void;
}

function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
    return (
        <article
            className="animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 0.07}s` }}
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
                            <span className="ml-2 flex-1 truncate rounded-sm bg-surface px-2 py-0.5 text-[10px] font-mono text-muted">{project.link ? project.link.replace(/https?:\/\//, "").split("/")[0] : project.title}</span>
                            <span className="flex shrink-0 items-center gap-1 pl-1">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-6 items-center justify-center rounded-sm px-1.5 text-muted hover:text-accent transition-colors" title="GitHub repository">
                                        <GitHubIcon size={13} />
                                    </a>
                                )}
                                {project.favorite && (
                                    <span className="flex h-6 items-center px-1 text-amber" title="Personal favorite">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="relative aspect-video bg-ink/40 overflow-hidden flex items-center justify-center">
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

                        {project.link && (
                            <div className="mt-4 flex items-center gap-1 text-accent text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Visit project
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function ProjectIcon({ icon, size = 28 }: { icon: string; size?: number }) {
    const Icon = iconMap[icon];
    if (Icon) return <Icon size={size} />;
    return null;
}

interface ProjectModalProps {
    project: ProjectItem;
    onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);

    // Lock page scroll while the modal is open
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
            <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md animate-fade-in cursor-default" />
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border bg-surface rounded-2xl shadow-2xl animate-fade-in-up" role="dialog" aria-modal="true" aria-label={project.title}>
                <div className="relative overflow-hidden border-b border-border">
                    {/* browser chrome */}
                    <div className="flex items-center gap-2 bg-ink/60 px-4 h-9">
                        <span className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                            <span className="h-2.5 w-2.5 rounded-full bg-muted/50" />
                        </span>
                        <span className="ml-3 flex-1 truncate rounded-sm bg-surface px-3 py-1 text-xs font-mono text-muted">{project.link ? project.link.replace(/https?:\/\//, "") : project.title}</span>
                    </div>
                    <div className="relative h-80 lg:h-[32rem] bg-ink/60 overflow-hidden flex items-center justify-center">
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
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 group-hover/link:text-accent shrink-0 transition-colors" aria-hidden="true">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6 pt-6 border-t border-border">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent text-base font-mono hover:underline underline-offset-2">
                                Visit project
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-zinc-300 text-base font-mono hover:text-accent transition-colors">
                                <GitHubIcon size={16} />
                                Source
                            </a>
                        )}
                    </div>
                </div>
            </div>
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
