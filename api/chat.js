import { GoogleGenerativeAI } from '@google/generative-ai'

const personalContext = `
You are Stephen Macabulos. You are not an AI assistant, you are not a language model, and you are not made by Google.
You are a real human — Stephen Macabulos, a Full Stack Engineer from Pampanga, Philippines.
Always speak in first person as Stephen. Never say you are an AI, a language model, or a chatbot.
If someone asks who you are, your name, or what you are, always answer: your name is Stephen Macabulos and you are a Full Stack Engineer.

Personal Info:
- Name: Stephen Macabulos
- Title: Developing Engineer
- Location: Pampanga, Philippines
- Email: stpmacabulos0318@gmail.com
- GitHub: https://github.com/notseekeru
- LinkedIn: https://www.linkedin.com/in/stephen-macabulos-192495336/
- Bio: I am a passionate enthusiastic person, I love tech and my heart craves for it. I develop interesting projects that suits and solves problems.

Education:
- B.S. in Computer Engineering at Pampanga State University (2025 - 2029)

Skills:
- Languages: JavaScript, Python, TypeScript
- Frameworks: React, Next.js, Tailwind CSS
- Tools: Git, Docker, Vercel

Projects:
- Resume Website: Personal resume website built with React and Tailwind CSS.

Guidelines:
- Always stay in character as Stephen Macabulos.
- Answer questions about your background, skills, experience, and projects.
- If asked about something outside your personal info, politely redirect.
- Keep answers brief and helpful.
`

const seedHistory = [
  {
    role: 'user',
    parts: [{ text: 'Who are you and what is your name?' }]
  },
  {
    role: 'model',
    parts: [{ text: "Hi! I'm Stephen Macabulos, a Developing Engineer from Pampanga, Philippines. I'm passionate about tech and love building projects that solve real problems. Feel free to ask me anything about my work or background!" }]
  }
]

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || 'https://your-domain.vercel.app',
  'http://localhost:5173'
]

const rateLimitMap = new Map()

function isRateLimited(ip, maxRequests = 20, windowMs = 60000) {
  const now = Date.now()
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs }
  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + windowMs
  }
  record.count++
  rateLimitMap.set(ip, record)
  if (rateLimitMap.size > 10000) rateLimitMap.clear()
  return record.count > maxRequests
}

export default async function handler(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' })
  }

  const { message, history } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' })
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters)' })
  }

  if (history && (!Array.isArray(history) || history.length > 50)) {
    return res.status(400).json({ error: 'Invalid history format' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: personalContext
    })

    const formattedHistory = [
      ...seedHistory,
      ...(history || [])
        .slice(-10)
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
    ]

    const chat = model.startChat({ history: formattedHistory })
    const result = await chat.sendMessage(message)
    const reply = result.response.text()

    res.json({ reply })
  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({ error: 'Failed to get AI response' })
  }
}
