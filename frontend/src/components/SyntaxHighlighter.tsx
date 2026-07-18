import { useEffect } from "react";
import Prism from "prismjs";

interface SyntaxHighlighterProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    deps?: React.DependencyList;
}

export default function SyntaxHighlighter({ containerRef, deps = [] }: SyntaxHighlighterProps) {
    useEffect(() => {
        if (containerRef.current) {
            Prism.highlightAllUnder(containerRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, ...deps]);

    return null;
}
