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
- Section eyebrows: `font-mono text-xs tracking-widest text-accent` in `NN / SECTION` form, e.g. `01 / WORK`.

## Blog Prose (`.blog-prose`)

Content typography from rendered markdown:
- Base: `bone`, 15px, line-height 1.8; headings `font-display` (serif).
- Links teal-underline; blockquote teal-left border, italic.
- Code highlighting: PrismJS with a warm syntax palette on the `ink` code-block (teal/amber/bone-toned tokens), hardcoded in `index.css`.
- Mermaid diagrams, images: rounded, `border-border`, full-width.

## Rules

1. Change tokens in `@theme`, never inline hex.
2. Reuse utilities — don't reinvent fonts/colors in components.
3. Keep color usage limited to the token set (never raw hex in JSX/TSX).
4. `accent` = interactive only; `amber` = highlights only; never reuse for both.
5. No glow shadows, no cyan/purple gradients in the current system.
