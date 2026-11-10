import { useEffect, useRef, useState } from 'react'
import { kickPointerEngine, subscribeMove, subscribePointer } from '../motion/pointerEngine'
import { SparkMark } from './SparkMark'

type CursorState = 'default' | 'hover' | 'pressed'

type NovaSpark = {
  el: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  born: number
  active: boolean
}

const TRAIL_COUNT = 12
const NOVA_POOL = 20
const NOVA_BURST = 10

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function snap(value: number) {
  const ratio = window.devicePixelRatio || 1
  return Math.round(value * ratio) / ratio
}

export function MagneticCursor() {
  const auraRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')

    const syncEnabled = () => {
      const on = !reduce.matches && fine.matches
      setEnabled(on)
      document.documentElement.classList.toggle('has-magnetic-cursor', on)
    }

    syncEnabled()
    reduce.addEventListener('change', syncEnabled)
    fine.addEventListener('change', syncEnabled)

    return () => {
      reduce.removeEventListener('change', syncEnabled)
      fine.removeEventListener('change', syncEnabled)
      document.documentElement.classList.remove('has-magnetic-cursor')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const auraEl = auraRef.current
    const outerEl = outerRef.current
    const innerEl = innerRef.current
    const fxEl = fxRef.current
    const rootEl = rootRef.current
    if (!auraEl || !outerEl || !innerEl || !fxEl || !rootEl) return

    const aura = { x: -120, y: -120 }
    const outer = { x: -120, y: -120 }
    const inner = { x: -120, y: -120 }
    let state: CursorState = 'default'
    let pressed = false
    let hovering = false
    let lastTrail = 0
    let trailIndex = 0
    const offscreen = 'translate3d(-120px, -120px, 0)'
    auraEl.style.transform = offscreen
    outerEl.style.transform = offscreen
    innerEl.style.transform = offscreen

    const trails = Array.from({ length: TRAIL_COUNT }, () => {
      const dot = document.createElement('span')
      dot.className = 'magnetic-cursor-trail'
      dot.style.transform = offscreen
      fxEl.appendChild(dot)
      return dot
    })

    const novas: NovaSpark[] = Array.from({ length: NOVA_POOL }, () => {
      const el = document.createElement('span')
      el.className = 'magnetic-cursor-nova'
      el.style.transform = offscreen
      fxEl.appendChild(el)
      return { el, x: 0, y: 0, vx: 0, vy: 0, born: 0, active: false }
    })
    let novaIndex = 0

    const paintState = (hovering: boolean) => {
      const next: CursorState = pressed ? 'pressed' : hovering ? 'hover' : 'default'
      if (next === state) return
      state = next
      rootEl.classList.remove('is-default', 'is-hover', 'is-pressed')
      rootEl.classList.add(`is-${next}`)
    }

    const placed = new WeakMap<HTMLElement, string>()
    const place = (el: HTMLElement, x: number, y: number) => {
      const next = `translate3d(${snap(x)}px, ${snap(y)}px, 0)`
      if (placed.get(el) === next) return
      placed.set(el, next)
      el.style.transform = next
    }

    const spawnNova = (x: number, y: number, now: number) => {
      for (let i = 0; i < NOVA_BURST; i++) {
        const nova = novas[novaIndex]
        novaIndex = (novaIndex + 1) % NOVA_POOL
        const angle = (Math.PI * 2 * i) / NOVA_BURST + Math.random() * 0.3
        const speed = 2.2 + Math.random() * 3.4
        nova.x = x
        nova.y = y
        nova.vx = Math.cos(angle) * speed
        nova.vy = Math.sin(angle) * speed
        nova.born = now
        nova.active = true
        nova.el.className = `magnetic-cursor-nova magnetic-cursor-nova--${i % 2 === 0 ? 'spark' : 'signal'}`
        place(nova.el, x, y)
        nova.el.animate(
          [
            { opacity: 1, scale: 1 },
            { opacity: 0, scale: 0.35 },
          ],
          { duration: 700, easing: 'ease-out', fill: 'forwards' },
        )
      }
    }

    const unsubMove = subscribeMove((x, y, now) => {
      if (now - lastTrail < 42) return
      lastTrail = now
      const dot = trails[trailIndex]
      trailIndex = (trailIndex + 1) % TRAIL_COUNT
      place(dot, x, y)
      dot.animate(
        [
          { opacity: 0.7, scale: 1 },
          { opacity: 0, scale: 0.25 },
        ],
        { duration: 450, easing: 'ease-out', fill: 'forwards' },
      )
    })

    const unsub = subscribePointer((sample) => {
      hovering = sample.hovering
      const dx = sample.aimX - inner.x
      const dy = sample.aimY - inner.y
      if (dx * dx + dy * dy > 240 * 240) {
        aura.x = outer.x = inner.x = sample.aimX
        aura.y = outer.y = inner.y = sample.aimY
      } else {
        aura.x = lerp(aura.x, sample.aimX, 0.28)
        aura.y = lerp(aura.y, sample.aimY, 0.28)
        outer.x = lerp(outer.x, sample.aimX, 0.45)
        outer.y = lerp(outer.y, sample.aimY, 0.45)
        inner.x = lerp(inner.x, sample.aimX, 0.65)
        inner.y = lerp(inner.y, sample.aimY, 0.65)
      }

      place(auraEl, aura.x, aura.y)
      place(outerEl, outer.x, outer.y)
      place(innerEl, inner.x, inner.y)
      paintState(sample.hovering)

      let alive = false
      for (const nova of novas) {
        if (!nova.active) continue
        nova.x += nova.vx
        nova.y += nova.vy
        nova.vx *= 0.94
        nova.vy = nova.vy * 0.94 + 0.04
        place(nova.el, nova.x, nova.y)
        if (sample.now - nova.born > 700) {
          nova.active = false
          nova.el.style.transform = offscreen
          continue
        }
        alive = true
      }

      const settled =
        Math.abs(inner.x - sample.aimX) < 0.4 &&
        Math.abs(inner.y - sample.aimY) < 0.4 &&
        Math.abs(aura.x - sample.aimX) < 0.6 &&
        Math.abs(aura.y - sample.aimY) < 0.6

      return alive || !settled
    })

    const onDown = (event: PointerEvent) => {
      pressed = true
      paintState(true)
      spawnNova(event.clientX, event.clientY, performance.now())
      kickPointerEngine()
    }

    const onUp = () => {
      pressed = false
      paintState(hovering)
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      unsubMove()
      unsub()
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      trails.forEach((dot) => dot.remove())
      novas.forEach((nova) => nova.el.remove())
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
      className="magnetic-cursor is-default"
      aria-hidden="true"
      data-cursor-ignore
    >
      <div ref={auraRef} className="magnetic-cursor-aura-wrap">
        <span className="magnetic-cursor-aura" />
        <span className="magnetic-cursor-aura magnetic-cursor-aura--core" />
      </div>
      <div ref={outerRef} className="magnetic-cursor-outer">
        <span className="magnetic-cursor-ring" />
      </div>
      <div ref={innerRef} className="magnetic-cursor-inner">
        <SparkMark className="magnetic-cursor-spark" />
      </div>
      <div ref={fxRef} className="magnetic-cursor-fx" />
    </div>
  )
}
