import { useEffect, useRef, useCallback } from 'react'

export function useInactivity(isOpen, messages, onNudge) {
  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        onNudge()
      }, 45000)
    }
  }, [onNudge, isOpen])

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    resetTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isOpen, resetTimer])

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role === 'user') {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
  }, [messages, isOpen])

  return { resetTimer }
}
