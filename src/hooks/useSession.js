import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'tvh_session_id'

function getOrCreateSessionId() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return uuidv4()
    const existing = window.localStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id = uuidv4()
    window.localStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return uuidv4()
  }
}

export function useSession() {
  const [sessionId] = useState(getOrCreateSessionId)
  return sessionId
}
