import { useCallback, useEffect, useRef, type RefCallback } from 'react'

type MagneticOptions = {
  /** Max pull in px. */
  strength?: number
  /** Attraction radius in px. */
  radius?: number
}

/**
 * Pulls an element toward the pointer while hovered / nearby.
 * No-ops on touch and prefers-reduced-motion.
 */
export function useMagnetic({
  strength = 12,
  radius = 120,
}: MagneticOptions = {}): RefCallback<HTMLElement> {
  const nodeRef = useRef<HTMLElement | null>(null)
  const frame = useRef(0)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const apply = useCallback(function applyFrame() {
    const el = nodeRef.current
    if (!el) return
    current.current.x += (target.current.x - current.current.x) * 0.18
    current.current.y += (target.current.y - current.current.y) * 0.18
    el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`

    const settled =
      Math.abs(current.current.x - target.current.x) < 0.05 &&
      Math.abs(current.current.y - target.current.y) < 0.05

    if (!settled || target.current.x !== 0 || target.current.y !== 0) {
      frame.current = requestAnimationFrame(applyFrame)
    } else {
      current.current = { x: 0, y: 0 }
      el.style.transform = ''
    }
  }, [])

  const setTarget = useCallback(
    (x: number, y: number) => {
      target.current = { x, y }
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(apply)
    },
    [apply],
  )

  const ref = useCallback<RefCallback<HTMLElement>>((node) => {
    nodeRef.current = node
    if (node) {
      node.dataset.magnetic = ''
    }
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    if (reduce.matches || !fine.matches) return

    const onMove = (event: PointerEvent) => {
      const el = nodeRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const dist = Math.hypot(dx, dy)

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength
        setTarget((dx / dist || 0) * pull, (dy / dist || 0) * pull)
      } else {
        setTarget(0, 0)
      }
    }

    const onLeave = () => setTarget(0, 0)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', onLeave)
      if (nodeRef.current) nodeRef.current.style.transform = ''
    }
  }, [radius, setTarget, strength])

  return ref
}
