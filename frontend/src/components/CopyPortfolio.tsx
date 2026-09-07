import { useCallback, useEffect, useRef, useState } from "react";
import { buildPortfolioMarkdown } from "../utils/portfolioMarkdown";

async function copyText(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Clipboard API blocked (non-secure context / permissions). Fall back to
        // a transient-selection copy so the affordance still works over plain http.
        try {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(ta);
            return ok;
        } catch {
            return false;
        }
    }
}

/** Lazily build the doc exactly once and cache it so preview and the one-click copy share one source. */
function usePortfolioDoc() {
    const [doc, setDoc] = useState<string | null>(null); // null until first successful build
    const [loading, setLoading] = useState(false);
    const docRef = useRef<string | null>(null);
    const promiseRef = useRef<Promise<string | null> | null>(null);

    const ensure = useCallback((): Promise<string | null> => {
        if (docRef.current) return Promise.resolve(docRef.current);
        if (!promiseRef.current) {
            setLoading(true);
            promiseRef.current = buildPortfolioMarkdown()
                .then((built) => {
                    docRef.current = built;
                    setDoc(built);
                    return built;
                })
                .catch(() => null)
                .then((built) => {
                    setLoading(false);
                    return built;
                });
        }
        return promiseRef.current;
    }, []);

    return { doc, loading, ensure };
}

const PREVIEW_CHARS = 600;

export default function CopyPortfolio() {
    const { doc, loading, ensure } = usePortfolioDoc();
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleClose = useCallback(() => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        leaveTimer.current = setTimeout(() => setOpen(false), 250);
    }, []);

    const openPreview = useCallback(() => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        setOpen(true);
        ensure();
    }, [ensure]);

    const handleClick = useCallback(async () => {
        setOpen(false);
        const text = await ensure();
        if (!text) return;
        const ok = await copyText(text);
        setCopied(ok);
        if (ok) setTimeout(() => setCopied(false), 1600);
    }, [ensure]);

    useEffect(
        () => () => {
            if (leaveTimer.current) clearTimeout(leaveTimer.current);
        },
        [],
    );

    const showPreview = open && (doc != null || loading);

    const previewBody = doc ? `${doc.slice(0, PREVIEW_CHARS)}${doc.length > PREVIEW_CHARS ? "…" : ""}` : doc == null && loading ? "Assembling full portfolio document…" : "";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleClick}
                onMouseEnter={openPreview}
                onMouseLeave={scheduleClose}
                disabled={loading}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={showPreview ? "copy-ai-preview" : undefined}
                className="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 border border-border text-xs font-mono text-muted hover:text-accent hover:border-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="14" height="14" x="8" y="8" rx="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                {copied ? <span>Copied ✓</span> : loading ? <span>Assembling…</span> : <span>Copy to AI</span>}
            </button>

            {showPreview && (
                <div id="copy-ai-preview" role="dialog" onMouseEnter={openPreview} onMouseLeave={scheduleClose} className="absolute right-0 top-full mt-2 z-[60] w-[24rem] max-w-[calc(100vw-2rem)] border border-border bg-surface shadow-2xl">
                    <div className="px-3 py-2 border-b border-border bg-ink/60">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Copy portfolio to AI</p>
                    </div>
                    <pre className="max-h-56 overflow-auto px-3 py-2 font-mono text-[11px] leading-relaxed text-bone whitespace-pre-wrap break-words">{previewBody}</pre>
                    <div className="px-3 py-2 border-t border-border">
                        <p className="text-[11px] text-muted leading-relaxed">One click stacks profile → projects → infra diagram → latest 4 blogs, framed for an AI review.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
