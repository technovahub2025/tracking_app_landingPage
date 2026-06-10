import { useState, useCallback, useRef, useEffect } from 'react'
import { API_URL } from '../data/constants.js'
import { buildSystemPrompt, parseChips, stripChips, needsPricing, needsCourses } from '../utils/chatUtils.js'
import { sfx } from '../utils/audio.js'

/**
 * useGemini — encapsulates all Gemini API logic via the backend proxy.
 * Returns { streaming, loading, sendToGemini }
 */
export function useGemini({ messages, setMessages, lang, intent, frustrated, userName, userCtx, tts, speak, resetInact, sessionId }) {
  const [loading, setLoading]     = useState(false)
  const [streaming, setStreaming] = useState('')
  const controllerRef             = useRef(null)

  // Abort on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [])

  const sendToGemini = useCallback(async (text, updatedMsgs, currentLang) => {
    // Abort any in-flight request
    if (controllerRef.current) controllerRef.current.abort()

    const sys = buildSystemPrompt({
      name: userName,
      ctx: userCtx,
      intent,
      frustrated,
      lang: currentLang,
    })

    const history = updatedMsgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const payload = {
      system_instruction: { parts: [{ text: sys }] },
      contents: history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
      },
      sessionId,
    }

    setLoading(true)
    setStreaming('')

    let retried = false

    const applyAssistantReply = (rawReply) => {
      const full = typeof rawReply === 'string' ? rawReply : ''
      const chips = parseChips(full)
      const clean = stripChips(full)
      setStreaming('')
      if (!clean.trim()) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I could not generate a response right now. Please try again.',
          chips: ['Retry', 'Contact support'],
          time: new Date().toISOString(),
        }])
        return
      }
      sfx.recv()
      speak(clean)

      const q = text.trim().toLowerCase()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: clean,
        chips,
        time: new Date().toISOString(),
        showPricing: needsPricing(q, clean),
        showCourses: needsCourses(q),
      }])
    }

    const doFetch = async () => {
      const controller = new AbortController()
      controllerRef.current = controller
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      try {
        const res = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!res.ok) {
          const st = res.status
          let msg
          if (st === 429) {
            msg = 'You have hit the rate limit.\n\nPlease wait a moment or reach support directly:\n\n?? +91 9629600230\n?? technovahubcareer@gmail.com\n[CHIPS: Share my contact | Try later]'
          } else if (st === 400) {
            msg = 'Something in that message caused an issue. Try rephrasing it!\n[CHIPS: Start over | Contact support]'
          } else {
            msg = `Service temporarily unavailable. Please retry in a moment.\n\n?? +91 9629600230\n[CHIPS: Retry | Contact support]`
          }
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: stripChips(msg),
            chips: parseChips(msg),
            time: new Date().toISOString(),
          }])
          setLoading(false)
          return
        }

        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await res.json()
          applyAssistantReply(data?.reply || data?.message || data?.text || '')
          return
        }

        if (!res.body) {
          applyAssistantReply('')
          return
        }

        const reader = res.body.getReader()
        const dec    = new TextDecoder()
        let buffer   = ''
        let full     = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += dec.decode(value, { stream: true })

          const lines = buffer.split(/\r?\n/)
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') continue
            try {
              const part = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text || ''
              full += part
              setStreaming(full)
            } catch { /* ignore malformed chunk */ }
          }
        }

        if (buffer.startsWith('data: ')) {
          const raw = buffer.slice(6).trim()
          if (raw && raw !== '[DONE]') {
            try {
              const part = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text || ''
              full += part
              setStreaming(full)
            } catch { /* ignore malformed chunk */ }
          }
        }

        applyAssistantReply(full)
      } catch (err) {
        clearTimeout(timeoutId)
        const isAbort = err?.name === 'AbortError'

        if (isAbort && !controller.signal.reason) {
          // Timeout
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Response is taking too long. Please try again.',
            chips: ['Retry', 'Contact support'],
            time: new Date().toISOString(),
          }])
        } else if (isAbort) {
          // User navigated away or new request — silently ignore
          return
        } else if (!retried) {
          // Network failure — auto-retry once after 2 seconds
          retried = true
          setStreaming('Retrying...')
          await new Promise(r => setTimeout(r, 2000))
          return doFetch()
        } else {
          // Second failure
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Connection issue � check your internet and try again.\n\nOr reach us directly:\n?? +91 9629600230\n?? technovahubcareer@gmail.com',
            chips: ['Retry', 'Contact support'],
            time: new Date().toISOString(),
          }])
        }
      } finally {
        setLoading(false)
      }
    }

    await doFetch()
  }, [intent, frustrated, userName, userCtx, setMessages, speak])

  return { streaming, loading, sendToGemini }
}


