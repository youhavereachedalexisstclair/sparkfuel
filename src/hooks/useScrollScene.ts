import { useLayoutEffect } from 'react'

const PHONE_QUERY = '(pointer: coarse), (max-width: 900px)'

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/**
 * Desktop: writes scroll-driven custom properties without a React render.
 * Phones: one static sky and no scroll listener, so the page can scroll on
 * the compositor instead of restyling the sky every frame.
 */
export function useScrollScene(enabled: boolean) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const phoneQuery = window.matchMedia(PHONE_QUERY)
    const written = new Map<string, string>()
    let frame = 0

    const setVar = (name: string, value: string) => {
      if (written.get(name) === value) return
      written.set(name, value)
      root.style.setProperty(name, value)
    }

    const apply = (
      ignition: number,
      fuel: number,
      finale: number,
      parallaxMid: number,
      aboutShift: number,
      contactShift: number,
    ) => {
      setVar('--ignition', ignition.toFixed(4))
      setVar('--fuel', fuel.toFixed(4))
      setVar('--finale', finale.toFixed(4))
      setVar('--parallax-mid', `${parallaxMid.toFixed(2)}px`)
      setVar('--about-parallax', `${aboutShift.toFixed(2)}px`)
      setVar('--about-parallax-opp', `${(-aboutShift * 0.65).toFixed(2)}px`)
      setVar('--contact-parallax', `${contactShift.toFixed(2)}px`)
    }

    const measure = () => {
      const doc = document.documentElement
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
      const progress = clamp01(scrollY / maxScroll)
      const ignition = smoothstep(0.04, 0.52, progress)

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

      apply(ignition, fuel, finale, scrollY * -0.28, scrollY * 0.08, scrollY * 0.05)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    const connect = () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)

      if (!enabled) {
        apply(0.42, 0.22, 0.08, 0, 0, 0)
        return
      }

      if (phoneQuery.matches) {
        apply(0.72, 0.85, 0.45, 0, 0, 0)
        return
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      measure()
    }

    connect()
    window.addEventListener('resize', connect)
    phoneQuery.addEventListener('change', connect)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', connect)
      phoneQuery.removeEventListener('change', connect)
    }
  }, [enabled])
}
