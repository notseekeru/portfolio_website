import { Router } from 'express'

const router = Router()

router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
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
      const text = await response.text()
      console.error(`n8n error ${response.status}:`, text)
      throw new Error(`n8n responded with ${response.status}: ${text}`)
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Contact webhook error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
