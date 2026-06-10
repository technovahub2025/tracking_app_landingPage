import { useState, useCallback, useRef } from 'react'
import { SK } from '../data/constants.js'
import { useLocalStorage } from './useLocalStorage.js'

function buildGreeting(lang, name) {
  if (lang === 'ta') {
    return {
      content: `Vanakkam${name ? ` ${name}` : ''}! TrackPulse Employee Monitoring Platform-ku varaverkkiren.\n\nNaan ungalukku idhula help panna mudiyum:\n- Employee registration\n- Employee login\n- Live location tracking\n- Supervisor monitoring\n- Google Maps links\n- Video updates\n- Date range filters\n\nEnna help venum?`,
      chips: ['Employee Registration', 'Live Tracking', 'Supervisor Dashboard', 'Google Maps', 'Video Updates', 'Submit Data'],
    }
  }

  return {
    content: `Welcome${name ? `, ${name}` : ''}! This is the TrackPulse Employee Tracking Assistant.\n\nI can help you with:\n- Employee registration\n- User login\n- Live location tracking\n- Supervisor dashboard\n- Google Maps links\n- Video updates\n- Employee account management\n\nHow can I help you with TrackPulse today?`,
    chips: ['Employee Registration', 'Live Tracking', 'Supervisor Dashboard', 'Google Maps', 'Video Updates', 'Submit Data'],
  }
}

function isOldGreeting(msg) {
  const text = String(msg?.content || '')
  return /Welcome to TechnovaHub|TechnovaHub|Software Development|AI Solutions|Automation Services|Mobile Applications|Internship Programs|Technical Consultation/i.test(text)
}

function migrateMessages(messages, lang, userName) {
  if (!Array.isArray(messages) || messages.length === 0) return messages
  const first = messages[0]
  if (first?.role !== 'assistant' || !isOldGreeting(first)) return messages
  const updated = { role: 'assistant', ...buildGreeting(lang, userName), time: first.time || new Date().toISOString() }
  return [updated, ...messages.slice(1)]
}

export function useChatState() {
  const [lang, setLang] = useLocalStorage(SK.LANG, 'en')
  const [userName, setUserName] = useLocalStorage(SK.NAME, '')
  const [tncRaw, setTncRaw] = useLocalStorage(SK.TNC, '0')
  const tncDone = tncRaw === '1'

  const [messages, setMessages] = useState(() => {
    if (tncRaw !== '1') return []
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(SK.CHAT) : null
      return migrateMessages(JSON.parse(stored || '[]'), 'en', '')
    } catch { return [] }
  })

  const greetRef = useRef(false)

  const persistMessages = useCallback((msgs) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SK.CHAT, JSON.stringify(msgs.slice(-120)))
      }
    } catch { /* localStorage unavailable */ }
  }, [])

  const addMessage = useCallback((msg) => {
    setMessages(prev => {
      const next = [...prev, msg]
      persistMessages(next)
      return next
    })
  }, [persistMessages])

  const setMessagesAndPersist = useCallback((updater) => {
    setMessages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persistMessages(next)
      return next
    })
  }, [persistMessages])

  const clearChat = useCallback(() => {
    setMessages([])
    greetRef.current = false
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(SK.CHAT)
      }
    } catch { /* */ }
    setTimeout(() => {
      setMessages([{ role: 'assistant', ...buildGreeting(lang, userName), time: new Date().toISOString() }])
      greetRef.current = true
    }, 50)
  }, [lang, userName])

  const exportChat = useCallback(() => {
    const lines = ['TrackPulse Employee Tracking Assistant Chat Export', new Date().toLocaleString(), '-'.repeat(42), '']
    messages.forEach(m => { lines.push(`${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`); lines.push('') })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }))
    a.download = `trackpulse-chat-${Date.now()}.txt`
    a.click()
  }, [messages])

  const initGreeting = useCallback((open) => {
    if (open && tncDone && !greetRef.current && messages.length === 0) {
      greetRef.current = true
      const msg = { role: 'assistant', ...buildGreeting(lang, userName), time: new Date().toISOString() }
      setMessages([msg])
      persistMessages([msg])
    } else if (open && tncDone && messages.length > 0 && isOldGreeting(messages[0])) {
      const next = migrateMessages(messages, lang, userName)
      setMessages(next)
      persistMessages(next)
    }
  }, [tncDone, messages, lang, userName, persistMessages])

  return {
    messages,
    setMessages: setMessagesAndPersist,
    addMessage,
    lang,
    setLang,
    userName,
    setUserName,
    tncRaw,
    setTncRaw,
    tncDone,
    greetRef,
    clearChat,
    exportChat,
    initGreeting,
    buildGreeting,
  }
}
