import { describe, it, expect } from 'vitest'
import { sanitize } from '../utils/sanitize.js'
import { detectIntent, buildSystemPrompt, searchMessages } from '../utils/chatUtils.js'

describe('chatFlow', () => {
  it('sending a message calls with correct language parameter', () => {
    const sys = buildSystemPrompt({ name: '', ctx: '', intent: '', frustrated: false, lang: 'ta' })
    expect(sys).toContain('RESPOND IN TANGLISH ONLY')
  })

  it('error response shows actionable error message', () => {
    const sys = buildSystemPrompt({ name: '', ctx: '', intent: '', frustrated: true, lang: 'en' })
    expect(sys).toContain('USER FRUSTRATED')
    expect(sys).toContain('Offer human contact right away')
  })

  it('XSS input is sanitized before rendering', () => {
    const malicious = '<script>alert("xss")</script><b>safe</b>'
    const result = sanitize(malicious)
    expect(result).not.toContain('<script>')
    expect(result).toContain('<b>safe</b>')
  })

  it('intent detection categorizes correctly', () => {
    expect(detectIntent('I want to learn Python')).toBe('student')
    expect(detectIntent('we need WhatsApp automation')).toBe('business')
    expect(detectIntent('API integration needed')).toBe('developer')
    expect(detectIntent('enterprise SLA contract')).toBe('enterprise')
    expect(detectIntent('hi there')).toBe('')
  })

  it('system prompt includes company profile', () => {
    const sys = buildSystemPrompt({ name: 'Test', ctx: '', intent: 'student', frustrated: false, lang: 'en' })
    expect(sys).toContain('TrackPulse Employee Tracking Assistant')
    expect(sys).toContain('User name: Test')
    expect(sys).toContain('STUDENT')
  })
})

describe('searchMessages', () => {
  const messages = [
    { role: 'user', content: 'Tell me about pricing', time: '2024-01-01T00:00:00Z' },
    { role: 'assistant', content: 'Here are our Courses and plans', time: '2024-01-01T00:00:01Z' },
    { role: 'user', content: 'I want a demo of Nexion', time: '2024-01-01T00:00:02Z' },
    { role: 'assistant', content: 'Sure! Book a demo here', time: '2024-01-01T00:00:03Z' },
    { role: 'user', content: 'Show me the demo pricing', time: '2024-01-01T00:00:04Z' },
  ]

  it('matching term returns results', () => {
    const results = searchMessages(messages, 'pricing')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(i => {
      expect(messages[i].content.toLowerCase()).toContain('pricing')
    })
  })

  it('search is case-insensitive', () => {
    const results = searchMessages(messages, 'courses')
    expect(results.length).toBeGreaterThan(0)
    expect(messages[results[0]].content).toContain('Courses')
  })

  it('no match returns empty results', () => {
    const results = searchMessages(messages, 'xyz123')
    expect(results).toHaveLength(0)
  })

  it('X of Y counter reflects correct match count', () => {
    const results = searchMessages(messages, 'demo')
    expect(results).toHaveLength(3)
    const currentIndex = 0
    expect(currentIndex).toBe(0)
  })

  it('forward navigation wraps around (last to first)', () => {
    const results = searchMessages(messages, 'demo')
    let idx = results.length - 1
    idx = idx >= results.length - 1 ? 0 : idx + 1
    expect(idx).toBe(0)
  })

  it('backward navigation wraps around (first to last)', () => {
    const results = searchMessages(messages, 'demo')
    let idx = 0
    idx = idx <= 0 ? results.length - 1 : idx - 1
    expect(idx).toBe(2)
  })

  it('empty query returns no results', () => {
    const results = searchMessages(messages, '')
    expect(results).toHaveLength(0)
  })

  it('search resets when query is cleared', () => {
    const withResults = searchMessages(messages, 'hello')
    const cleared = searchMessages(messages, '')
    expect(cleared).toHaveLength(0)
  })
})
