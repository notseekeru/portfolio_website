# STYLES — Frontend Design System

Single source of truth for the frontend visual design. Tailwind 4 + custom tokens/utilities in `frontend/src/index.css`. Prefer these over ad-hoc values.

Editorial dark theme: warm ink base, bone text, teal (links/CTAs) + amber (highlights) duet, serif display headings over sans body.

## Tokens

Defined in the `@theme` block of `index.css`. Use via Tailwind utilities (`bg-*`, `text-*`, `border-*`).

| Token | Class prefix | Value | Purpose |
|-------|--------------|-------|---------|
| `ink` | `bg-ink` | `#14140f` | Page background |
| `surface` | `bg-surface` | `#211e17` | Cards, panels |
| `border` | `border-border` | `#322d24` | Hairline dividers, card borders |
| `bone` | `text-bone` | `#e8e6da` | Primary text |
| `accent` | `text/bg-accent` | `#8abf9a` | Links, CTAs (muted teal) |
| `amber` | `text/bg-amber` | `#d9a441` | Highlights, spot accents |
| `muted` | `text-muted` | `#8a8271` | Secondary/helper text |
| `font-sans` | Tailwind | "Inter" | Body/copy |
| `font-mono` | Tailwind | "JetBrains Mono" | Code, technical labels |
| `font-serif` | `font-display` | "Newsreader" | Editorial display headings |

Base (`@layer base`): page bg `ink`, text `bone`; custom 6px scrollbar.

## Signature Utilities

| Utility | Effect |
|---------|--------|
| `font-display` | Serif display type for headings |

Accent usage rules: `accent` (teal) = interactive (links, CTAs, hover states); `amber` = non-interactive highlights (badges, initial blocks). Do not apply teal to color both roles.

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
- Section eyebrows: `font-serif italic text-accent` prefixed with a number, e.g. `01 — Work`.

## Blog Prose (`.blog-prose`)

Content typography from rendered markdown:
- Base: `bone`, 15px, line-height 1.8; headings `font-display` (serif).
- Links teal-underline; blockquote teal-left border, italic.
- Code highlighting: PrismJS, dark theme (GitHub-dark palette) kept dark as deliberate terminal contrast — tokens hardcoded in `index.css`.
- Mermaid diagrams, images: rounded, `border-border`, full-width.

## Rules

1. Change tokens in `@theme`, never inline hex.
2. Reuse utilities — don't reinvent fonts/colors in components.
3. Keep color usage limited to the token set (never raw hex in JSX/TSX).
4. `accent` = interactive only; `amber` = highlights only; never reuse for both.
5. No glow shadows, no cyan/purple gradients in the current system.
