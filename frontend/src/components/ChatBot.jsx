import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import personalData from '../data/personalData'

const apiUrl = import.meta.env.VITE_API_URL || ''

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm ${personalData.name}'s AI assistant. Ask me anything about his background, projects, or skills.`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)


    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await axios.post(`/api/chat`, {
        message: trimmed,
        history
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I ran into an issue. Please try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[500px] flex flex-col rounded-2xl border border-border bg-[#111111] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
              <div className="relative">
                <img
                  src={personalData.profilePicture}
                  alt={personalData.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div
                  className="hidden w-8 h-8 rounded-full bg-accent/20 items-center justify-center text-sm font-bold text-accent"
                  style={{ display: 'none' }}
                >
                  {personalData.name.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-surface" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-100">{personalData.name}</p>
                <p className="text-[10px] text-zinc-500">AI · Usually replies instantly</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 transition-colors p-1"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-[#0d0d0d] font-medium rounded-br-sm'
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/50'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 border border-zinc-700/50 px-3.5 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-zinc-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2 border border-border focus-within:border-accent/40 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything..."
                  maxLength={1000}
                  className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="text-accent disabled:text-zinc-700 transition-colors flex-shrink-0"
                  aria-label="Send"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-zinc-700 text-center mt-2">Powered by Gemini AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-accent text-[#0d0d0d] flex items-center justify-center shadow-lg glow-accent hover:scale-105 transition-all duration-200"
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
