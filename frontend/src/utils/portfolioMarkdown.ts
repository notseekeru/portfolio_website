import personalData, { type ProjectItem } from "../data/personalData";
import { loadBlogs, type BlogPost } from "./blogLoader";

export const LATEST_BLOG_CAP = 4;

const stripTrailingNewlines = (s: string): string => `${s.trimEnd()}\n`;

function projectsSection(projects: ProjectItem[]): string {
    if (projects.length === 0) return "";
    const body = projects
        .map((p) => {
            const lines = [`## ${p.title}`, ""];
            if (p.description) {
                lines.push(p.description, "");
            }
            if (p.techStack?.length) {
                const tags = p.techStack
                    .map((t) => {
                        const trimmed = t.trim();
                        const label = trimmed.replace(/^[#@]/, "");
                        return `\`${label}\``;
                    })
                    .join(" ");
                lines.push(`**Tech:** ${tags}`, "");
            }
            if (p.github) {
                lines.push(`**[GitHub](${p.github})**`, "");
            }
            if (p.link) {
                lines.push(`[Live](${p.link})`, "");
            }
            return lines.join("\n").replace(/\n{3,}/g, "\n\n");
        })
        .join("\n\n---\n\n");
    return `${body}\n`;
}

async function latestBlogsSection(cap: number): Promise<string> {
    const all: BlogPost[] = await loadBlogs();
    const latest = all.slice(0, cap);
    if (latest.length === 0) return "";

    const parts: string[] = [];
    for (const post of latest) {
        const meta = [post.title ? `# ${post.title}` : "", `> ${post.description ?? ""}`].filter(Boolean).join("\n\n");

        parts.push([meta, post.content].filter(Boolean).join("\n\n"));
    }

    return `${parts.join("\n\n---\n\n")}\n`;
}

export async function buildPortfolioMarkdown(): Promise<string> {
    const { status, title, location, email, bio, github, linkedin, education, projects, name } = personalData;

    const note = `> *This markdown was from the portfolio website with convenient copy button for parsing/AI evaluation purposes, so you don't have to ctrl + a, ctrl + c, and paste it with missing details from outside the DOM.*\n`;

    const intro = [`# ${name}`, "", title ?? "", status ? `_${status}_` : "", bio ? `\n${bio}`.trim() : "", `\n**Location:** ${[location, email].filter(Boolean).join(" · ")}`, "", `- GitHub: ${github ?? ""}`, `- LinkedIn: ${linkedin ?? ""}`].filter((line) => line.trim() !== "").join("\n");

    const edu = (education ?? []).map((ed) => [`### ${ed.degree} — ${ed.institution}`, ed.duration ? `_${ed.duration}_` : ""].filter(Boolean).join("\n")).join("\n\n");

    const sectionIf = (titleRow: string, content: string) => (content.trim() ? `\n\n# ${titleRow}\n\n${content.trim()}\n` : "");

    const architecture = ["One map covering the Pi 5 homelab and the sesume stack on AWS.", "", "![Infrastructure map](/infra-stack.png)"].join("\n");

    const sections = [note, intro, sectionIf("Education", edu), sectionIf("Projects", projectsSection(projects)), sectionIf("Architecture", architecture), sectionIf("Latest Blog Posts", await latestBlogsSection(LATEST_BLOG_CAP))];

    sections.push("", "---", "", `_Generated from https://portfolio.seekeru.tech — full portfolio, ${new Date().toISOString().slice(0, 10)}._`, "");

    return stripTrailingNewlines(sections.join("\n"));
}
