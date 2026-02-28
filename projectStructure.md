# projectStructure.md — Codebase Navigation Guide

## Root Layout

```
resume_websitev2/
├── frontend/
├── backend/
├── api/
├── docker-compose.yml
├── vercel.json
├── CLAUDE.md
├── projectStructure.md
└── personal.md
```

---

## frontend/

The React + Vite application. All UI lives here.

```
frontend/
├── public/
│   └── profile.png             Profile photo (copy from root)
├── src/
│   ├── data/
│   │   └── personalData.js     Single source of truth for all personal info
│   ├── components/
│   │   ├── Navbar.jsx          Fixed top navigation bar
│   │   ├── Hero.jsx            Landing hero section (name, title, CTAs)
│   │   ├── About.jsx           Short bio + quick stats
│   │   ├── Experience.jsx      Work experience timeline
│   │   ├── Skills.jsx          Tech stack badges grid
│   │   ├── ChatBot.jsx         Floating AI chatbot widget
│   │   ├── ErrorBoundary.jsx   React error boundary (crash recovery)
│   │   └── Footer.jsx          Site footer
│   ├── content/
│   │   └── blogs/              Drop .md files here to create blog posts
│   │       ├── *.md            Blog post markdown (frontmatter: title, date, description, image)
│   ├── utils/
│   │   ├── markdown.js         Lightweight markdown parser (no external deps)
│   │   └── blogLoader.js       Loads blogs from content/blogs/ via import.meta.glob
│   ├── pages/
│   │   ├── Home.jsx            Assembles Hero + About + Experience + Skills
│   │   ├── Projects.jsx        Project cards grid + template projects
│   │   ├── Blog.jsx            Blog listing page (grid of blog cards)
│   │   ├── BlogPost.jsx        Individual blog post view (renders markdown)
│   │   └── Contact.jsx         Contact form + social links
│   ├── App.jsx                 Router setup + layout wrapper
│   ├── main.jsx                React entry point
│   └── index.css               Global styles + Tailwind directives
├── index.html                  Vite HTML entry
├── vite.config.js              Vite config (proxy for local dev)
├── tailwind.config.js          Tailwind theme customization
├── postcss.config.js
├── .env.example                Frontend env template
├── package.json
└── Dockerfile                  Frontend Docker container (local dev)
```

### Key files for common tasks

| Task | File |
|---|---|
| Update personal info | `src/data/personalData.js` |
| Add a new page | `src/pages/` + register route in `src/App.jsx` |
| Add a new blog post | Drop a `.md` file into `src/content/blogs/` with frontmatter |
| Add a new component | `src/components/` |
| Add a template project | `src/data/personalData.js` → `templateProjects` array |
| Change theme colors | `tailwind.config.js` |
| Change fonts | `index.html` (link tag) + `tailwind.config.js` |

---

## backend/

Express.js server used **only for local development via Docker Compose**. In production, Vercel Serverless Functions replace this.

```
backend/
├── src/
│   ├── routes/
│   │   ├── chat.js             POST /api/chat handler
│   │   └── contact.js          POST /api/contact handler
│   └── server.js               Express app entry point
├── .env.example                Backend env template
├── package.json
└── Dockerfile                  Backend Docker container (local dev)
```

---

## api/

Vercel Serverless Functions — mirrors the backend routes for **production deployment**.

```
api/
├── chat.js                     POST /api/chat (Vercel serverless)
└── contact.js                  POST /api/contact (Vercel serverless)
```

---

## docker-compose.yml

Orchestrates local development:
- `frontend` service — runs Vite dev server on port `5173`
- `backend` service — runs Express on port `5000`
- Frontend proxies `/api/*` to `backend:5000`

---

## vercel.json

Configures Vercel build:
- Builds frontend from `frontend/` directory
- Serves `/api/*` routes from `api/` serverless functions
- All other routes fall back to React SPA

---

## Data Flow

```
User message
    ↓
ChatBot.jsx (React)
    ↓
POST /api/chat
    ↓ (local dev)           ↓ (production)
backend/src/routes/chat.js   api/chat.js
    ↓                            ↓
Google Gemini API  ←─────────────┘
    ↓
AI response → ChatBot.jsx
```

---

## Adding a Real Project

Open `frontend/src/data/personalData.js` and add to the `projects` array:

```js
{
  title: "Project Name",
  description: "What it does.",
  techStack: ["React", "Node.js"],
  link: "https://github.com/...",
  image: "https://...",
  isTemplate: false
}
```

## Adding a Template Project

Same as above but set `isTemplate: true`. Template projects display a "Template" badge on the card.

## Adding a Blog Post

Create a `.md` file in `frontend/src/content/blogs/`. The filename becomes the URL slug (e.g., `my-post.md` → `/blog/my-post`).

Each file must start with YAML frontmatter:

```markdown
---
title: My Blog Post Title
date: 2026-03-01
description: Short summary shown on the blog card.
image: /blog/screenshot.png
---

Your markdown content here...
```

- **image** — optional; place screenshots in `frontend/public/blog/`
- Posts are automatically sorted by date (newest first)
- No build config or code changes needed — just drop the file and it appears
