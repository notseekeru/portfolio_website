import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as m from "motion/react-m";
import { getBlogBySlug, type BlogPost as BlogPostType } from "../utils/blogLoader";
import { fade, maskRise, stagger } from "../utils/reveal";
import { parseMarkdown } from "../utils/markdown";
import { ArrowLeftIcon } from "../components/icons/Icons";
import MermaidRenderer from "../components/MermaidRenderer";
import SyntaxHighlighter from "../components/SyntaxHighlighter";
import type { SyntheticEvent } from "react";

export default function BlogPost() {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setPost(null);
        setHtml("");
        setLoading(true);
        getBlogBySlug(slug ?? "").then(async (found) => {
            if (cancelled) return;
            if (found) setHtml(await parseMarkdown(found.content));
            if (cancelled) return;
            setPost(found);
            setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-28 pb-24 animate-fade-in">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-28 pb-24 animate-fade-in">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h1 className="font-display text-4xl text-bone mb-4">Post Not Found</h1>
                    <p className="text-muted mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link to="/#blog" className="inline-flex items-center gap-2 text-sm font-mono text-accent hover:text-accent/80 transition-colors">
                        <ArrowLeftIcon size={14} />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = post.date
        ? new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    const htmlContent = post && html ? html : "";

    return (
        <div className="min-h-screen pt-28 pb-24">
            <m.div variants={stagger(0.08)} initial="hidden" animate="show" className="max-w-3xl mx-auto px-6">
                <m.div variants={fade}>
                    <Link to="/#blog" className="inline-flex items-center gap-2 text-sm font-mono text-muted hover:text-accent transition-colors duration-200 mb-10">
                        <ArrowLeftIcon size={14} />
                        Back to Blog
                    </Link>
                </m.div>

                <m.div variants={stagger(0.06)}>
                    {formattedDate && (
                        <m.span variants={fade} className="font-mono text-xs text-accent/70">
                            {formattedDate}
                        </m.span>
                    )}
                    <m.h1 variants={maskRise} className="font-display text-3xl lg:text-5xl text-bone mt-2 mb-6 leading-tight">
                        {post.title}
                    </m.h1>

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

                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: blog content is rendered from sanitized markdown */}
                    <div ref={contentRef} className="blog-prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </m.div>
                <SyntaxHighlighter containerRef={contentRef} deps={[slug, post?.content]} />
                <MermaidRenderer containerRef={contentRef} deps={[slug, post?.content]} />
            </m.div>
        </div>
    );
}
