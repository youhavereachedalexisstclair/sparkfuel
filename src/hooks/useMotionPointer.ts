import { useEffect, useRef, useState } from 'react'

export type MotionPointer = {
  /** Normalized from center (-0.5 … 0.5), lerped. */
  x: number
  y: number
  /** Raw client coordinates (lerped for cursor feel). */
  clientX: number
  clientY: number
  active: boolean
}

const IDLE: MotionPointer = {
  x: 0,
  y: 0,
  clientX: 0,
  clientY: 0,
  active: false,
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * Smooth pointer for parallax + cursor. Fine-pointer only; respects reduced motion.
 */
export function useMotionPointer(lerpFactor = 0.14) {
  const [pointer, setPointer] = useState<MotionPointer>(IDLE)
  const target = useRef({ x: 0, y: 0, clientX: 0, clientY: 0, active: false })
  const current = useRef({ ...IDLE })
  const frame = useRef(0)
  const looping = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    if (reduce.matches || !fine.matches) return

    const tick = () => {
      const t = target.current
      const c = current.current
      c.x = lerp(c.x, t.x, lerpFactor)
      c.y = lerp(c.y, t.y, lerpFactor)
      c.clientX = lerp(c.clientX, t.clientX, lerpFactor)
      c.clientY = lerp(c.clientY, t.clientY, lerpFactor)
      c.active = t.active
      setPointer({ ...c })

      const settled =
        Math.abs(c.x - t.x) < 0.0004 &&
        Math.abs(c.y - t.y) < 0.0004 &&
        Math.abs(c.clientX - t.clientX) < 0.2 &&
        Math.abs(c.clientY - t.clientY) < 0.2

      if (settled) {
        looping.current = false
        return
      }

      frame.current = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (looping.current) return
      looping.current = true
      frame.current = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      target.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
        clientX: event.clientX,
        clientY: event.clientY,
        active: true,
      }
      kick()
    }

    const onLeave = () => {
      target.current.active = false
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      looping.current = false
      cancelAnimationFrame(frame.current)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [lerpFactor])

  return pointer
}
