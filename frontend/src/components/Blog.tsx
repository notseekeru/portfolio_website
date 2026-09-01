import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadBlogs, type BlogPost } from "../utils/blogLoader";
import { useInView } from "../hooks/useInView";

const POSTS_PER_PAGE = 6;

export default function Blog() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadBlogs().then(setBlogs);
    }, []);

    const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const visibleBlogs = blogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const { ref: sectionRef, inView: sectionInView } = useInView();
    const { ref: headerRef, inView: headerInView } = useInView();

    return (
        <div id="blog" ref={sectionRef} className={`py-16 sm:py-20 lg:py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div ref={headerRef} className={`mb-16 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} transition-all duration-500`}>
                    <span className="font-mono text-xs tracking-widest text-accent">02 / WRITING</span>
                    <h1 className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-5">Blog</h1>
                    <p className="text-muted max-w-lg">Thoughts, guides, and things I've learned along the way.</p>
                </div>

                {blogs.length === 0 ? (
                    <p className="text-muted text-center py-20">No posts yet. Check back soon.</p>
                ) : (
                    <ol className="divide-y divide-border border-y border-border">
                        {visibleBlogs.map((post, i) => (
                            <li key={post.slug}>
                                <BlogRow post={post} index={startIndex + i} first={startIndex + i === 0} />
                            </li>
                        ))}
                    </ol>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-sm font-mono text-muted hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-colors">
                            ← Prev
                        </button>
                        <span className="text-xs font-mono text-muted">
                            {currentPage} / {totalPages}
                        </span>
                        <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="text-sm font-mono text-muted hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-colors">
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface BlogRowProps {
    post: BlogPost;
    index: number; // 0-based page-relative
    first: boolean;
}

function fmtDate(date: string): string {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function Arrow() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
    );
}

function BlogRow({ post, index, first }: BlogRowProps) {
    const navigate = useNavigate();
    const go = () => navigate(`/blog/${post.slug}`);
    const numeral = String(index + 1).padStart(2, "0");

    if (first) {
        return (
            <article
                className="group grid cursor-pointer gap-x-8 py-10 lg:grid-cols-12"
                onClick={go}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        go();
                    }
                }}
            >
                {/* oversized index numeral */}
                <div className="lg:col-span-2 select-none">
                    <span className="font-display text-7xl lg:text-8xl leading-none text-muted/30 group-hover:text-accent/50 transition-colors">{numeral}</span>
                </div>
                <div className="lg:col-span-10">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="font-mono text-xs tracking-widest text-accent">{post.favorite ? "FEATURED" : "LATEST"}</span>
                        <span className="text-xs font-mono text-muted">{fmtDate(post.date)}</span>
                        {post.github && <span className="text-xs font-mono text-muted">· source ↗</span>}
                    </div>
                    <h2 className="font-display text-3xl lg:text-5xl text-bone group-hover:text-accent transition-colors leading-tight">{post.title}</h2>
                    <p className="mt-4 max-w-2xl text-muted leading-relaxed">{post.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-accent font-mono text-sm group-hover:gap-3 transition-all">
                        read
                        <Arrow />
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article
            className="group grid cursor-pointer items-baseline gap-x-8 py-6 lg:grid-cols-12"
            onClick={go}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    go();
                }
            }}
        >
            <div className="lg:col-span-1 select-none">
                <span className="font-display text-2xl text-muted/40 group-hover:text-accent transition-colors">{numeral}</span>
            </div>
            <div className="lg:col-span-8">
                <h3 className="font-display text-xl text-bone group-hover:text-accent transition-colors leading-snug">{post.title}</h3>
                {post.description && <p className="mt-1 text-sm text-muted line-clamp-2">{post.description}</p>}
            </div>
            <div className="lg:col-span-3 flex items-center justify-between gap-4 lg:justify-end">
                <span className="text-xs font-mono text-muted">{fmtDate(post.date)}</span>
                <span className="text-muted group-hover:text-accent transition-colors">
                    <Arrow />
                </span>
            </div>
        </article>
    );
}
