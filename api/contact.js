const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || 'https://your-domain.vercel.app',
  'http://localhost:5173'
]

const rateLimitMap = new Map()

function isRateLimited(ip, maxRequests = 5, windowMs = 60000) {
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
    return res.status(429).json({ error: 'Too many submissions, please try again later.' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ error: 'Invalid name (max 100 characters)' })
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  if (typeof message !== 'string' || message.length > 5000) {
    return res.status(400).json({ error: 'Message too long (max 5000 characters)' })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook URL not configured' })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    })

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`)
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Contact webhook error:', err.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
}
