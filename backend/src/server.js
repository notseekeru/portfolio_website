import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import chatRoute from './routes/chat.js'
import contactRoute from './routes/contact.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(helmet())
const corsallowed = ["http://localhost:5173", "https://portfolio.seekeru.tech"]
app.use(cors({ origin: corsallowed }))
app.use(express.json({ limit: '100kb' }))
app.set('trust proxy', 1)

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' }
})

app.use('/api/chat', chatLimiter, chatRoute)
app.use('/api/contact', contactLimiter, contactRoute)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
