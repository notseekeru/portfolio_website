# CLAUDE.md — Resume Website v2

## Project Overview

Personal resume website for a Full Stack Developer. Built with React (Vite), Node.js, and Express.js. Features a landing page, dedicated projects page, contact page, and an AI chatbot powered by Google Gemini that impersonates the owner.

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
| `/contact` | Contact | Contact form + social links |

---

## Features

- Responsive dark-theme UI
- AI chatbot widget (floating) — impersonates the owner using Gemini
- Smooth page transitions and scroll animations (Framer Motion)
- Template project cards auto-generated on the Projects page
- Contact form (frontend-only, no mailer wired unless added)

---

## Environment Variables

Backend `.env` (see `backend/.env.example`):

```
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
```

Frontend `.env` (see `frontend/.env.example`):

```
VITE_API_URL=http://localhost:5000
```

In production on Vercel, set `GEMINI_API_KEY` in the Vercel dashboard under Project Settings → Environment Variables.

---

## Personal Data

All personal information lives in `personal.md`. The frontend reads from `frontend/src/data/personalData.js`, which is manually kept in sync with `personal.md`. When updating your info, update both files.

---

## AI Chatbot

- Model: `gemini-1.5-flash`
- The system prompt is built from `personalData.js` in the backend
- The chatbot is instructed to answer as the portfolio owner
- API route: `POST /api/chat` — body: `{ message: string, history: Array }`

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
3. Set environment variable: `GEMINI_API_KEY`
4. Vercel auto-detects the config from `vercel.json`
5. Every push to `main` triggers automatic redeploy

---

## Coding Conventions

- No comments in code
- camelCase for variables and functions
- Component files use PascalCase
- All data centralized in `frontend/src/data/personalData.js`

---

## Future Features (add your requests here)

> Use this section to log features you want added. Format: `- [ ] Feature description`

- [ ] Dark/light mode toggle
- [ ] Blog section
- [ ] Resume PDF download button
- [ ] Analytics integration
