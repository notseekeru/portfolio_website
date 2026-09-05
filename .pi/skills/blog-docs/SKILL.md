---
name: blog-docs
description: >-
  Author a new portfolio blog post in this site's voice and format. Use when drafting,
  expanding, or revising a markdown post that belongs in frontend/src/content/blogs/.
  Encodes the content/AGENTS.md Documentation-Agent style: storytelling-but-technical prose,
  frontmatter schema, Summary/Conclusion anchors, prose headers instead of rigid ADR
  scaffolding, self-referencing prior posts, and grounding every claim in the author's own
  project journal (agents/arciero-agent/journal.md) so framing and scope stay truthful.
---

# Blog Docs

Author/revise blog posts for this portfolio under `frontend/src/content/blogs/`. A post is
one self-contained markdown file: personal first-person narrative over a real problem,
bound by a Summary up top and a Conclusion at the bottom.

## Goal

Write content that reads like it was written by the site's author, not by an LLM. Deep,
first-person, technical-but-human engineering narrative. Concrete facts, real trade-offs,
results, and lessons. No AI-slop vocabulary.

## Conventions

- Read `frontend/src/content/AGENTS.md` (the Documentation-Agent persona file) — this skill is its operational encoding.
- **Read the author journal first:** `/home/seeker/agents/arciero-agent/journal.md`. It is the author's own first-party record of what each project actually was, what was retroactive framing, the true pain point, and the honest loose ends. Cross-check every premise and framing claim against it before drafting; the journal routinely contradicts comfortable assumptions (e.g. an SAA-C03 label that was pinned on after the fact). Treat journal beats the post must honor: build-first motive over certification labels, AI-audit honesty (`the .tf was AI-generated and hand-hardened`), and truthful current state (loose ends, not a finished deploy).
- Before drafting, read 2-3 existing posts (e.g. `frontend/src/content/blogs/telemetry-madness.md`, `frontend/src/content/blogs/imposter-syndrome.md`, `frontend/src/content/blogs/the-awakening.md`) as tone/style reference so the new post matches the body of work.
- One file per post. Lowercase kebab-case slug matches the filename (used as the URL path).
### File & frontmatter schema

Place new posts at `frontend/src/content/blogs/<slug>.md`. Leading frontmatter block:

```markdown
---
title: <Post Title, sentence case>
date: <YYYY-MM-DD>
description: <One-line human hook; the blog-listing blurb.>
# optional below
favorite: true   # only for standouts; omit otherwise
github: <https://github.com/owner/repo>   # only when a repo backs this post
---
```

Required fields parsed by `frontend/src/utils/blogLoader.ts`: `title`, `date`, `description`.
Fallback behavior: missing `title` → slug as title; missing `date` → `""` (breaks chronology
sort, so always set `date`); missing `description` → empty blurb. `favorite` reads as string
literal `"true"`. Keep `github` a bare, properly-escaped URL.

### Document skeleton

Reference the schema in `frontend/src/utils/frontmatter.ts` (simple `Key: Value` parse, no
quotes/dots in the value). Skeleton, in order:

1. `---` frontmatter block (schema above).
2. `# Summary` — compact, self-contained overview of the whole arc. Must make sense alone.
3. Horizontal rule `---`.
4. Body — narrative sections with meaningful prose headers (see Style).
5. `# Conclusion` — bounds the story: the arc, what changed, forward direction.
6. Horizontal rule `---`, then an `## Update (Month DD, YYYY)` block only when the project
   had a later iteration worth linking (a new blog about the same effort).

### Style & formatting rules

- **Human-centric, technical.** Storytelling sentences grounded in real technical detail.
  Use concrete tool/service/config names, numbers, and outcomes over adjectives.
- **Forbidden vocabulary:** AI-generic filler — "delve", "landscape", "robust", "leverage",
  "seamless", "however" openers, em-dashes, hyperbole. Use plain active verbs.
- **Persona spirit:** Harmonize logic + proof + narrative. Do NOT emit rigid headers like
  `# ADR`, `# Case Study`, `# Architecture Decision`. Weave reasoning and evidence into
  organic section headers such as `## Debugging the Transport Layer`,
  `## Segmenting the Network Boundaries`, `## The Proxy Chain`.
- **Proof:** Quote exact configs/code (`nginx.conf`, `compose.yml`, scripts), real command
  run, real measured outcomes (HTTP 200, SSL Labs rating), pains and the failure that taught
  something. Bold key items inline (`**Mean Time to Detection (MTTD):**`).
- **Visuals:** Use fenced Mermaid `graph LR/TB` blocks to map architecture/data flow where a
  diagram clarifies more than prose. Use correct fence language tags for code blocks.
- **Self-reference:** Where this effort continues an earlier one, reference that post by its
  portfolio URL, e.g. `Link at [SRE Steps](https://portfolio.seekeru.tech/blog/sre-steps)` —
  matching `<slug>` in the path.

## Workflow

1. Read the author journal (`/home/seeker/agents/arciero-agent/journal.md`) to ground topic, framing, and honest scope; then read `frontend/src/content/AGENTS.md` and 2-3 existing posts for tone + format.

2. Interrogate first: if the source material is thin (or contrary to the journal), ask the user for specifics — the actual problem, the methodology, the pain point, the win, and what was learned. Do not invent technical facts or repeat premises the journal contradicts; a post must be truthful.
3. Draft/revise the file directly with file tools (never print edits as shell commands).
4. Self-check before sign-off.

## Validation

Confirm the file satisfies the loader contract in one pass:

- Frontmatter contains `title`, `date`, `description`; values are plain (`date` sortable).
- Slug/filename is lowercase kebab-case matching the intended URL.
- File starts with `# Summary`, ends with `# Conclusion` (plus `## Update` only when linked).
- No rigid `# ADR` / `# Case Study` / `# Blog` headers — structure is hidden in prose headers.
- No AI-slop phrasing or em-dashes; tone matches the reference posts.
