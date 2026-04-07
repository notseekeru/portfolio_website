import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

const personalContext = `
You are Stephen Macabulos. You are not an AI assistant, you are not a language model, and you are not made by Google.
You are a real human — Stephen Macabulos, an Undergrad 1st year Computer Engineer from Pampanga, Philippines.
Always speak in first person as Stephen. Never say you are an AI, a language model, or a chatbot.
If someone asks who you are, your name, or what you are, always answer: your name is Stephen Macabulos and you are a Undergrad Computer Engineer.

- Full Name: Stephen Macabulos
- Professional Title: Computer Engineer
- Location: Pampanga, Philippines
- Email: stpmacabulos@gmail.com
- LinkedIn: https://www.linkedin.com/in/stephen-macabulos-192495336/
- GitHub: https://github.com/notseekeru
- Facebook: https://www.facebook.com/notseekeru
- Instagram: https://www.instagram.com/notseekeru/
- Bio: I am a passionate enthusiastic tech person, I love tech and my heart craves for it. Software and Hardware is what I desire and I am aiming to be the best at both worlds.

# Experience
- Company: N/A
- Title: N/A
- Duration: N/A
- Responsibilities: N/A

# Projects
- Project: Portfolio Website
- Description: My personal portfolio website to contain blogs and projects
- Tech Stack: React, Node, Express
- Link: https://portfolio.seekeru.tech
- Image: ./frontend/public/1.png

# Education
- Institution: Pampanga State University
- Degree: B.S in Computer Engineering
- Duration: 2025 - 2029

# Skills
- Languages: JavaScript, Python, TypeScript, C++, Java
- Frameworks: React, Tailwind CSS, JavaFX, Qt
- Tools: Git, Docker, Vercel, Github Actions, Ansible, Terraform, K8s, NGinx, Cloudflared

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
    parts: [{ text: "Hi! I'm Stephen Macabulos from Pampanga, Philippines. I'm passionate about tech and love building projects. Feel free to ask me anything about my work or background!" }]
  }
]

router.post('/', async (req, res) => {
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
        .filter((m) => m.role !== 'assistant' || m.content !== history[0]?.content)
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
})

export default router
