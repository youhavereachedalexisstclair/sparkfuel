import { useEffect, useState } from 'react'

type Pointer = { x: number; y: number }

/** Normalized pointer position from center (-0.5 … 0.5). */
export function usePointerParallax() {
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 })

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setPointer({
          x: event.clientX / window.innerWidth - 0.5,
          y: event.clientY / window.innerHeight - 0.5,
        })
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return pointer
}
