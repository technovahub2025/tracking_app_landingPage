import { COMPANY_PROFILE } from '../data/company.js'

/**
 * Builds the Gemini system instruction string.
 * Isolated here so it can be tested and updated without touching UI components.
 */
export function buildSystemPrompt({ name, ctx, intent, frustrated, lang }) {
  const langRule = lang === 'ta'
    ? 'RESPOND IN TANGLISH ONLY. Write Tamil words using English letters only. Do not use Tamil script. Keep the tone natural and conversational, like spoken Tamil typed in English. Technical terms can stay in English (AI, Python, API, WhatsApp, etc.).'
    : 'RESPOND IN ENGLISH ONLY.'

  const intentBlock = {
    student:    'USER TYPE: STUDENT. Be warm, encouraging. Mention job outcomes and career paths.',
    business:   'USER TYPE: BUSINESS. Lead with ROI. Numbers first. Specific outcomes.',
    developer:  'USER TYPE: DEVELOPER. Go deep on tech specs, APIs, architecture.',
    enterprise: 'USER TYPE: ENTERPRISE. Formal-direct. Mention SLA, TCS/HCL partnerships.',
  }[intent] || ''

  return `You are the TrackPulse Employee Tracking Assistant - the official AI chatbot for the TrackPulse Employee Monitoring Platform.
${name ? `User name: ${name}. Use it naturally.` : ''}
${ctx ? `User context: ${ctx}` : ''}
${intentBlock}
${frustrated ? 'USER FRUSTRATED: Extra warm, simple, empathetic. Offer human contact right away.' : ''}

CRITICAL LANGUAGE RULE: ${langRule}

STYLE (GenZ AI - sharp, warm, direct, no corporate BS):
- Answer DIRECTLY first. No "Here's a comprehensive overview", no "Certainly!", no "Great question!"
- Short punchy paragraphs. Max 3 sentences each. Lots of line breaks.
- yes/no/ok/sure/continue/yes/right -> go DEEPER on previous topic naturally, don't ask them to repeat
- Single word replies -> respond directly and engage naturally
- EVERY response ends with one follow-up question OR [CHIPS: opt1 | opt2 | opt3]
- Employee registration / login / live location tracking / supervisor monitoring -> explain clearly and practically
- If asked about tracked data, explain employee name, login time, logout time, current location, Google Maps URL, video updates, and tracking status
- If asked how monitoring works, explain automatic tracking after login, Google Maps links, and logout-based stop behavior
- Any problem -> +91 9629600230 | technovahubcareer@gmail.com
- Answer ALL questions about the TrackPulse platform - employee registration, live tracking, supervisor dashboard, Google Maps locations, video updates, filtering, and account management

${COMPANY_PROFILE}`
}

// â”€â”€â”€ INTENT / TRIGGER DETECTORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const detectIntent = (text) => {
  if (/course|learn|internship|career|college|fee|student|training|study/i.test(text)) return 'student'
  if (/company|automate|employee|customer|roi|business|revenue|crm|whatsapp|nexion/i.test(text)) return 'business'
  if (/api|integrate|code|github|stack|webhook|developer|sdk/i.test(text)) return 'developer'
  if (/enterprise|scale|procurement|contract|sla|white.?label/i.test(text)) return 'enterprise'
  return ''
}

export const detectName = (text, cb) => {
  const m = text.match(/(?:i.?m|i am|my name is|naan|call me)\s+([A-Za-z]{2,20})/i)
  if (m) cb(m[1])
}

export const detectFrustration = (msgs) =>
  msgs.filter(m => m.role === 'user').slice(-4).some(m =>
    /not helpful|useless|wrong|\?\?\?|terrible/i.test(m.content) ||
    (m.content.length > 3 && m.content === m.content.toUpperCase())
  )

export const needsLead    = (t) => /demo|pricing|trial|contact|enterprise|let.?s talk|book|call me/i.test(t)
export const needsPricing = (q, a) => /nexion.*pric|pric.*nexion|starter|growth plan|plan.*price/i.test(a) || /how much.*nexion|nexion.*cost|nexion.*price/i.test(q)
export const needsCourses = (q) => /course.*list|all course|show.*course|what course|courses.*offer/i.test(q)

// â”€â”€â”€ SEARCH HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function searchMessages(messages, query) {
  if (!query || !query.trim()) return []
  const q = query.toLowerCase()
  return messages.reduce((acc, m, i) => {
    if (m.content.toLowerCase().includes(q)) acc.push(i)
    return acc
  }, [])
}

// â”€â”€â”€ CHIP / TEXT HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const parseChips = (t) => {
  const m = t?.match(/\[CHIPS:\s*([^\]]+)\]/i)
  return m ? m[1].split('|').map(s => s.trim()).filter(Boolean) : null
}

export const stripChips = (t) => t?.replace(/\[CHIPS:[^\]]+\]/gi, '').trim() || ''

export function formatChatText(text, { highlightQuery = '', highlightActive = false } = {}) {
  const safeText = String(text ?? '')
  const withFormatting = safeText
    .replace(/\r\n/g, '\n')
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<span class="tvh-title-point"><span class="tvh-title-num">$1.</span> <span class="tvh-title-text">$2</span></span>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')

  if (!highlightActive || !highlightQuery.trim()) return withFormatting

  const escapedQuery = highlightQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return withFormatting.replace(new RegExp(`(${escapedQuery})`, 'gi'), '<mark>$1</mark>')
}

export const fmtTime = (d) => {
  try {
    if (!d) return ''
    const date = new Date(d)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}
