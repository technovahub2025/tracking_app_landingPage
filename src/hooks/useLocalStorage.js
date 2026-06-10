import { useState, useCallback } from 'react'

function getStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const storage = getStorage()
      if (!storage) return initialValue
      const item = storage.getItem(key)
      return item !== null ? item : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(storedValue) : value
      setStoredValue(valueToStore)
      const storage = getStorage()
      if (!storage) return
      if (valueToStore === null || valueToStore === undefined) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, valueToStore)
      }
    } catch {
      /* localStorage not available */
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export function useLocalStorageJSON(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const storage = getStorage()
      if (!storage) return initialValue
      const item = storage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(storedValue) : value
      setStoredValue(valueToStore)
      const storage = getStorage()
      if (!storage) return
      if (valueToStore === null || valueToStore === undefined) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch {
      /* localStorage not available */
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}
