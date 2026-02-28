import { Router } from 'express'

const router = Router()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', async (req, res) => {
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

  const webhookUrl = process.env.N8N_WEBHOOK_URL // WEBHOOK ENV VAR

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
      const text = await response.text()
      console.error(`n8n error ${response.status}:`, text)
      throw new Error(`n8n responded with ${response.status}: ${text}`)
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Contact webhook error:', err.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
