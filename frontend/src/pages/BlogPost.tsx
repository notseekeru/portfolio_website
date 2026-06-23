import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getBlogBySlug, type BlogPost } from "../utils/blogLoader";
import { parseMarkdown } from "../utils/markdown";
import { ArrowLeftIcon } from "../components/icons/Icons";
import { fadeInUp } from "../lib/motion";
import MermaidRenderer from "../components/MermaidRenderer";
import SyntaxHighlighter from "../components/SyntaxHighlighter";
import type { SyntheticEvent } from "react";

export default function BlogPost() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogBySlug(slug ?? "").then((p) => {
      setPost(p);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen pt-28 pb-24"
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </motion.div>
    );
  }

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
            <ArrowLeftIcon size={14} />
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
          to="/#blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-accent transition-colors duration-200 mb-10"
        >
          <ArrowLeftIcon size={14} />
          Back to Blog
        </Link>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
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
          <SyntaxHighlighter containerRef={contentRef} deps={[slug, post?.content]} />
          <MermaidRenderer containerRef={contentRef} deps={[slug, post?.content]} />
        </motion.div>
      </div>
    </motion.div>
  );
}
