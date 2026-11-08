import { useLayoutEffect } from 'react'

const PHONE_QUERY = '(pointer: coarse), (max-width: 900px)'

/** On-screen hero drift stays inside 40px. CSS multiplies this variable by 0.35. */
const PHONE_HERO_VAR = 40 / 0.35
const PHONE_ABOUT = 36
const PHONE_CONTACT = 40

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/**
 * Writes scroll-driven custom properties directly.
 * Keeps parallax and ignition off the React render path.
 */
export function useScrollScene(enabled: boolean) {
  useLayoutEffect(() => {
    const root = document.documentElement
    let frame = 0
    const phoneQuery = window.matchMedia(PHONE_QUERY)
    const written = new Map<string, string>()

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
      if (!enabled) {
        apply(0.42, 0.22, 0.08, 0, 0, 0)
        return
      }

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

      let parallaxMid = scrollY * -0.28
      let aboutShift = scrollY * 0.08
      let contactShift = scrollY * 0.05

      if (phoneQuery.matches) {
        parallaxMid = clamp(parallaxMid, -PHONE_HERO_VAR, PHONE_HERO_VAR)
        aboutShift = clamp(aboutShift, -PHONE_ABOUT, PHONE_ABOUT)
        contactShift = clamp(contactShift, -PHONE_CONTACT, PHONE_CONTACT)
      }

      apply(ignition, fuel, finale, parallaxMid, aboutShift, contactShift)
    }

    measure()

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    phoneQuery.addEventListener('change', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      phoneQuery.removeEventListener('change', onScroll)
    }
  }, [enabled])
}
