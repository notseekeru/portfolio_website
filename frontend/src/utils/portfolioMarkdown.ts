import personalData, { type ProjectItem, type SkillItem, type Skills } from "../data/personalData";
import { loadBlogs, type BlogPost } from "./blogLoader";
import { infrastructureChart } from "./infrastructureChart";

/**
 * Latest-blog cap for the exported doc. Blogger caps the assembled markdown so
 * the copy stays small enough that an agent/HR paste stays readable. Raise the
 * constant to widen the window; never reach past a fractional head-count of
 * posts past their body load — the docs are rich.
 */
export const LATEST_BLOG_CAP = 4;

const stripTrailingNewlines = (s: string): string => `${s.trimEnd()}\n`;

function skillLines(kind: string, items: SkillItem[]): string {
    if (items.length === 0) return "";
    const row = items.map((s) => `${s.name}${s.summary ? ` — ${s.summary}` : ""}`).join("; ");
    return `\n- **${kind}**: ${row}\n`;
}

function skillsSection(skills: Skills): string {
    const sections = [skillLines("Languages", skills.languages ?? []), skillLines("Frameworks", skills.frameworks ?? []), skillLines("Tools", skills.tools ?? [])].join("");
    return sections || "";
}

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

/** Full raw markdown body of the 4 most recent posts + indexed headers. Returns '' if none. */
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

/** Build a single plain-markdown document of the whole portfolio, ready to paste. */
export async function buildPortfolioMarkdown(): Promise<string> {
    const { status, title, location, email, bio, github, linkedin, experience, education, skills, projects, name } = personalData;

    const intro = [`# ${name}`, "", title ?? "", status ? `_${status}_` : "", bio ? `\n${bio}`.trim() : "", `\n**Location:** ${[location, email].filter(Boolean).join(" · ")}`, "", `- GitHub: ${github ?? ""}`, `- LinkedIn: ${linkedin ?? ""}`].filter((line) => line.trim() !== "").join("\n");

    const exp = (experience ?? []).map((x) => [`### ${x.title} — ${x.company}`, x.duration ? `_${x.duration}_` : "", x.responsibilities].filter(Boolean).join("\n")).join("\n\n");

    const edu = (education ?? []).map((ed) => [`### ${ed.degree} — ${ed.institution}`, ed.duration ? `_${ed.duration}_` : ""].filter(Boolean).join("\n")).join("\n\n");

    const sectionIf = (titleRow: string, content: string) => (content.trim() ? `\n\n# ${titleRow}\n\n${content.trim()}\n` : "");

    const sections = [
        intro,
        sectionIf("Experience", exp),
        sectionIf("Education", edu),
        sectionIf("Skills", skillsSection(skills)),
        sectionIf("Projects", projectsSection(projects)),
        sectionIf("Architecture", ["```mermaid", infrastructureChart, "```"].join("\n")),
        sectionIf("Latest Blog Posts", await latestBlogsSection(LATEST_BLOG_CAP)),
    ];

    sections.push("", "---", "", `_Generated from https://portfolio.seekeru.tech — full portfolio, ${new Date().toISOString().slice(0, 10)}._`, "");

    return stripTrailingNewlines(sections.join("\n"));
}
