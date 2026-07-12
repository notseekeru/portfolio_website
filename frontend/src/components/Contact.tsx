import personalData from "../data/personalData";
import {
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "./icons/Icons";
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
    <div
      id="contact"
      ref={sectionRef}
      className={`py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-slide-in-left">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            Contact
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
            Get In Touch
          </h1>
          <p className="text-zinc-400 text-sm mb-8">
            Send a message
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 animate-slide-in-right"
             style={{ animationDelay: "0.1s" }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-border bg-surface rounded-xl hover:border-accent/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-border flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:border-accent/30 transition-colors shrink-0">
                <link.icon />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-0.5">{link.label}</p>
                <p className="text-sm text-zinc-300 group-hover:text-accent transition-colors truncate">
                  {link.value}
                </p>
              </div>
            </a>
          ))}
          <div className="border border-border bg-surface rounded-xl p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-zinc-300 font-medium">
                {personalData.status}
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-mono">
              {personalData.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
