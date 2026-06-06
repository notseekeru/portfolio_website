import { motion } from "framer-motion";

export default function InfrastructureDiagram() {
  return (
    <motion.div
      id="infrastructure-diagram"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            Architecture
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
            Full Infrastructure Diagram
          </h1>
          <p className="text-zinc-500 max-w-lg">
            End-to-end homelab infrastructure breakdown — from Cloudflare edge
            to Raspberry Pi 5 and monitoring stack.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="border border-border bg-surface rounded-2xl p-6 overflow-x-auto"
        >
          <div className="min-w-[700px]">
            <div className="w-full flex items-center justify-center text-zinc-500 py-20">
              <span className="font-mono text-sm">
                🚧 Infrastructure diagram coming soon &mdash; placeholder for
                the full Mermaid-based homelab architecture breakdown.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
