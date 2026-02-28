# CLAUDE.md — Resume Website v2

## Project Overview

Personal resume website for a Full Stack Developer. Built with React (Vite), Node.js, and Express.js. Features a landing page, dedicated projects page, dynamic blog, contact page, and an AI chatbot powered by Google Gemini that impersonates the owner.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Routing | React Router v6 |
| Backend (local) | Node.js + Express.js |
| Backend (production) | Vercel Serverless Functions (`/api`) |
| AI Chatbot | Google Gemini API (`gemini-2.5-flash`) |
| HTTP Client | Axios |
| Local Dev Orchestration | Docker Compose |
| Production Deployment | Vercel |

---

## Architecture

```
resume_websitev2/
├── frontend/           React Vite app
├── backend/            Express.js (Docker local dev only)
├── api/                Vercel serverless functions (production)
├── docker-compose.yml  Local dev only
├── vercel.json         Vercel deployment config
├── CLAUDE.md           This file
├── projectStructure.md Codebase navigation guide
└── personal.md         Owner's personal information (source of truth)
```

### Deployment Model

- **Local** — Docker Compose spins up two containers: `frontend` (Vite dev server) and `backend` (Express). Frontend proxies `/api/*` to the backend container.
- **Production** — Vercel builds the frontend and hosts it as a static site. The Express routes are mirrored as Vercel Serverless Functions in `/api/`.

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, About, Experience, Skills sections |
| `/projects` | Projects | Grid of project cards (real + template) |
| `/blog` | Blog | Blog listing — markdown-driven, auto-loaded from `frontend/src/content/blogs/` |
| `/blog/:slug` | BlogPost | Individual blog post rendered from `.md` file |
| `/contact` | Contact | Contact form + social links |

---

## Features

- Responsive dark-theme UI
- AI chatbot widget (floating) — impersonates the owner using Gemini
- Smooth page transitions and scroll animations (Framer Motion)
- Template project cards auto-generated on the Projects page
- Dynamic blog system — drop `.md` files into `frontend/src/content/blogs/` and they auto-appear
- Contact form sends submissions via n8n webhook
- React ErrorBoundary for graceful crash recovery

---

## Environment Variables

Backend `.env` (see `backend/.env.example`):

```
GEMINI_API_KEY=your_google_gemini_api_key_here
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
PORT=5000
```

Frontend `.env` (see `frontend/.env.example`):

```
VITE_API_URL=http://localhost:5000
```

In production on Vercel, set these in the Vercel dashboard under Project Settings → Environment Variables:
- `GEMINI_API_KEY` — Google Gemini API key
- `N8N_WEBHOOK_URL` — n8n webhook URL for contact form
- `ALLOWED_ORIGIN` (optional) — production domain for CORS (defaults to `https://your-domain.vercel.app`)

---

## Personal Data

All personal information lives in `personal.md`. The frontend reads from `frontend/src/data/personalData.js`, which is manually kept in sync with `personal.md`. When updating your info, update both files.

---

## AI Chatbot

- Model: `gemini-2.5-flash`
- The system prompt is built from `personalData.js` in the backend
- The chatbot is instructed to answer as the portfolio owner
- API route: `POST /api/chat` — body: `{ message: string, history: Array }`

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/chat` | AI chatbot — sends message + history, returns AI reply |
| `POST` | `/api/contact` | Contact form — forwards name/email/message to n8n webhook |
| `GET` | `/api/health` | Health check (local dev only) |

---

## Docker Compose (Local Dev)

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Vercel Deployment

1. Push the repo to GitHub
2. Import in Vercel dashboard
3. Set environment variables: `GEMINI_API_KEY`, `N8N_WEBHOOK_URL`, `ALLOWED_ORIGIN`
4. Vercel auto-detects the config from `vercel.json`
5. Every push to `main` triggers automatic redeploy

---

## Coding Conventions

- No comments in code
- camelCase for variables and functions
- Component files use PascalCase
- All data centralized in `frontend/src/data/personalData.js`

---

## Security Measures

### Rate Limiting
- **Backend (Express):** `express-rate-limit` — 20 req/min on `/api/chat`, 5 req/min on `/api/contact`
- **Vercel Serverless:** In-memory IP-based rate limiter with same limits

### Input Validation
- Chat message: max 1000 characters, string type enforced
- Chat history: max 50 entries, array type enforced
- Contact name: max 100 characters
- Contact email: regex validated, max 254 characters
- Contact message: max 5000 characters
- Frontend `maxLength` attributes mirror backend limits

### Security Headers
- Backend uses `helmet` middleware for HTTP security headers
- Request body limited to 100KB via `express.json({ limit: '100kb' })`

### CORS
- Backend: restricted to `http://localhost:5173`
- Vercel functions: allowlist via `ALLOWED_ORIGIN` env var + localhost

### Error Handling
- Internal error details are never leaked to clients
- React `ErrorBoundary` wraps the entire app for graceful crash recovery

### Docker
- Containers run as non-root user (`appuser`)

---
