import elkLayouts from "@mermaid-js/layout-elk";
import mermaid from "mermaid";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

mermaid.registerLayoutLoaders(elkLayouts);

const MERMAID_THEME = {
    bg: "#15120e",
    ink: "#0c0a08",
    line: "#8a8271",
    border: "#322d24",
    accent: "#8abf9a",
    amber: "#d9a441",
    text: "#e8e6da",
};

const PAN_STEP = 80;

function PanControls({ transformRef }: { transformRef: React.RefObject<ReactZoomPanPinchRef | null> }) {
    const pan = useCallback(
        (dx: number, dy: number) => {
            const ctx = transformRef.current;
            if (!ctx) return;
            const { positionX, positionY, scale } = ctx.state;
            ctx.setTransform(positionX + dx, positionY + dy, scale, 150);
        },
        [transformRef],
    );

    const btn = "flex items-center justify-center w-7 h-7 rounded-md bg-surface/80 border border-border text-muted hover:text-bone hover:bg-surface hover:border-amber/50 transition-colors focus:outline-none focus:ring-1 focus:ring-amber/50 select-none";

    return (
        <div className="absolute bottom-3 right-3 z-20 grid grid-cols-3 gap-0.5">
            <button type="button" className={btn} onClick={() => transformRef.current?.zoomIn(0.5, 200)} aria-label="Zoom in" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Zoom in</title>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                </svg>
            </button>
            <button type="button" className={btn} onClick={() => pan(0, PAN_STEP)} aria-label="Pan up" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Pan up</title>
                    <path d="m18 15-6-6-6 6" />
                </svg>
            </button>
            <button type="button" className={btn} onClick={() => transformRef.current?.zoomOut(0.5, 200)} aria-label="Zoom out" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Zoom out</title>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35M8 11h6" />
                </svg>
            </button>
            <button type="button" className={btn} onClick={() => pan(PAN_STEP, 0)} aria-label="Pan left" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Pan left</title>
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>
            <button type="button" className={`${btn} bg-ink/80`} onClick={() => transformRef.current?.centerView(1, 200)} aria-label="Reset view" tabIndex={-1}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Reset view</title>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
                </svg>
            </button>
            <button type="button" className={btn} onClick={() => pan(-PAN_STEP, 0)} aria-label="Pan right" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Pan right</title>
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
            <div />
            <button type="button" className={btn} onClick={() => pan(0, -PAN_STEP)} aria-label="Pan down" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <title>Pan down</title>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            <div />
        </div>
    );
}

interface InteractiveMermaidProps {
    chart: string;
}

export default function InteractiveMermaid({ chart }: InteractiveMermaidProps) {
    const [svgContent, setSvgContent] = useState<string>("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

    useEffect(() => {
        let isMounted = true;

        mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            flowchart: {
                useMaxWidth: false,
                htmlLabels: true,
            },
            themeVariables: {
                fontFamily: "JetBrains Mono, monospace",
                background: MERMAID_THEME.ink,
                primaryColor: MERMAID_THEME.bg,
                primaryTextColor: MERMAID_THEME.text,
                primaryBorderColor: MERMAID_THEME.accent,
                lineColor: MERMAID_THEME.line,
                textColor: MERMAID_THEME.text,
                mainBkg: MERMAID_THEME.bg,
                nodeBkg: MERMAID_THEME.bg,
                nodeBorder: MERMAID_THEME.accent,
                clusterBkg: MERMAID_THEME.ink,
                clusterBorder: MERMAID_THEME.border,
                titleColor: MERMAID_THEME.text,
                edgeLabelBackground: MERMAID_THEME.ink,
                actorBkg: MERMAID_THEME.bg,
                actorBorder: MERMAID_THEME.accent,
                actorTextColor: MERMAID_THEME.text,
                signalColor: MERMAID_THEME.line,
                signalTextColor: MERMAID_THEME.text,
                labelBoxBkgColor: MERMAID_THEME.bg,
                labelBoxBorderColor: MERMAID_THEME.accent,
                labelTextColor: MERMAID_THEME.line,
                loopTextColor: MERMAID_THEME.text,
                noteBkgColor: MERMAID_THEME.ink,
                noteBorderColor: MERMAID_THEME.amber,
                noteTextColor: MERMAID_THEME.text,
                activationBkgColor: MERMAID_THEME.bg,
                activationBorderColor: MERMAID_THEME.line,
                sequenceNumberColor: MERMAID_THEME.ink,
                sectionBkgColor: MERMAID_THEME.bg,
                altSectionBkgColor: MERMAID_THEME.ink,
                altBkgColor: MERMAID_THEME.ink,
                commitLabelColor: MERMAID_THEME.text,
                commitBackgroundColor: MERMAID_THEME.bg,
                pie1: MERMAID_THEME.accent,
                pie2: MERMAID_THEME.amber,
                pie3: MERMAID_THEME.line,
                pie4: MERMAID_THEME.border,
                pie5: MERMAID_THEME.bg,
                pieTitleTextColor: MERMAID_THEME.text,
                pieSectionTextColor: MERMAID_THEME.text,
                pieLegendTextColor: MERMAID_THEME.text,
            },
        });

        const renderDiagram = async () => {
            try {
                const renderId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                const { svg } = await mermaid.render(renderId, chart);
                if (isMounted) {
                    setSvgContent(svg);
                }
            } catch (err) {
                console.error("Mermaid rendering error:", err);
            }
        };

        renderDiagram();

        return () => {
            isMounted = false;
        };
    }, [chart]);

    useEffect(() => {
        const ctx = transformRef.current;
        if (!ctx) return;

        const onKeyDown = (e: KeyboardEvent) => {
            const { positionX, positionY, scale } = ctx.state;
            const step = PAN_STEP;
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    ctx.setTransform(positionX, positionY + step, scale, 120);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    ctx.setTransform(positionX, positionY - step, scale, 120);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    ctx.setTransform(positionX + step, positionY, scale, 120);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    ctx.setTransform(positionX - step, positionY, scale, 120);
                    break;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    const viewer = (
        <div className="relative flex items-center justify-center w-full h-full [&>svg]:max-w-none [&>svg]:h-auto md:[&>svg]:w-full md:[&>svg]:h-full">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid renders raw SVG */}
            <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} role="img" aria-label="Diagram preview" />
        </div>
    );

    const fsIconPath = isFullscreen ? "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" : "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3";

    const diagramView = (
        <TransformWrapper ref={transformRef} initialScale={1} minScale={0.05} maxScale={5} centerOnInit={true} wheel={{ step: 0.004 }} pinch={{ step: 3 }} panning={{ velocityDisabled: true }} limitToBounds={false} zoomAnimation={{ animationTime: 150 }}>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                {viewer}
            </TransformComponent>
        </TransformWrapper>
    );

    const shell = (
        <div
            className={`relative flex-1 min-h-0 w-full ${isFullscreen ? "h-full" : "h-[60vh] min-h-[420px] max-h-[750px]"} overflow-hidden rounded-lg border border-border bg-surface/40 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]`}
        >
            {diagramView}
            <PanControls transformRef={transformRef} />
            <button type="button" onClick={toggleFullscreen} className="absolute top-4 right-4 z-10 rounded bg-surface/80 p-2 text-muted hover:text-bone hover:bg-surface border border-border transition-colors" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={fsIconPath} />
                </svg>
            </button>
        </div>
    );

    if (!isFullscreen) return shell;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: MERMAID_THEME.ink }}>
            {shell}
        </div>,
        document.body,
    );
}
