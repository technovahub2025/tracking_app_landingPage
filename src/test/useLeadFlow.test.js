import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLeadFlow } from '../hooks/useLeadFlow.js'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useLeadFlow', () => {
  const mockSetMessages = vi.fn()

  it('initial state has showLead false', () => {
    const { result } = renderHook(() => useLeadFlow({ setMessages: mockSetMessages }))
    expect(result.current.showLead).toBe(false)
  })

  it('opening lead form sets showLead true', () => {
    const { result } = renderHook(() => useLeadFlow({ setMessages: mockSetMessages }))
    act(() => {
      result.current.openLeadForm()
    })
    expect(result.current.showLead).toBe(true)
  })

  it('opening lead form with preset notes pre-fills the hidden notes field', () => {
    const { result } = renderHook(() => useLeadFlow({ setMessages: mockSetMessages }))
    act(() => {
      result.current.openLeadForm('Quote request')
    })
    expect(result.current.leadData.requirement).toBe('Quote request')
  })

  it('submitting with empty name returns validation error', async () => {
    const { result } = renderHook(() => useLeadFlow({ setMessages: mockSetMessages }))
    act(() => {
      result.current.setLeadData({
        name: '',
        phone: '9876543210',
        email: 'test@test.com',
        bio: '',
        address: '',
        instagram: '',
        googleBusinessProfile: '',
        facebook: '',
        linkedin: '',
        websiteType: '',
        websiteName: '',
        requirement: 'Data submission',
      })
    })
    await act(async () => {
      await result.current.submitLead()
    })
    expect(result.current.leadErrors.name).toBeDefined()
  })

  it('submitting with invalid email returns validation error', async () => {
    const { result } = renderHook(() => useLeadFlow({ setMessages: mockSetMessages }))
    act(() => {
      result.current.setLeadData({
        name: 'Test',
        phone: '9876543210',
        email: 'notanemail',
        bio: '',
        address: '',
        instagram: '',
        googleBusinessProfile: '',
        facebook: '',
        linkedin: '',
        websiteType: '',
        websiteName: '',
        requirement: 'Data submission',
      })
    })
    await act(async () => {
      await result.current.submitLead()
    })
    expect(result.current.leadErrors.email).toBeDefined()
  })

  it('submitting with invalid phone returns validation error', async () => {
    const { result } = renderHook(() => useLeadFlow({ setMessages: mockSetMessages }))
    act(() => {
      result.current.setLeadData({
        name: 'Test User',
        phone: '12345',
        email: 'test@test.com',
        bio: '',
        address: '',
        instagram: '',
        googleBusinessProfile: '',
        facebook: '',
        linkedin: '',
        websiteType: '',
        websiteName: '',
        requirement: 'Data submission',
      })
    })
    await act(async () => {
      await result.current.submitLead()
    })
    expect(result.current.leadErrors.phone).toBeDefined()
  })

  it('successful submission sets success state', async () => {
    const origFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({ status: 201, json: () => Promise.resolve({ message: 'ok' }) })
    const setMsgs = vi.fn(fn => fn([]))
    const { result } = renderHook(() => useLeadFlow({ setMessages: setMsgs }))
    act(() => {
      result.current.setLeadData({
        name: 'Test User',
        phone: '9876543210',
        email: 'test@test.com',
        bio: 'Founder',
        address: 'Chennai',
        instagram: 'https://instagram.com/test',
        googleBusinessProfile: 'https://g.page/test',
        facebook: 'https://facebook.com/test',
        linkedin: 'https://linkedin.com/in/test',
        websiteType: 'company',
        websiteName: 'Test Company',
        requirement: 'Data submission',
      })
    })
    await act(async () => {
      await result.current.submitLead()
    })
    expect(result.current.leadDone).toBe(true)
    expect(result.current.showLead).toBe(false)
    globalThis.fetch = origFetch
  })
})
