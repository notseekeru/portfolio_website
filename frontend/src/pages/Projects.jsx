import { useState } from 'react'
import { motion } from 'framer-motion'
import personalData from '../data/personalData'

const allProjects = [...personalData.projects]

export default function Projects() {
  const [filter, setFilter] = useState('all')

  const filtered = allProjects

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-28 pb-24"
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
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">Projects</h1>
          <p className="text-zinc-500 max-w-lg">
            A selection of my professional work and personal projects.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  return (
    <motion.a
      href={project.link || '#'}
      target={project.link && project.link !== '#' ? '_blank' : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group relative flex flex-col border border-border bg-surface rounded-2xl overflow-hidden hover:border-accent/30 glow-accent-hover transition-all duration-300"
    >
      <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`${project.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}
          style={project.image ? { display: 'none' } : {}}
        >
          <div className="text-5xl font-bold text-gradient opacity-30 select-none">
            {project.title.charAt(0)}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-zinc-100 mb-2 group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-4">{project.description}</p>

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
    </motion.a>
  )
}
