import personalData from "../data/personalData";
import { GitHubIcon } from "./icons/Icons";
import { useInView } from "../hooks/useInView";
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

    return (
        <div id="projects" ref={sectionRef} className={`py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div ref={headerRef} className={`transition-all duration-500 mb-16 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                    <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">Work</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">Projects</h1>
                    <p className="text-zinc-500 max-w-lg">Things I've built, broken, and learned from.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {personalData.projects.map((project, i) => (
                        <ProjectCard key={project.title} project={project} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectItem;
    index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <article className="animate-fade-in-up" style={{ animationDelay: `${index * 0.07}s` }}>
            <div className="group relative flex flex-col border border-border bg-surface rounded-2xl overflow-hidden hover:border-accent/30 glow-accent-hover transition-all duration-300 h-full">
                {/* Clickable card body (when there's a link) */}
                <a href={project.link} target={project.link ? "_blank" : undefined} rel={project.link ? "noopener noreferrer" : undefined} className={`flex flex-col h-full w-full text-left ${project.link ? "cursor-pointer" : "cursor-default"}`}>
                    {/* Header area — video / image / icon fallback */}
                    <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden flex items-center justify-center">
                        {project.video ? (
                            <video src={project.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                        ) : project.image ? (
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                        ) : (
                            <div className="text-5xl text-zinc-700 group-hover:text-accent/40 transition-colors duration-300 select-none">{project.icon ? <ProjectIcon icon={project.icon} /> : <span className="text-5xl font-bold text-gradient opacity-30">{project.title.charAt(0)}</span>}</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                        <h3 className="font-semibold text-zinc-100 mb-2 group-hover:text-accent transition-colors duration-200 leading-snug">{project.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed flex-1 line-clamp-4">{project.description}</p>

                        {/* Tech stack chips */}
                        {project.techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {project.techStack.slice(0, 4).map((tech) => (
                                    <span key={tech} className="text-[10px] font-mono text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                                        {tech}
                                    </span>
                                ))}
                                {project.techStack.length > 4 && <span className="text-[10px] font-mono text-zinc-600">+{project.techStack.length - 4}</span>}
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
                </a>

                {/* Top‑left icon group: GitHub link + Favorite badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-zinc-500 hover:text-accent transition-colors bg-surface/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full group/link"
                            title="GitHub repository — Open Source"
                        >
                            <GitHubIcon />
                            <span className="text-[10px] font-mono font-medium underline underline-offset-2 decoration-zinc-600/50 group-hover/link:decoration-accent/70">Open Source</span>
                        </a>
                    )}
                    {project.favorite && (
                        <span className="text-amber-400 text-sm bg-surface/80 backdrop-blur-sm px-2 py-1.5 rounded-full flex items-center gap-1" title="Personal Favorite">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

/** Resolves a project icon string to a react-icons component */
function ProjectIcon({ icon, size = 28 }: { icon: string; size?: number }) {
    const Icon = iconMap[icon];
    if (Icon) return <Icon size={size} />;
    return null;
}
