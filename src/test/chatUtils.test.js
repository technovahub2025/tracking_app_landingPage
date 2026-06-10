import { describe, it, expect } from 'vitest'
import { detectIntent, parseChips, stripChips, fmtTime, needsLead, needsPricing, needsCourses, detectName, detectFrustration, formatChatText } from '../utils/chatUtils.js'

describe('detectIntent', () => {
  it('returns "student" for learning-related text', () => {
    expect(detectIntent('I want to learn Python')).toBe('student')
  })

  it('returns "business" for business-related text', () => {
    expect(detectIntent('we need WhatsApp automation')).toBe('business')
  })

  it('returns "developer" for API integration text', () => {
    expect(detectIntent('I need API integration')).toBe('developer')
  })

  it('returns "enterprise" for enterprise text', () => {
    expect(detectIntent('we need an enterprise SLA')).toBe('enterprise')
  })

  it('returns empty string for generic greetings', () => {
    expect(detectIntent('hello')).toBe('')
  })
})

describe('parseChips', () => {
  it('returns array for chip block', () => {
    expect(parseChips('[CHIPS: opt1 | opt2 | opt3]')).toEqual(['opt1', 'opt2', 'opt3'])
  })

  it('returns null when no chip block exists', () => {
    expect(parseChips('Hello there')).toBeNull()
  })
})

describe('stripChips', () => {
  it('removes chip block from text', () => {
    expect(stripChips('Hello [CHIPS: a | b]')).toBe('Hello')
  })

  it('returns original text when no chips', () => {
    expect(stripChips('Just a message')).toBe('Just a message')
  })
})

describe('fmtTime', () => {
  it('returns formatted time for valid ISO date', () => {
    const result = fmtTime('2024-01-15T10:30:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns empty string for invalid date', () => {
    expect(fmtTime(undefined)).toBe('')
  })
})

describe('needsLead', () => {
  it('returns true for demo request', () => {
    expect(needsLead('I want a demo')).toBe(true)
  })

  it('returns true for pricing request', () => {
    expect(needsLead('Can I see the pricing?')).toBe(true)
  })

  it('returns false for generic greeting', () => {
    expect(needsLead('hello')).toBe(false)
  })
})

describe('needsPricing', () => {
  it('returns true when response mentions nexion pricing', () => {
    expect(needsPricing('how much is nexion', 'nexion pricing starts at 2999')).toBe(true)
  })

  it('returns false for unrelated content', () => {
    expect(needsPricing('hello', 'hi there')).toBe(false)
  })
})

describe('needsCourses', () => {
  it('returns true when asking to show courses', () => {
    expect(needsCourses('show me all courses')).toBe(true)
  })

  it('returns false for unrelated query', () => {
    expect(needsCourses('what is nexion')).toBe(false)
  })
})

describe('detectName', () => {
  it('extracts name from "I am X" pattern', () => {
    let result = ''
    detectName('I am Ravi', (n) => { result = n })
    expect(result).toBe('Ravi')
  })

  it('does not call callback for non-name text', () => {
    let called = false
    detectName('Hello world', () => { called = true })
    expect(called).toBe(false)
  })
})

describe('detectFrustration', () => {
  it('detects frustration keywords', () => {
    const msgs = [
      { role: 'user', content: 'this is not helpful at all' },
    ]
    expect(detectFrustration(msgs)).toBe(true)
  })

  it('returns false for normal messages', () => {
    const msgs = [
      { role: 'user', content: 'tell me about courses' },
    ]
    expect(detectFrustration(msgs)).toBe(false)
  })
})

describe('formatChatText', () => {
  it('converts bold markers into strong tags', () => {
    expect(formatChatText('This is **important** text')).toContain('<strong>important</strong>')
    expect(formatChatText('This is **important** text')).not.toContain('**')
  })

  it('promotes numbered title points into a styled span', () => {
    const result = formatChatText('1. First point\n2. Second point')
    expect(result).toContain('tvh-title-point')
    expect(result).toContain('tvh-title-num')
    expect(result).toContain('1.')
    expect(result).toContain('2.')
  })
})
