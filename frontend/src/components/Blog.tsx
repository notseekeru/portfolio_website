import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loadBlogs, type BlogPost } from "../utils/blogLoader";
import type { SyntheticEvent } from "react";

const blogs: BlogPost[] = loadBlogs();
const POSTS_PER_PAGE = 9;

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visibleBlogs = blogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <motion.div
      id="blog"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            Writing
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
            Blog
          </h1>
          <p className="text-zinc-500 max-w-lg">
            Thoughts, guides, and things I've learned along the way.
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">
            No posts yet. Check back soon.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleBlogs.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-border rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:border-accent/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-500 font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-border rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:border-accent/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group relative flex flex-col border border-border bg-surface rounded-2xl overflow-hidden hover:border-accent/30 glow-accent-hover transition-all duration-300 h-full"
      >
        <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
              onError={(e: SyntheticEvent<HTMLImageElement>) => {
                const image = e.currentTarget;
                image.style.display = "none";
                const fallback =
                  image.nextElementSibling as HTMLDivElement | null;
                if (fallback) {
                  fallback.style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className={`${post.image ? "hidden" : "flex"} w-full h-full items-center justify-center`}
            style={post.image ? { display: "none" } : {}}
          >
            <div className="text-5xl font-bold text-gradient opacity-30 select-none">
              {post.title.charAt(0)}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>

        <div className="flex flex-col flex-1 p-5">
          {formattedDate && (
            <span className="font-mono text-[10px] text-accent/70 tracking-wider uppercase mb-2">
              {formattedDate}
            </span>
          )}
          <h3 className="font-semibold text-zinc-100 mb-2 group-hover:text-accent transition-colors duration-200 leading-snug">
            {post.title}
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed flex-1">
            {post.description}
          </p>

          <div className="mt-4 flex items-center gap-1 text-accent text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Read more
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
