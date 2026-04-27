import { motion } from "framer-motion";
import personalData from "../data/personalData";

interface SectionLabelProps {
  text: string;
}

export default function About() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <SectionLabel text="About" />
          <h2 className="text-3xl font-bold text-zinc-100 mt-2 mb-6">
            A bit about me
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            {personalData.background}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-accent" />
              GitHub
            </a>
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-accent" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              value: personalData.infrastructure.length, // TODO UPDATE THESE TO HOVER
              label: "Infrastructure",
              accent: true,
            },
            {
              value: personalData.projects.length,
              label: "Projects Built",
              accent: true,
            },
            {
              value:
                personalData.skills.frameworks.length +
                personalData.skills.tools.length,
              label: "Tools & Frameworks",
              accent: true,
            },
            {
              value: personalData.skills.languages.length,
              label: "Languages",
              accent: true,
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="border border-border bg-surface rounded-xl p-6 hover:border-accent/20 transition-colors duration-300"
            >
              <div
                className={`text-3xl font-bold mb-1 ${stat.accent ? "text-gradient" : "text-zinc-100"}`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SectionLabel({ text }: SectionLabelProps) {
  return (
    <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
      {text}
    </span>
  );
}
