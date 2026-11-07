import { useEffect, useState } from 'react'

export type ChapterId = 'spark' | 'fuel' | 'burn' | 'ignition'

const CHAPTERS: { id: ChapterId; selector: string }[] = [
  { id: 'spark', selector: '#top' },
  { id: 'fuel', selector: '#about' },
  { id: 'burn', selector: '#services' },
  { id: 'ignition', selector: '#contact' },
]

/**
 * Fires a one-shot chapter pulse when a section first becomes the focus chapter.
 */
export function useChapterPulse() {
  const [pulse, setPulse] = useState<ChapterId | null>(null)
  const [active, setActive] = useState<ChapterId>('spark')

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const seen = new Set<ChapterId>()
    let clearTimer = 0
    let frame = 0

    const fire = (next: ChapterId) => {
      if (seen.has(next)) return
      seen.add(next)
      setPulse(next)
      window.clearTimeout(clearTimer)
      clearTimer = window.setTimeout(() => setPulse(null), 1800)
    }

    // Opening beat
    fire('spark')

    const measure = () => {
      const viewMid = window.innerHeight * 0.42
      let next: ChapterId = 'spark'
      let best = Number.POSITIVE_INFINITY

      for (const chapter of CHAPTERS) {
        const el = document.querySelector(chapter.selector)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const mid = rect.top + rect.height * 0.25
        const dist = Math.abs(mid - viewMid)
        if (rect.bottom > 80 && rect.top < window.innerHeight - 40 && dist < best) {
          best = dist
          next = chapter.id
        }
      }

      setActive((prev) => (prev === next ? prev : next))
      fire(next)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(clearTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return { pulse, active }
}
