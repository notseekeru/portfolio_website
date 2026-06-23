import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import personalData from "../data/personalData";
import { fadeIn } from "../lib/motion";
import {
  SiJavascript,
  SiPython,
  SiTypescript,
  SiCplusplus,
  SiReact,
  SiTailwindcss,
  SiExpress,
  SiNodedotjs,
  SiGnubash,
  SiMermaid,
  SiGithubactions,
  SiAnsible,
  SiNginx,
  SiCloudflare,
  SiGrafana,
  SiPrometheus,
  SiOpentelemetry,
  SiTerraform,
  SiRaspberrypi,
  SiDigitalocean,
  SiKubernetes,
  SiArgo,
  SiTailscale,
  SiTrivy,
  SiNeovim,
  SiTmux,
  SiOpenjdk,
  SiVite,
} from "react-icons/si";
import {
  FaJava,
  FaGitAlt,
  FaDocker,
  FaServer,
  FaCode,
  FaGolang,
} from "react-icons/fa6";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  SiJavascript,
  SiPython,
  SiTypescript,
  SiCplusplus,
  SiReact,
  SiTailwindcss,
  SiExpress,
  SiNodedotjs,
  SiGnubash,
  SiMermaid,
  SiGithubactions,
  SiAnsible,
  SiNginx,
  SiCloudflare,
  FaJava,
  FaGitAlt,
  FaDocker,
  FaServer,
  FaGolang,
  SiGrafana,
  SiPrometheus,
  SiOpentelemetry,
  SiTerraform,
  SiRaspberrypi,
  SiDigitalocean,
  SiKubernetes,
  SiArgo,
  SiTailscale,
  SiTrivy,
  SiNeovim,
  SiTmux,
  SiOpenjdk,
  SiVite,
};

interface SectionLabelProps {
  text: string;
}

export default function About() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCategory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (!activeCategory) {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveCategory(label);
      }, 400);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 600);
  };

  const handleModalMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handleModalMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  const stats = useMemo(
    () => [
      {
        value: personalData.projects.length,
        label: "Projects & Infrastructure",
        accent: true,
        items: [
          ...personalData.projects.map((p) => ({
            name: p.title,
            icon: p.icon || "FaCode",
            summary: p.description,
            implementation: "Stack: " + p.techStack.join(", "),
          })),
        ],
      },
      {
        value: personalData.skills.tools.length,
        label: "Tools",
        accent: true,
        items: personalData.skills.tools,
      },
      {
        value: personalData.skills.frameworks.length,
        label: "Frameworks",
        accent: true,
        items: personalData.skills.frameworks,
      },
      {
        value: personalData.skills.languages.length,
        label: "Languages",
        accent: true,
        items: personalData.skills.languages,
      },
    ],
    [],
  );

  return (
    <section className="py-24 max-w-6xl mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-16 items-center relative z-10"
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
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() =>
                !activeCategory && handleMouseEnter(stat.label)
              }
              onMouseLeave={handleMouseLeave}
              onClick={() => !activeCategory && setActiveCategory(stat.label)}
              className={`border border-border bg-surface rounded-xl p-6 transition-colors duration-300 group ${
                activeCategory
                  ? "cursor-default opacity-50"
                  : "hover:border-accent/40 cursor-pointer"
              }`}
            >
              <div
                className={`text-3xl font-bold mb-1 ${stat.accent ? "text-gradient" : "text-zinc-100"}`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 font-medium group-hover:text-accent transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {activeCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
              aria-label="Modal background"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl p-6 border border-zinc-800 bg-zinc-950 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[85vh] overflow-y-auto overflow-x-hidden pointer-events-auto"
              onMouseEnter={handleModalMouseEnter}
              onMouseLeave={handleModalMouseLeave}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-zinc-950/90 backdrop-blur-[2px] py-2 z-10 border-b border-zinc-800/50">
                <h3
                  id="modal-title"
                  className="text-2xl font-bold text-zinc-100"
                >
                  {activeCategory} Details
                </h3>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close details"
                ></button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats
                  .find((s) => s.label === activeCategory)
                  ?.items.map(
                    (
                      item: {
                        name: string;
                        icon: string;
                        summary: string;
                        implementation: string;
                      },
                      idx: number,
                    ) => {
                      const Icon =
                        item.icon && iconMap[item.icon]
                          ? iconMap[item.icon]
                          : FaCode;
                      return (
                        <div
                          key={idx}
                          className="p-4 border border-zinc-800/60 rounded-lg bg-zinc-900/40 hover:border-accent/30 transition-colors flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-accent text-xl">
                              <Icon />
                            </div>
                            <h4 className="font-semibold text-zinc-200">
                              {item.name}
                            </h4>
                          </div>
                          {item.summary && (
                            <p className="text-xs text-zinc-400">
                              {item.summary}
                            </p>
                          )}
                          {item.implementation && (
                            <div className="mt-1 pt-2 border-t border-zinc-800/60">
                              <p className="text-xs text-zinc-500">
                                <span className="text-zinc-600 font-mono mr-1">
                                  Impl:
                                </span>
                                {item.implementation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
