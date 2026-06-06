import { motion } from "framer-motion";
import personalData, { type ProjectItem } from "../data/personalData";
import type { SyntheticEvent, MouseEvent } from "react";

const allProjects: ProjectItem[] = [...personalData.projects];

export default function Projects() {
  const filtered = allProjects;

  return (
    <motion.div
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
            Projects & Infrastructure
          </h1>
          <p className="text-zinc-500 max-w-lg">
            A selection of my work, personal projects and infrastructure.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const CardWrapper = project.link ? motion.a : motion.div;
  const wrapperProps = project.link
    ? {
        href: project.link,
        target: "_blank" as const,
        rel: "noopener noreferrer" as const,
      }
    : {};

  return (
    <CardWrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`group relative flex flex-col border border-border bg-surface rounded-2xl overflow-hidden transition-all duration-300 ${
        project.link
          ? "hover:border-accent/30 glow-accent-hover cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            onError={(e: SyntheticEvent<HTMLImageElement>) => {
              const image = e.currentTarget;
              image.style.display = "none";
              const fallback =
                image.nextElementSibling as HTMLDivElement | null;
              if (fallback) {
                fallback.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div
          className={`${project.image ? "hidden" : "flex"} w-full h-full items-center justify-center`}
          style={project.image ? { display: "none" } : {}}
        >
          <div className="text-5xl font-bold text-gradient opacity-30 select-none">
            {project.title.charAt(0)}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-zinc-100 group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {project.favorite && (
              <span className="text-amber-400 text-xs" title="Favorite">
                ⭐
              </span>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e: MouseEvent) => e.stopPropagation()}
                className="text-zinc-500 hover:text-accent transition-colors"
                title="GitHub repository"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-400 text-[10px] font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00d9ff"
            strokeWidth="3"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>
    </CardWrapper>
  );
}
