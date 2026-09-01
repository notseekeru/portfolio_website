import { Link } from "react-router-dom";
import personalData from "../data/personalData";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons/Icons";

export default function Hero() {
    return (
        <section className="py-16 sm:py-20 lg:py-32 relative">
            <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
                <div>
                    <span className="inline-block bg-ink/40 border border-border text-muted font-mono text-xs tracking-widest px-3 py-1 mb-8">{personalData.location}</span>
                    <h1 className="font-display text-5xl lg:text-7xl leading-tight text-bone">
                        Hi, I'm
                        <br />
                        <span className="text-accent">{personalData.name}</span>
                    </h1>
                    <h2 className="mt-6 text-lg lg:text-xl text-muted leading-relaxed max-w-xl">{personalData.title}</h2>
                    <p className="mt-8 text-base text-muted leading-relaxed max-w-xl">{personalData.bio}</p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link to="/#contact" className="px-6 py-3.5 bg-accent text-ink font-semibold text-sm hover:bg-accent/85 transition-colors">
                            Get in touch
                        </Link>
                        <Link to="/#projects" className="px-6 py-3.5 border border-border text-bone font-medium text-sm hover:border-accent hover:text-accent transition-colors">
                            View work
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-6">
                        <div className="flex items-center gap-5">
                            <a href={personalData.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="GitHub">
                                <GitHubIcon size={20} />
                            </a>
                            <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="LinkedIn">
                                <LinkedInIcon size={20} />
                            </a>
                            <a href={`mailto:${personalData.email}`} className="text-muted hover:text-accent transition-colors" aria-label="Email">
                                <MailIcon size={20} />
                            </a>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-2 text-sm text-muted">● {personalData.status}</span>
                    </div>
                </div>

                <div className="relative hidden sm:block">
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 ml-auto">
                        <div className="h-full w-full overflow-hidden border border-border bg-surface">
                            <img src={personalData.profilePicture} alt={personalData.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="absolute -bottom-4 -left-4 h-16 w-16 bg-amber text-ink flex items-center justify-center text-2xl font-display">{personalData.name.charAt(0)}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
