import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import InteractiveMermaid from "../utils/InteractiveMermaid";
import { useInView } from "../hooks/useInView";
import { infrastructureChart } from "../utils/infrastructureChart";
import { fade, maskRise, slideIn, stagger, revealViewport } from "../utils/reveal";

const DRAW_MS = 900;
const DRAW_STEP_MS = 4;

export default function InfrastructureDiagram() {
    const { ref: chartRef, inView: chartInView } = useInView();
    const drawn = useRef(false);

    // Mermaid renders the SVG asynchronously, so paths are polled for; the attempt bound keeps a failed render from spinning forever.
    // biome-ignore lint/correctness/useExhaustiveDependencies: chartInView is the only restart trigger; chartRef is a stable ref read once per run.
    useEffect(() => {
        const host = chartRef.current;
        if (!host || !chartInView || drawn.current) return;

        let frame = 0;
        let attempts = 0;
        const start = () => {
            const shapes = host.querySelectorAll<SVGGeometryElement>("svg path, svg line, svg polyline, svg rect, svg circle, svg ellipse");
            if (!shapes.length) {
                if (++attempts < 300) frame = requestAnimationFrame(start);
                return;
            }
            drawn.current = true;
            shapes.forEach((shape, i) => {
                const length = shape.getTotalLength?.() ?? 0;
                if (!length) return;
                shape.style.strokeDasharray = `${length}`;
                shape.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
                    duration: DRAW_MS,
                    delay: i * DRAW_STEP_MS,
                    easing: "ease-in-out",
                    fill: "forwards",
                });
            });
        };
        start();
        return () => cancelAnimationFrame(frame);
    }, [chartInView]);

    return (
        <div className="max-w-6xl mx-auto px-6">
            <m.div variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={revealViewport} className="mb-16">
                <m.span variants={slideIn} className="font-mono text-xs tracking-widest text-accent">
                    ARCHITECTURE
                </m.span>
                <m.h1 variants={maskRise} className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-5">
                    Infrastructure
                </m.h1>
                <m.p variants={fade} className="text-muted max-w-lg">
                    End-to-end homelab breakdown — edge to a Raspberry Pi 5.
                </m.p>
            </m.div>

            <m.div ref={chartRef} variants={fade} initial="hidden" whileInView="show" viewport={revealViewport}>
                <div className="flex flex-col h-[750px]">
                    <InteractiveMermaid chart={infrastructureChart} />
                </div>
            </m.div>
        </div>
    );
}
