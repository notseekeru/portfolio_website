import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import InteractiveMermaid from "../utils/InteractiveMermaid";

interface MermaidRendererProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    deps?: React.DependencyList;
}

export default function MermaidRenderer({ containerRef, deps = [] }: MermaidRendererProps) {
    const mermaidRootsRef = useRef<Root[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        for (const root of mermaidRootsRef.current) {
            setTimeout(() => root.unmount(), 0);
        }
        mermaidRootsRef.current = [];

        const mermaidNodes = containerRef.current.querySelectorAll("div.mermaid, div[data-mermaid-processed]");

        if (mermaidNodes.length > 0) {
            for (const node of mermaidNodes) {
                node.setAttribute("data-mermaid-processed", "true");
                node.classList.remove("mermaid");

                let chartCode = node.getAttribute("data-mermaid-code");
                if (!chartCode) {
                    chartCode = node.textContent || "";
                    node.setAttribute("data-mermaid-code", chartCode);
                }

                node.textContent = "";

                const childContainer = document.createElement("div");
                node.appendChild(childContainer);

                const root = createRoot(childContainer);
                mermaidRootsRef.current.push(root);
                root.render(<InteractiveMermaid chart={chartCode} />);
            }
        }

        return () => {
            for (const root of mermaidRootsRef.current) {
                setTimeout(() => root.unmount(), 0);
            }
            mermaidRootsRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, ...deps]);

    return null;
}
