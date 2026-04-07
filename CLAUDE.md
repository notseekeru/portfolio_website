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

## Environment Variables

Backend `.env` (see `backend/.env.example`):

```
GEMINI_API_KEY=your_google_gemini_api_key_here
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
PORT=5000
```

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
