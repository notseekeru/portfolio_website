import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import type { Element, ElementContent, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rendered-markup shims so output matches what the project's processors/CSS already
 * expect — this is a drop-in for the legacy hand-rolled `markdown.ts` contract:
 *  - ```mermaid fences must reach MermaidRenderer as `<div class="mermaid">` (it
 *    queries `div.mermaid`), not remark's default `<pre><code>`.
 *  - every other fenced block keeps `code.language-*` (Prism's selector) and gets
 *    `.blog-code-block` on `<pre>`, the class `.blog-prose` CSS scopes tokens on.
 */
function remapBlocks() {
    /** Replace `node` (at `parent.children[index]`) with a scroll wrapper around it. */
    const wrap = (node: Element, index: number, parent: { children: ElementContent[] }) => {
        const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: { className: ["blog-table-wrapper"] },
            children: [node],
        };
        parent.children[index] = wrapper;
    };

    return (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
            if (node.tagName === "table") {
                if (index !== undefined && parent?.children) {
                    wrap(node, index, parent as { children: ElementContent[] });
                }
                return;
            }

            if (node.tagName !== "pre") return;
            const code = node.children[0] as ElementContent | undefined;
            if (!(code && code.type === "element" && code.tagName === "code")) return;

            const classNames = Array.isArray(code.properties?.className) ? (code.properties.className as string[]) : [];
            if (classNames.includes("language-mermaid")) {
                const chart = (code.children as ElementContent[])
                    .filter((c) => c.type === "text")
                    .map((c) => c.value)
                    .join("");
                node.tagName = "div";
                node.properties = { className: ["mermaid"] };
                node.children = [{ type: "text", value: chart }];
                return;
            }

            if (node.properties?.className === undefined) node.properties.className = [];
            (node.properties.className as string[]).push("blog-code-block");
        });
    };
}

// Sanitize everything by default, but do not strip the structural/token classes the
// blog machinery injects: Prism's `language-*`, the `.blog-code-block` and `.mermaid`
// wrapper classes, and GFM table alignment.
const schemaAttributes = {
    ...(defaultSchema.attributes ?? {}),
    img: [...(defaultSchema.attributes?.img ?? []), ["className"]],
    div: [...(defaultSchema.attributes?.div ?? []), ["className"]],
    pre: [...(defaultSchema.attributes?.pre ?? []), ["className"]],
    code: [...(defaultSchema.attributes?.code ?? []), ["className"]],
} as Schema["attributes"];
const schema = {
    ...defaultSchema,
    attributes: schemaAttributes,
} as Schema;

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: false }).use(remapBlocks).use(rehypeSanitize, schema).use(rehypeStringify);

/** Convert a blog post's markdown body to HTML for the `.blog-prose` container. */
async function parseMarkdown(md: string): Promise<string> {
    const file = await processor.process(md);
    return String(file);
}

export { parseMarkdown };
