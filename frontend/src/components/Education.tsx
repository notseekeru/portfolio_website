import { motion } from "framer-motion";
import personalData from "../data/personalData";

interface SectionLabelProps {
  text: string;
}

export default function Education() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mt-16">
          <SectionLabel text="Education" />
          <h2 className="text-3xl font-bold text-zinc-100 mt-2 mb-12">
            Academic Background
          </h2>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accentPurple/50 via-border to-transparent" />

            <div className="space-y-8 pl-8">
              {personalData.education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 border-accentPurple bg-[#0d0d0d]" />
                  <div className="border border-border bg-surface rounded-xl p-6 hover:border-accentPurple/20 transition-colors duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-zinc-100">
                          {edu.degree}
                        </h3>
                        <p className="text-purple-400 text-sm font-medium">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                        {edu.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
