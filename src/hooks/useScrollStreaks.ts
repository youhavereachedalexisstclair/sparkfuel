import { useEffect, useState } from 'react'

export type Streak = {
  id: number
  top: number
  left: number
  length: number
  angle: number
  tone: 'spark' | 'signal'
}

/**
 * Spawns shooting-star streaks when scroll velocity spikes.
 */
export function useScrollStreaks() {
  const [streaks, setStreaks] = useState<Streak[]>([])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    let lastY = window.scrollY
    let lastT = performance.now()
    let id = 0
    let cooldown = 0
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const now = performance.now()
        const dy = window.scrollY - lastY
        const dt = Math.max(16, now - lastT)
        const speed = Math.abs(dy) / dt
        lastY = window.scrollY
        lastT = now

        if (speed < 1.35 || now < cooldown) return
        cooldown = now + 120

        const count = Math.min(3, 1 + Math.floor(speed / 1.8))
        const batch: Streak[] = Array.from({ length: count }, () => {
          const streakId = ++id
          const streak: Streak = {
            id: streakId,
            top: 8 + Math.random() * 84,
            left: Math.random() * 100,
            length: 40 + Math.random() * 90,
            angle: dy > 0 ? 18 + Math.random() * 28 : -18 - Math.random() * 28,
            tone: Math.random() > 0.45 ? 'spark' : 'signal',
          }
          window.setTimeout(() => {
            setStreaks((prev) => prev.filter((s) => s.id !== streakId))
          }, 780)
          return streak
        })
        setStreaks((prev) => [...prev, ...batch].slice(-12))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return streaks
}
