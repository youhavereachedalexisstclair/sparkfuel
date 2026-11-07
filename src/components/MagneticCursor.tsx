import { useEffect, useRef, useState } from 'react'
import { SparkMark } from './SparkMark'

type CursorState = 'default' | 'hover' | 'pressed'

type NovaSpark = {
  el: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  born: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

type MagnetHit = { x: number; y: number; strength: number; dist: number }

function nearestMagnetic(
  x: number,
  y: number,
  radius: number,
): { x: number; y: number; strength: number } | null {
  const nodes = document.querySelectorAll<HTMLElement>('[data-magnetic]')
  let best: MagnetHit | null = null

  for (const node of nodes) {
    if (node.closest('[data-cursor-ignore]')) continue
    const rect = node.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.hypot(x - cx, y - cy)
    const reach = Math.max(radius, Math.min(rect.width, rect.height) * 0.45 + 36)
    if (dist > reach) continue
    if (!best || dist < best.dist) {
      best = {
        x: cx,
        y: cy,
        dist,
        strength: 1 - dist / reach,
      }
    }
  }

  return best
    ? { x: best.x, y: best.y, strength: best.strength }
    : null
}

export function MagneticCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const auraRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<CursorState>('default')
  const target = useRef({ x: -100, y: -100 })
  const aura = useRef({ x: -100, y: -100 })
  const outer = useRef({ x: -100, y: -100 })
  const inner = useRef({ x: -100, y: -100 })
  const magnet = useRef<{ x: number; y: number; strength: number } | null>(null)
  const hovering = useRef(false)
  const pressed = useRef(false)
  const lastTrail = useRef(0)
  const lastMagnet = useRef(0)
  const novasRef = useRef<NovaSpark[]>([])

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

    let frame = 0
    let running = true

    const tick = () => {
      if (!running) return
      const now = performance.now()

      const pullTarget = magnet.current
      let aimX = target.current.x
      let aimY = target.current.y
      let engaged = false

      if (pullTarget && pullTarget.strength > 0.12) {
        const pull = pullTarget.strength * 0.35
        aimX = lerp(target.current.x, pullTarget.x, pull)
        aimY = lerp(target.current.y, pullTarget.y, pull)
        engaged = true
      }

      hovering.current = engaged
      const nextState: CursorState = pressed.current
        ? 'pressed'
        : engaged
          ? 'hover'
          : 'default'
      setState((prev) => (prev === nextState ? prev : nextState))

      // Snappy follow — aura still lags a touch for glow softeness
      aura.current.x = lerp(aura.current.x, aimX, 0.28)
      aura.current.y = lerp(aura.current.y, aimY, 0.28)
      outer.current.x = lerp(outer.current.x, aimX, 0.45)
      outer.current.y = lerp(outer.current.y, aimY, 0.45)
      inner.current.x = lerp(inner.current.x, aimX, 0.65)
      inner.current.y = lerp(inner.current.y, aimY, 0.65)

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${aura.current.x}px, ${aura.current.y}px, 0)`
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outer.current.x}px, ${outer.current.y}px, 0)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${inner.current.x}px, ${inner.current.y}px, 0)`
      }

      if (novasRef.current.length) {
        novasRef.current = novasRef.current.filter((n) => {
          n.x += n.vx
          n.y += n.vy
          n.vx *= 0.94
          n.vy = n.vy * 0.94 + 0.04
          n.el.style.transform = `translate3d(${n.x}px, ${n.y}px, 0)`
          if (now - n.born > 700) {
            n.el.remove()
            return false
          }
          return true
        })
      }

      frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY }

      const now = performance.now()
      if (now - lastMagnet.current > 32) {
        lastMagnet.current = now
        magnet.current = nearestMagnetic(event.clientX, event.clientY, 80)
      }

      if (fxRef.current && now - lastTrail.current > 40) {
        lastTrail.current = now
        const dot = document.createElement('span')
        dot.className = 'magnetic-cursor-trail'
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        fxRef.current.appendChild(dot)
        window.setTimeout(() => dot.remove(), 450)
      }
    }

    const spawnNova = (x: number, y: number) => {
      if (!fxRef.current) return
      const now = performance.now()
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.3
        const speed = 2.2 + Math.random() * 3.4
        const el = document.createElement('span')
        el.className = `magnetic-cursor-nova magnetic-cursor-nova--${i % 2 === 0 ? 'spark' : 'signal'}`
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        // Use a simple spark via CSS shape (no React SparkMark needed)
        fxRef.current.appendChild(el)
        novasRef.current.push({
          el,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          born: now,
        })
      }
      novasRef.current = novasRef.current.slice(-40)
    }

    const onDown = (event: PointerEvent) => {
      pressed.current = true
      setState('pressed')
      spawnNova(event.clientX, event.clientY)
    }

    const onUp = () => {
      pressed.current = false
      setState(hovering.current ? 'hover' : 'default')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    frame = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      novasRef.current.forEach((n) => n.el.remove())
      novasRef.current = []
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
      className={`magnetic-cursor is-${state}`}
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
