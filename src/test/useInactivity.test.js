import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInactivity } from '../hooks/useInactivity.js'

describe('useInactivity', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('nudge fires after 45 seconds of inactivity', () => {
    const onNudge = vi.fn()
    renderHook(() => useInactivity(true, [], onNudge))
    expect(onNudge).not.toHaveBeenCalled()
    vi.advanceTimersByTime(45000)
    expect(onNudge).toHaveBeenCalledTimes(1)
  })

  it('nudge does NOT fire if user sends a message before timeout', () => {
    const onNudge = vi.fn()
    const { rerender } = renderHook(
      ({ messages }) => useInactivity(true, messages, onNudge),
      { initialProps: { messages: [] } }
    )
    vi.advanceTimersByTime(30000)
    rerender({ messages: [{ role: 'user', content: 'hello' }] })
    vi.advanceTimersByTime(20000)
    expect(onNudge).not.toHaveBeenCalled()
  })

  it('timer resets when resetTimer is called', () => {
    const onNudge = vi.fn()
    const { result } = renderHook(() => useInactivity(true, [], onNudge))
    vi.advanceTimersByTime(40000)
    result.current.resetTimer()
    vi.advanceTimersByTime(40000)
    expect(onNudge).not.toHaveBeenCalled()
    vi.advanceTimersByTime(5000)
    expect(onNudge).toHaveBeenCalledTimes(1)
  })

  it('timer clears when chat closes', () => {
    const onNudge = vi.fn()
    const { rerender } = renderHook(
      ({ isOpen }) => useInactivity(isOpen, [], onNudge),
      { initialProps: { isOpen: true } }
    )
    vi.advanceTimersByTime(30000)
    rerender({ isOpen: false })
    vi.advanceTimersByTime(30000)
    expect(onNudge).not.toHaveBeenCalled()
  })
})
