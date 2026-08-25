# STYLES — Frontend Design System

Single source of truth for the frontend visual design. Tailwind 4 + custom tokens/utilities in `frontend/src/index.css`. Prefer these over ad-hoc values.

## Tokens

Defined in the `@theme` block of `index.css`. Use via Tailwind utilities (`bg-*`, `text-*`, `border-*`).

| Token | Class prefix | Value | Purpose |
|-------|--------------|-------|---------|
| `surface` | `bg-surface` | `#161616` | Cards, panels, section backgrounds |
| `border` | `border-border` | `#252525` | Hairline dividers, card borders |
| `accent` | `text/bg-accent` | `#00d9ff` | Primary accent, links, highlights |
| `accent-purple` | `bg-accent-purple` | `#7c3aed` | Secondary accent (gradient partner) |
| `muted` | `text-muted` | `#888888` | Secondary/helper text |
| `font-sans` | Tailwind | "Inter" | Body/copy |
| `font-mono` | Tailwind | "JetBrains Mono" | Code, technical labels |

Base (`@layer base`): page bg `zinc-950`, text `zinc-100`; custom 6px scrollbar.

## Signature Utilities

| Utility | Effect |
|---------|--------|
| `text-gradient` | Cyan→purple (135deg) text fill gradient |
| `glow-accent` / `-hover` | Cyan glow shadow, 20/30px blur |
| `border-gradient` | 1px transparent border with cyan→purple gradient edge |

## Motion

Keyframed in `index.css`, used as utilities:

| Utility | Timing | Use |
|---------|--------|-----|
| `animate-fade-in` | 0.3s | Generic reveals |
| `animate-fade-in-up` | 0.5s | Cards/blocks entering view |
| `animate-slide-in-left` / `-right` | 0.5s | Directional entrances |
| `animate-hero-in` | 0.7s | Hero load sequence |
| `animate-pulse` / `-spin` / `-bounce` | Tailwind | Loading/state hints |

Scroll-triggered: `useInView` hook gates the fade/slide animations.

## Layout Conventions

- Page width: `max-w-6xl`, horizontal padding `px-6`.
- Cards: `bg-surface` + `border-border` + rounded (`rounded-lg`/`xl`/`2xl`).
- Spacing: vertical rhythm in standard spacing scale (`py-3`, `py-16`, etc.) — keep consistent, no magic numbers.
- Typography: headings `font-bold`, big hero scale (`text-5xl`/`7xl`); labels/mono via `font-mono`, `tracking-tight`/`wide`.

## Blog Prose (`.blog-prose`)

Content typography from rendered markdown:
- Base: `zinc-300`, 15px, line-height 1.8; code blocks `zinc-900` panels.
- Links accent-underline; blockquote accent-left border, italic.
- Code highlighting: PrismJS, dark theme (GitHub-dark palette) — token colors hardcoded in `index.css`.
- Mermaid diagrams, images: rounded, `border-border`, full-width.

## Rules

1. Change tokens in `@theme`, never inline hex.
2. Reuse utilities — don't reinvent gradients/glow in components.
3. Add new motion under the existing keyframe scale, matching durations.
4. Keep color usage limited to the token set (never raw hex in JSX/TSX).
