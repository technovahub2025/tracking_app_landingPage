import { describe, it, expect } from 'vitest'
import { sanitize } from '../utils/sanitize.js'

describe('sanitize', () => {
  it('passes clean text through unchanged', () => {
    expect(sanitize('Hello world')).toBe('Hello world')
  })

  it('strips <script> tags completely', () => {
    expect(sanitize('<script>alert(1)</script>')).toBe('')
  })

  it('preserves allowed tags: p, ul, ol, li, strong, em, code, pre, br, a', () => {
    expect(sanitize('<p>text</p>')).toBe('<p>text</p>')
    expect(sanitize('<ul><li>item</li></ul>')).toBe('<ul><li>item</li></ul>')
    expect(sanitize('<ol><li>item</li></ol>')).toBe('<ol><li>item</li></ol>')
    expect(sanitize('<strong>bold</strong>')).toBe('<strong>bold</strong>')
    expect(sanitize('<em>italic</em>')).toBe('<em>italic</em>')
    expect(sanitize('<code>x</code>')).toBe('<code>x</code>')
    expect(sanitize('<pre>block</pre>')).toBe('<pre>block</pre>')
    expect(sanitize('line<br>break')).toBe('line<br>break')
    expect(sanitize('<a href="https://example.com">link</a>')).toContain('href')
  })

  it('strips disallowed tags (iframe, img, div, form)', () => {
    expect(sanitize('<iframe src="evil.com"></iframe>')).toBe('')
    expect(sanitize('<div>text</div>')).toBe('text')
    expect(sanitize('<form action="/steal"><input></form>')).toBe('')
  })

  it('returns empty string for empty or null-like input', () => {
    expect(sanitize('')).toBe('')
    expect(sanitize(null)).toBe('')
    expect(sanitize(undefined)).toBe('')
  })

  it('strips nested injection attempts', () => {
    const result = sanitize('<scr<script>ipt>alert(1)</scr</script>ipt>')
    expect(result).not.toContain('<script>')
    expect(sanitize('<img src=x onerror="alert(1)">')).not.toContain('onerror')
    expect(sanitize('<svg onload="alert(1)"><circle></circle></svg>')).not.toContain('onload')
  })

  it('strips javascript: URL injection in href attributes', () => {
    const result = sanitize('<a href="javascript:alert(1)">click</a>')
    expect(result).not.toContain('javascript:')
  })

  it('preserves <mark> tags used for search highlighting', () => {
    expect(sanitize('<mark>highlight</mark>')).toBe('<mark>highlight</mark>')
  })
})
