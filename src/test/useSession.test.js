import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSession } from '../hooks/useSession.js'

beforeEach(() => {
  localStorage.clear()
})

describe('useSession', () => {
  it('generates a UUID session ID', () => {
    const { result } = renderHook(() => useSession())
    expect(result.current).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  it('persists the session ID in localStorage', () => {
    const { result } = renderHook(() => useSession())
    const stored = localStorage.getItem('tvh_session_id')
    expect(stored).toBe(result.current)
  })

  it('reuses existing session ID from localStorage', () => {
    localStorage.setItem('tvh_session_id', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    const { result } = renderHook(() => useSession())
    expect(result.current).toBe('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
  })
})
