import personalData from "../data/personalData";
import { MailIcon, GitHubIcon, LinkedInIcon, FacebookIcon, InstagramIcon } from "./icons/Icons";
import { useInView } from "../hooks/useInView";

interface SocialLink {
    label: string;
    value: string;
    href: string;
    icon: () => React.ReactNode;
}

export default function Contact() {
    const socialLinks: SocialLink[] = [
        {
            label: "Email",
            value: personalData.email,
            href: `mailto:${personalData.email}`,
            icon: MailIcon,
        },
        {
            label: "GitHub",
            value: personalData.github.replace("https://", ""),
            href: personalData.github,
            icon: GitHubIcon,
        },
        {
            label: "LinkedIn",
            value: personalData.linkedin.replace("https://www.linkedin.com/in/", "@"),
            href: personalData.linkedin,
            icon: LinkedInIcon,
        },
        {
            label: "Facebook",
            value: personalData.facebook.replace("https://www.facebook.com/", "@"),
            href: personalData.facebook,
            icon: FacebookIcon,
        },
        {
            label: "Instagram",
            value: personalData.instagram.replace("https://www.instagram.com/", "@"),
            href: personalData.instagram,
            icon: InstagramIcon,
        },
    ].filter((link) => link.href && link.href !== "mailto:");

    const { ref: sectionRef, inView: sectionInView } = useInView();

    return (
        <div id="contact" ref={sectionRef} className={`py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="animate-slide-in-left">
                    <span className="font-mono text-xs tracking-widest text-accent">03 / CONTACT</span>
                    <h1 className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-6">Get in touch</h1>
                    <p className="text-muted text-sm mb-10 max-w-lg">Open to remote roles, internships, and collaborations.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
                    {socialLinks.map((link) => (
                        <a key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border bg-surface hover:border-accent/40 transition-colors group">
                            <div className="w-10 h-10 bg-ink/60 border border-border flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/40 transition-colors shrink-0">
                                <link.icon />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-muted mb-0.5">{link.label}</p>
                                <p className="text-sm text-bone group-hover:text-accent transition-colors truncate">{link.value}</p>
                            </div>
                        </a>
                    ))}
                    <div className="border border-border bg-surface rounded-xl p-4 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-accent" />
                            <span className="text-sm text-bone font-medium">{personalData.status}</span>
                        </div>
                        <p className="text-muted text-xs font-mono">{personalData.location}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
