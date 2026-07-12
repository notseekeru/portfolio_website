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
        {/* Main Grid Wrapper starts above the header now */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Header + Form */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Header Block */}
            <div>
              <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
                Contact
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
                Get In Touch
              </h1>
            </div>

            {/* Form Block */}
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                Send a message
              </h2>
              <a
                href={`mailto:${personalData.email}`}
                className="flex items-center gap-3 p-4 border border-border bg-surface rounded-xl hover:border-accent/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-border flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                  <MailIcon />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Open in email client</p>
                  <p className="text-sm text-zinc-300 group-hover:text-accent transition-colors">
                    {personalData.email}
                  </p>
                </div>
                <svg
                  className="ml-auto text-zinc-600 group-hover:text-accent transition-colors"
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Social Links */}
          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-lg font-semibold text-zinc-100 mb-6">
              Connect with me
            </h2>

            <div className="space-y-3 mb-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-border bg-surface rounded-xl hover:border-accent/30 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-border flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                    <link.icon />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">{link.label}</p>
                    <p className="text-sm text-zinc-300 group-hover:text-accent transition-colors">
                      {link.value}
                    </p>
                  </div>
                  <svg
                    className="ml-auto text-zinc-600 group-hover:text-accent transition-colors"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              ))}
            </div>

            <div className="border border-border bg-surface rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm text-zinc-300 font-medium">
                  {personalData.status}
                </span>
              </div>
              <p className="text-zinc-600 text-xs font-mono mt-3">
                {personalData.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
