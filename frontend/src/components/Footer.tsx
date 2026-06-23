import { Link } from "react-router-dom";
import personalData from "../data/personalData";
import { GitHubIcon, LinkedInIcon } from "./icons/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-mono text-sm text-accent">
            {personalData.name}
            <span className="text-zinc-600 mx-2">·</span>
            <span className="text-zinc-500 text-xs">{personalData.title}</span>
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            {new Date().getFullYear()} · Built with React + Vite + Tailwind
          </p>
        </div>

        <nav className="flex items-center gap-6">
          {[
            { label: "Home", to: "/#home" },
            { label: "Infrastructure", to: "/#infrastructure-diagram" },
            { label: "Blog", to: "/#blog" },
            { label: "Contact", to: "/#contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={personalData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href={personalData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
