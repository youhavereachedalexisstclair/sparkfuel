import { useEffect, useState, type MouseEvent } from 'react'

function normalize(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

function scrollBehavior(): ScrollBehavior {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const phone = window.matchMedia('(pointer: coarse), (max-width: 900px)').matches
  return reduce || phone ? 'auto' : 'smooth'
}

export function useRoute() {
  const [path, setPath] = useState(() => normalize(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: scrollBehavior() })
      return
    }
    window.scrollTo(0, 0)
  }, [path])

  const go = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return
    event.preventDefault()

    const next = normalize(url.pathname)
    const current = normalize(window.location.pathname)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)

    if (next !== current) {
      setPath(next)
      return
    }

    const behavior = scrollBehavior()
    if (url.hash) {
      document.querySelector(url.hash)?.scrollIntoView({ behavior })
    } else {
      window.scrollTo({ top: 0, behavior })
    }
  }

  return { path, go }
}
