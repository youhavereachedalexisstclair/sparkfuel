import { useCallback, useEffect, useRef, type RefCallback } from 'react'
import { registerMagnet } from '../motion/pointerEngine'

type MagneticOptions = {
  /** Max pull in px. */
  strength?: number
  /** Attraction radius in px. */
  radius?: number
}

/**
 * Registers an element with the shared pointer loop.
 * The element eases toward the pointer while it is nearby.
 * No-ops on touch and prefers-reduced-motion.
 */
export function useMagnetic({
  strength = 12,
  radius = 120,
}: MagneticOptions = {}): RefCallback<HTMLElement> {
  const stopRef = useRef<() => void>(() => {})

  useEffect(() => () => stopRef.current(), [])

  return useCallback(
    (node: HTMLElement | null) => {
      stopRef.current()
      stopRef.current = () => {}
      if (!node) return
      node.dataset.magnetic = ''
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      const fine = window.matchMedia('(pointer: fine)')
      if (reduce.matches || !fine.matches) return
      stopRef.current = registerMagnet(node, strength, radius)
    },
    [radius, strength],
  )
}
