import { useCallback, useEffect, useRef, useState } from 'react'

// Tiny fetch-state hook with an in-memory cache so revisits render instantly.
const cache = new Map<string, unknown>()

export function useQuery<T>(key: string | null, load: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(() => (key ? (cache.get(key) as T | undefined) : undefined))
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(!data && key !== null)
  const loadRef = useRef(load)
  loadRef.current = load

  const refetch = useCallback(async () => {
    if (!key) return
    setLoading((l) => l || !cache.has(key))
    try {
      const value = await loadRef.current()
      cache.set(key, value)
      setData(value)
      setError(null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    if (!key) return
    setData(cache.get(key) as T | undefined)
    void refetch()
  }, [key, refetch])

  return { data, error, loading, refetch, setData }
}

export const invalidate = (prefix: string) => {
  for (const k of cache.keys()) if (k.startsWith(prefix)) cache.delete(k)
}
