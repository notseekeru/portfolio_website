import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import personalData from "../data/personalData";
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
      await axios.post("/api/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again or email me directly.");
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
  ].filter((link) => link.href && link.href !== "mailto:");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-28 pb-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            Contact
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
            Get In Touch
          </h1>
          <p className="text-zinc-500 max-w-lg">
            Whether you have a project in mind or just want to say hi — my inbox
            is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-zinc-100 mb-6">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-zinc-100 mb-6">
              Connect with me
            </h2>

            <div className="space-y-3 mb-10">
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
                  Available for work
                </span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                I'm currently open to new opportunities. Feel free to reach out
                if you have a project that needs a skilled developer.
              </p>
              <p className="text-zinc-600 text-xs font-mono mt-3">
                {personalData.location}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
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

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
