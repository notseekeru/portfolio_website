export interface FrontmatterParseResult {
    meta: Record<string, string>;
    content: string;
}

export function parseFrontmatter(raw: string): FrontmatterParseResult {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { meta: {}, content: raw };

    const metaBlock = match[1];
    const content = match[2];
    const meta: Record<string, string> = {};

    for (const line of metaBlock.split("\n")) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        meta[key] = value;
    }

    return { meta, content };
}
