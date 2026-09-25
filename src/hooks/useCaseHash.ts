import { useCallback, useEffect, useState } from 'react'

const PREFIX = '#work/'

/** Keeps the open case study in the URL (#work/<id>) so each one can be linked directly. */
export function useCaseHash(validIds: string[]) {
  const read = useCallback(() => {
    const hash = window.location.hash
    if (!hash.startsWith(PREFIX)) return null
    const id = decodeURIComponent(hash.slice(PREFIX.length))
    return validIds.includes(id) ? id : null
  }, [validIds])

  const [openId, setOpenId] = useState<string | null>(read)

  useEffect(() => {
    const onHash = () => setOpenId(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [read])

  useEffect(() => {
    if (openId && window.location.hash.startsWith(PREFIX)) {
      document.getElementById('work')?.scrollIntoView({ behavior: 'instant' })
    }
    // only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const open = useCallback((id: string) => {
    history.replaceState(null, '', PREFIX + id)
    setOpenId(id)
  }, [])

  const close = useCallback(() => {
    history.replaceState(null, '', window.location.pathname + window.location.search + '#work')
    setOpenId(null)
  }, [])

  return { openId, open, close }
}
