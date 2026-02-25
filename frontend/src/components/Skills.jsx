import { motion } from 'framer-motion'
import personalData from '../data/personalData'

const allSkills = [
  ...personalData.skills.languages.map((s) => ({ label: s, category: 'language' })),
  ...personalData.skills.frameworks.map((s) => ({ label: s, category: 'framework' })),
  ...personalData.skills.tools.map((s) => ({ label: s, category: 'tool' }))
]

const categoryColors = {
  language: 'border-accent/30 text-accent bg-accent/5',
  framework: 'border-accentPurple/30 text-purple-400 bg-accentPurple/5',
  tool: 'border-zinc-700 text-zinc-400 bg-zinc-800/30'
}

export default function Skills() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionLabel text="Skills" />
        <h2 className="text-3xl font-bold text-zinc-100 mt-2 mb-3">Tech Stack</h2>
        <p className="text-zinc-500 mb-12 max-w-lg">Technologies I work with day to day.</p>

        <div className="flex flex-wrap gap-3">
          {allSkills.map((skill, i) => (
            <motion.span
              key={skill.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={`px-4 py-2 rounded-full border text-sm font-mono font-medium transition-all duration-200 hover:scale-105 cursor-default ${categoryColors[skill.category]}`}
            >
              {skill.label}
            </motion.span>
          ))}
        </div>

        <div className="flex gap-6 mt-8">
          {[
            { label: 'Languages', color: 'bg-accent' },
            { label: 'Frameworks', color: 'bg-purple-500' },
            { label: 'Tools', color: 'bg-zinc-500' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs text-zinc-500">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function SectionLabel({ text }) {
  return (
    <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">{text}</span>
  )
}
