import { useEffect } from "react";
import Prism from "prismjs";

// Prism core self-installs a `Prism` global on import above; these must register
// their grammars on that global before `highlightAllUnder` runs.
import "prismjs/components/prism-bash";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
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
