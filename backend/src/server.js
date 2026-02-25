import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRoute from './routes/chat.js'
import contactRoute from './routes/contact.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/chat', chatRoute)
app.use('/api/contact', contactRoute)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
