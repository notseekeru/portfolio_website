# STYLES — Frontend Design System

Single source of truth for the frontend visual design. Tailwind 4 + custom tokens/utilities in `frontend/src/index.css`. Prefer these over ad-hoc values.

Editorial dark theme: warm ink base, bone text, teal (links/CTAs) + amber (highlights) duet, serif display headings over sans body.

## Tokens

Defined in the `@theme` block of `index.css`. Use via Tailwind utilities (`bg-*`, `text-*`, `border-*`).

| Token | Class prefix | Value | Purpose |
|-------|--------------|-------|---------|
| `ink` | `bg-ink` | `#0c0a08` | Page background (deep near-black) |
| `surface` | `bg-surface` | `#15120e` | Cards, panels |
| `border` | `border-border` | `#2a261d` | Hairline dividers, card borders |
| `bone` | `text-bone` | `#ece8dc` | Primary text |
| `accent` | `text/bg-accent` | `#94c9a5` | Links, CTAs (teal) |
| `amber` | `text/bg-amber` | `#e0ad50` | Highlights, spot accents |
| `muted` | `text-muted` | `#a29a88` | Secondary/helper text (brightened for contrast) |
| `signal-green` | `bg-signal-green` | `#7fb98a` | Status = healthy/available |
| `signal-amber` | `text-signal-amber` | `#d9b45a` | Status = attention/favorite |
| `signal-red` | `bg-signal-red` | `#d07878` | Status = error/risk |
| `font-sans` | Tailwind | "Inter" | Body/copy |
| `font-mono` | Tailwind | "JetBrains Mono" | Code, technical labels |
| `font-serif` | `font-display` | "Newsreader" | Editorial display headings |

Base (`@layer base`): page bg `ink`, text `bone`; custom 6px scrollbar.

## Signature Utilities

| Utility | Effect |
|---------|--------|
| `font-display` | Serif display type for headings |
| `glow-white` / `glow-white-hover` | Soft white glow for primary CTAs (monochrome pop) |
| `link-pop` / `link-pop-hover` | Sweeping white underline for hierarchy links |

Accent usage rules: `accent` (teal) = interactive (links, CTAs, hover states); `amber` = non-interactive highlights (badges, initial blocks). Do not apply teal to both roles.
## Motion

Keyframed in `index.css`, used as utilities. Motion is intentionally conservative — reserve for section-level reveals, not every card:

| Utility | Timing | Use |
|---------|--------|-----|
| `animate-fade-in` | 0.3s | Generic reveals |
| `animate-fade-in-up` | 0.5s | Large blocks entering view |

Scroll-triggered: `useInView` hook gates reveals. Avoid per-card stagger spam.

## Layout Conventions

- Page width: `max-w-6xl`, horizontal padding `px-6`.
- Asymmetric grids (e.g. hero `grid-cols-[1.1fr_0.9fr]`) preferred over centered stacks.
- Cards: `bg-surface` + `border-border` (straight corners preferred over heavy rounded/glow).
- Typography: headings `font-display` (serif); big hero scale (`text-5xl`/`7xl`); labels via `font-mono`, minimal letter-spacing (no `tracking-[0.3em] uppercase` cliché).
- Section eyebrows: `font-mono text-xs tracking-widest text-accent` in `NN / SECTION` form, e.g. `01 / WORK`.

## Blog Prose (`.blog-prose`)

Content typography from rendered markdown:
- The body renders via a unified remark/rehype pipeline (`frontend/src/utils/markdown.ts`), then Prism (`SyntaxHighlighter`) and Mermaid (`MermaidRenderer`) post-process the DOM for code + diagrams.
- GFM tables are supported: emitted as `<div class="blog-table-wrapper"><table>` with `<thead>/<tbody>`, styled with 1px `border-border` hairlines, `surface` header band, zebra body, `overflow-x` scroll on narrow rows.
- Base: `bone`, 15px, line-height 1.8; headings `font-display` (serif).
- Links teal-underline; blockquote teal-left border, italic.
- Code highlighting: PrismJS with a warm syntax palette on the `ink` code-block (teal/amber/bone-toned tokens), hardcoded in `index.css`; wrapped `.blog-code-block` + `language-*` on `<code>`.
- Mermaid fences render `<div class="mermaid">` for `MermaidRenderer`; inline images max-width + rounded.

## Rules

1. All color VALUES live in exactly one place: the `@theme` block in `index.css` (and the `MERMAID_THEME` const in `src/utils/InteractiveMermaid.tsx`, which mirrors it for Mermaid's literal strings).
2. Reuse utilities — don't reinvent fonts/colors in components.
3. Never write raw hex in JSX/TSX/CSS outside `@theme` / `MERMAID_THEME`. A build-time guard (`frontend/scripts/check-tokens.sh`, run by `npm run build`) fails the build if a stray hex appears.
4. `accent` = interactive only; `amber` = highlights only; never reuse for both.
5. `--color-ink` is the page background — if the page ever shows white, this token was dropped from `@theme` (see the guard).
6. No cyan/purple or rainbow gradients in the current system; the only color beyond the warm theme are the semantic signals `--color-signal-{green,amber,red}` used strictly for status dots/badges.
