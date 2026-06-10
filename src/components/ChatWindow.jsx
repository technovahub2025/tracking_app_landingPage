// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { detectIntent, detectName, detectFrustration, needsLead, searchMessages, formatChatText } from '../utils/chatUtils.js'
import { CONTACT } from '../data/company.js'
import { sfx } from '../utils/audio.js'
import { useGemini } from '../hooks/useGemini.js'
import { useDragResize } from '../hooks/useDragResize.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useChatState } from '../hooks/useChatState.js'
import { useLeadFlow } from '../hooks/useLeadFlow.js'
import { useInactivity } from '../hooks/useInactivity.js'
import { useSession } from '../hooks/useSession.js'
import { SK, API_URL } from '../data/constants.js'
import TNCScreen from './TNCScreen.jsx'
import LeadForm from './LeadForm.jsx'
import ChatHeader from './ChatHeader.jsx'
import SearchBar from './SearchBar.jsx'
import MessageList from './MessageList.jsx'
import ChatComposer from './ChatComposer.jsx'
import ContactPanel from './ContactPanel.jsx'

export default function ChatWindow({ open, onClose, onNudge }) {
  const sessionId = useSession()
  const chat = useChatState()
  const { messages, setMessages, lang, setLang, userName, setUserName, tncDone, setTncRaw, clearChat, exportChat, initGreeting } = chat
  const [theme, setTheme] = useLocalStorage(SK.THEME, 'light')
  const [ttsRaw, setTtsRaw] = useLocalStorage(SK.TTS, '0')
  const [userCtx] = useLocalStorage(SK.CTX, '')
  const tts = ttsRaw === '1'

  const lead = useLeadFlow({ setMessages })
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [srchOpen, setSrchOpen] = useState(false)
  const [srchQ, setSrchQ] = useState('')
  const [srchIdx, setSrchIdx] = useState(0)
  const [closing, setClosing] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [attachment, setAttachment] = useState(null)
  const [attachErr, setAttachErr] = useState('')
  const [intent, setIntent] = useState('')
  const [frustrated, setFrustrated] = useState(false)
  const [sysTh, setSysTh] = useState(() => {
    const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme:dark)') : null
    return mq?.matches ? 'dark' : 'light'
  })
  const msgsRef = useRef(null), sendRef = useRef(null), recogRef = useRef(null), fileRef = useRef(null)
  const resolvedTh = theme === 'system' ? sysTh : theme
  const { pos, size, winRef, onHdDown, onHdTouch, onResDown, resetPos, isDragged } = useDragResize()

  const { resetTimer } = useInactivity(open, messages, onNudge || (() => {}))

  // Restore server-side history on first load
  useEffect(() => {
    if (!sessionId || !tncDone) return
    let cancelled = false
    fetch(`${API_URL}/sessions/${sessionId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data?.messages?.length) return
        const restored = data.messages.map(m => ({
          role: m.role,
          content: m.content,
          time: m.at || new Date().toISOString(),
        }))
        setMessages(prev => prev.length <= 1 ? restored : prev)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [sessionId, tncDone])

  useEffect(() => {
    const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme:dark)') : null
    if (!mq) return
    const h = e => setSysTh(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight }, [messages])
  useEffect(() => { initGreeting(open) }, [open, initGreeting])

  const speak = useCallback((text) => {
    if (!tts || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/\[CHIPS:[^\]]+\]/g, '').replace(/\*\*/g, '').replace(/[⚡👋✓→•🌐📞📧]/gu, '').slice(0, 500))
    u.lang = 'en-IN'; u.rate = 0.95; window.speechSynthesis.speak(u)
  }, [tts, lang])

  const { streaming, loading, sendToGemini } = useGemini({ messages, setMessages, lang, intent, frustrated, userName, userCtx, tts, speak, resetInact: resetTimer, sessionId })
  useEffect(() => { if (msgsRef.current && streaming) msgsRef.current.scrollTop = msgsRef.current.scrollHeight }, [streaming])

  const handleChipAction = useCallback((text) => {
    const lower = text.toLowerCase()
    if (lower === 'contact team' || lower === 'submit data' || lower === 'submit details' || lower === 'submit information') {
      if (lower === 'contact team') {
        setShowContact(true)
      } else {
        lead.openLeadForm('Data submission')
      }
      return true
    }
    if (lower === 'get quote' || lower === 'விலை பெறு') {
      lead.openLeadForm('Quote request')
      return true
    }
    return false
  }, [lead])

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || loading) return
    if (handleChipAction(text.trim())) return
    resetTimer()
    detectName(text, (n) => setUserName(n))
    const det = intent || detectIntent(text)
    if (!intent && det) setIntent(det)
    if (!lead.leadDone && needsLead(text)) lead.openLeadForm()
    let content = text.trim()
    if (attachment) {
      content += `\n\n[Attached: ${attachment.name}]`
    }
    const userMsg = { role: 'user', content, time: new Date().toISOString() }
    const newMsgs = [...messages, userMsg].slice(-80)
    setMessages(newMsgs); setInput(''); setAttachment(null); sfx.send()
    setFrustrated(detectFrustration(newMsgs))
    await sendToGemini(content, newMsgs, lang)
  }, [loading, messages, intent, lang, lead, resetTimer, sendToGemini, setUserName, setMessages, handleChipAction, attachment])

  useEffect(() => { sendRef.current = sendMessage }, [sendMessage])

  const hasSpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window

  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    if (recogRef.current) try { recogRef.current.stop() } catch { /* */ }
    const r = new SR(); r.lang = 'en-IN'; r.continuous = true; r.interimResults = true
    recogRef.current = r; let sil = null, last = ''
    r.onresult = e => { let t = ''; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; last = t; setInput(t); clearTimeout(sil); sil = setTimeout(() => { if (last.trim()) { sendRef.current(last); setListening(false); r.stop() } }, 1200) }
    r.onerror = () => setListening(false); r.onend = () => setListening(false); r.start(); setListening(true)
  }, [lang])
  const stopVoice = useCallback(() => { if (recogRef.current) try { recogRef.current.stop() } catch { /* */ } setListening(false) }, [])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachErr('')
    const allowed = ['image/png', 'image/jpeg', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setAttachErr('Only PNG, JPG, and PDF files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAttachErr('File must be under 5MB.')
      return
    }
    setAttachment({ name: file.name, type: file.type, size: file.size })
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  const handleClose = () => { setClosing(true); setTimeout(() => { setClosing(false); onClose() }, 380) }
  const handleResetPos = () => { sfx.reset(); setClosing(true); setTimeout(() => { resetPos(); setClosing(false) }, 390) }

  const srchMatches = useMemo(() => searchMessages(messages, srchQ), [srchQ, messages])

  useEffect(() => { setSrchIdx(0); if (srchMatches.length > 0 && msgsRef.current) { const el = msgsRef.current.querySelectorAll('.tvh-msg')[srchMatches[0]]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }) } }, [srchQ, srchMatches])
  const srchPrev = useCallback(() => { if (!srchMatches.length) return; const n = srchIdx <= 0 ? srchMatches.length - 1 : srchIdx - 1; setSrchIdx(n); msgsRef.current?.querySelectorAll('.tvh-msg')[srchMatches[n]]?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [srchMatches, srchIdx])
  const srchNext = useCallback(() => { if (!srchMatches.length) return; const n = srchIdx >= srchMatches.length - 1 ? 0 : srchIdx + 1; setSrchIdx(n); msgsRef.current?.querySelectorAll('.tvh-msg')[srchMatches[n]]?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [srchMatches, srchIdx])

  const hlText = useCallback((text) => formatChatText(text, { highlightQuery: srchQ, highlightActive: srchOpen }), [srchQ, srchOpen])

  const winStyle = useMemo(() => {
    const s = { width: size.w, height: size.h }
    if (pos.left !== undefined) { s.left = pos.left; s.top = pos.top; s.right = 'auto'; s.bottom = 'auto' } else { s.right = pos.right ?? 24; s.bottom = pos.bottom ?? 108 }
    return s
  }, [pos, size])

  const cycleTheme = () => setTheme(t => t === 'dark' ? 'light' : t === 'light' ? 'system' : 'dark')

  if (!open && !closing) return null

  return (
    <div className="tvh-root">
      <div ref={winRef} className={`tvh-win ${closing ? 'closing' : 'opening'}`} style={winStyle} data-theme={resolvedTh} onClick={resetTimer}>
        <ChatHeader onSearchToggle={() => setSrchOpen(v => !v)} onExport={exportChat} tts={tts} hasTts={hasSpeechSynthesis} onTtsToggle={() => setTtsRaw(v => v === '1' ? '0' : '1')} themeMode={theme} onCycleTheme={cycleTheme} onClear={clearChat} isDragged={isDragged} onResetPos={handleResetPos} onClose={handleClose} onHdDown={onHdDown} onHdTouch={onHdTouch} onContact={() => setShowContact(v => !v)} />
        {srchOpen && <SearchBar query={srchQ} onChange={setSrchQ} onPrev={srchPrev} onNext={srchNext} onClose={() => { setSrchOpen(false); setSrchQ('') }} matchCount={srchMatches.length} currentIndex={srchIdx} />}
        {!tncDone && <TNCScreen onAccept={() => setTncRaw('1')} onDecline={handleClose} />}
        {tncDone && (
          <>
            <MessageList ref={msgsRef} messages={messages} streaming={streaming} loading={loading} hlText={hlText} sendRef={sendRef} resetInact={resetTimer} showLead={lead.showLead} leadDone={lead.leadDone} leadFormNode={<LeadForm data={lead.leadData} setData={lead.setLeadData} onSubmit={lead.submitLead} onClose={lead.closeLeadForm} loading={lead.leadLoading} errors={lead.leadErrors} />} showContact={showContact} contactNode={<ContactPanel onSchedule={() => { setShowContact(false); lead.openLeadForm('Data submission') }} onClose={() => setShowContact(false)} />} />
            {attachErr && <div className="tvh-attach-err" style={{ padding: '0 12px' }}>{attachErr}</div>}
            {attachment && (
              <div className="tvh-attach-chip" style={{ margin: '0 12px' }}>
                <span>{attachment.name}</span>
                <button className="tvh-attach-rm" onClick={() => setAttachment(null)} aria-label="Remove attachment">&times;</button>
              </div>
            )}

            <ChatComposer lang={lang} onSwitchLang={setLang} input={input} onInputChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendRef.current(input) } resetTimer(); sfx.key() }} onSend={() => sendRef.current(input)} onStartVoice={startVoice} onStopVoice={stopVoice} listening={listening} loading={loading} maxLength={2000} hasVoice={hasSpeechRecognition} onAttach={() => fileRef.current?.click()} attachment={attachment} />
            <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileSelect} style={{ display: 'none' }} aria-hidden="true" />
          </>
        )}
        <div className="tvh-rsz" onMouseDown={onResDown}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 1L1 11M7 1L1 7M11 5L5 11" stroke="var(--txt2)" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
      </div>
    </div>
  )
}

