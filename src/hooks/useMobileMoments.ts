import { useLayoutEffect, useRef } from 'react'

const PHONE_QUERY = '(pointer: coarse), (max-width: 900px)'

/**
 * Phone-only moments. Desktop never gets a scroll listener or a class change
 * that would alter layout.
 */
export function useMobileMoments(path: string) {
  const sparkRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const phone = window.matchMedia(PHONE_QUERY)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const rises = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]'))
    let frame = 0
    let observer: IntersectionObserver | null = null

    const paintSpark = () => {
      const el = sparkRef.current
      if (!el) return
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
      el.style.transform = `scaleX(${progress.toFixed(4)})`
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(paintSpark)
    }

    const watchRises = () => {
      observer?.disconnect()
      observer = null
      if (!phone.matches || reduce.matches) {
        rises.forEach((node) => node.classList.add('is-seen'))
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('is-seen')
            observer?.unobserve(entry.target)
          }
        },
        { threshold: 0.01, rootMargin: '0px 0px 10% 0px' },
      )
      rises.forEach((node) => {
        if (!node.classList.contains('is-seen')) observer?.observe(node)
      })
    }

    const connect = () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      watchRises()
      const el = sparkRef.current
      if (!phone.matches || reduce.matches) {
        if (el) el.style.transform = ''
        return
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      paintSpark()
    }

    connect()
    phone.addEventListener('change', connect)
    reduce.addEventListener('change', connect)
    window.addEventListener('resize', connect)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', connect)
      phone.removeEventListener('change', connect)
      reduce.removeEventListener('change', connect)
    }
  }, [path])

  return sparkRef
}
