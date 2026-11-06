import { useEffect, useState } from 'react'

export type IgnitionState = {
  /** 0 → 1 overall page burn (sky wakes up). */
  ignition: number
  /** 0 → 1 how much “fuel” (About) is in play. */
  fuel: number
  /** 0 → 1 contact / finale bloom. */
  finale: number
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

/** Smoothstep for less linear, more “story-like” ramps. */
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export function useScrollIgnition(): IgnitionState {
  const [state, setState] = useState<IgnitionState>({
    ignition: 0,
    fuel: 0,
    finale: 0,
  })

  useEffect(() => {
    let frame = 0

    const measure = () => {
      const doc = document.documentElement
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
      const progress = clamp01(window.scrollY / maxScroll)

      // Quieter at the tippy-top, then a clear ramp through About → Services.
      const ignition = smoothstep(0.04, 0.52, progress)

      // Fuel lands hard as About hits the viewport.
      const about = document.getElementById('about')
      let fuel = 0
      if (about) {
        const rect = about.getBoundingClientRect()
        const mid = rect.top + rect.height * 0.3
        const view = window.innerHeight
        fuel = smoothstep(view * 1.05, view * 0.42, mid)
      }

      const contact = document.getElementById('contact')
      let finale = 0
      if (contact) {
        const rect = contact.getBoundingClientRect()
        const mid = rect.top + rect.height * 0.2
        finale = smoothstep(window.innerHeight * 1.05, window.innerHeight * 0.5, mid)
      }

      setState({ ignition, fuel, finale })
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return state
}
