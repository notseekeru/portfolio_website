import { useState } from "react";
import personalData from "../data/personalData";
import {
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "./icons/Icons";
import { useInView } from "../hooks/useInView";
import type { ChangeEvent, FormEvent } from "react";

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface SocialLink {
  label: string;
  value: string;
  href: string;
  icon: () => JSX.Element;
}

interface FormFieldProps {
  label: string;
  name: keyof ContactFormState;
  type: "text" | "email";
  value: string;
  onChange: (e: FormChangeEvent) => void;
  required?: boolean;
  maxLength?: number;
}

export default function Contact() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: FormChangeEvent) => {
    const key = e.target.name as keyof ContactFormState;
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong, service might be down. Please contact using the links.",
      );
    } finally {
      setLoading(false);
    }
  };

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

              {submitted ? (
                <div className="border border-accent/30 bg-accent/5 rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-3">✓</div>
                  <p className="text-zinc-100 font-medium">Message sent!</p>
                  <p className="text-zinc-500 text-sm mt-1">
                    I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs text-accent hover:underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      label="Name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      maxLength={5000}
                      placeholder="What's on your mind?"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-accent/40 transition-colors resize-none"
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent text-[#0d0d0d] font-semibold text-sm rounded-xl hover:bg-accent/90 glow-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
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

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  required,
  maxLength,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        placeholder={label}
        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-accent/40 transition-colors"
      />
    </div>
  );
}
