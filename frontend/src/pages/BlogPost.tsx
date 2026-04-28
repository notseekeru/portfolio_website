import { useParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { motion } from "framer-motion";
import Prism from "prismjs";
import mermaid from "mermaid";
import InteractiveMermaid from "../components/InteractiveMermaid";
import { getBlogBySlug } from "../utils/blogLoader";
import { parseMarkdown } from "../utils/markdown";
import type { SyntheticEvent } from "react";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
});

export default function BlogPost() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogBySlug(slug ?? "");
  const mermaidRootsRef = useRef<Root[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;

    // Clean up previous dynamically inserted roots
    mermaidRootsRef.current.forEach((root) =>
      setTimeout(() => root.unmount(), 0),
    );
    mermaidRootsRef.current = [];

    Prism.highlightAllUnder(contentRef.current);

    // Instead of querying ".mermaid" and modifying the parent class (which breaks strict-mode double renders),
    // query by a custom data attribute on the div that we can safely mutate contents for without losing its identity
    const mermaidNodes = contentRef.current.querySelectorAll(
      "div.mermaid, div[data-mermaid-processed]",
    );

    if (mermaidNodes.length > 0) {
      mermaidNodes.forEach((node) => {
        // Tag the node so it's found across strict-mode cleanups
        node.setAttribute("data-mermaid-processed", "true");
        node.classList.remove("mermaid"); // Still remove to avoid other css, but we can query by data attribute

        // Read the pure unrendered text content unless we already stored it
        let chartCode = node.getAttribute("data-mermaid-code");
        if (!chartCode) {
          chartCode = node.textContent || "";
          node.setAttribute("data-mermaid-code", chartCode);
        }

        // Empty the container for the new React root
        node.textContent = "";

        // Render interactive React root inside the DOM node
        const childContainer = document.createElement("div");
        node.appendChild(childContainer);

        const root = createRoot(childContainer);
        mermaidRootsRef.current.push(root);
        root.render(<InteractiveMermaid chart={chartCode} />);
      });
    }

    return () => {
      mermaidRootsRef.current.forEach((root) =>
        setTimeout(() => root.unmount(), 0),
      );
      mermaidRootsRef.current = [];
    };
  }, [slug, post?.content]);

  if (!post) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen pt-28 pb-24"
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            Post Not Found
          </h1>
          <p className="text-zinc-500 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </motion.div>
    );
  }

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const htmlContent = parseMarkdown(post.content);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-28 pb-24"
    >
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-accent transition-colors duration-200 mb-10"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {formattedDate && (
            <span className="font-mono text-xs text-accent/70 tracking-wider uppercase">
              {formattedDate}
            </span>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-zinc-100 mt-2 mb-6 leading-tight">
            {post.title}
          </h1>

          {post.image && (
            <div className="rounded-xl overflow-hidden border border-border mb-10">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.display = "none";
                  }
                }}
              />
            </div>
          )}

          <div
            ref={contentRef}
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
