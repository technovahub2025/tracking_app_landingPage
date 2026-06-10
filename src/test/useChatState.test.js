import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChatState } from '../hooks/useChatState.js'

beforeEach(() => {
  localStorage.clear()
})

describe('useChatState', () => {
  it('initial state is empty messages array', () => {
    const { result } = renderHook(() => useChatState())
    expect(result.current.messages).toEqual([])
  })

  it('adding a user message appends correctly', () => {
    const { result } = renderHook(() => useChatState())
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Hello', time: new Date().toISOString() })
    })
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[0].content).toBe('Hello')
  })

  it('adding an assistant message appends correctly', () => {
    const { result } = renderHook(() => useChatState())
    act(() => {
      result.current.addMessage({ role: 'assistant', content: 'Hi there!', time: new Date().toISOString() })
    })
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('assistant')
  })

  it('clear chat resets to greeting', async () => {
    const { result } = renderHook(() => useChatState())
    act(() => {
      result.current.addMessage({ role: 'user', content: 'test', time: new Date().toISOString() })
    })
    expect(result.current.messages).toHaveLength(1)
    act(() => {
      result.current.clearChat()
    })
    expect(result.current.messages).toEqual([])
  })

  it('export produces a non-empty string', () => {
    const { result } = renderHook(() => useChatState())
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Hello', time: new Date().toISOString() })
      result.current.addMessage({ role: 'assistant', content: 'Hi!', time: new Date().toISOString() })
    })
    let clicked = false
    const origCreate = document.createElement.bind(document)
    document.createElement = (tag) => {
      const el = origCreate(tag)
      if (tag === 'a') {
        el.click = () => { clicked = true }
      }
      return el
    }
    act(() => {
      result.current.exportChat()
    })
    expect(clicked).toBe(true)
    document.createElement = origCreate
  })
})
