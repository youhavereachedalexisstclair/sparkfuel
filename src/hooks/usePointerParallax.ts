import { useMotionPointer } from './useMotionPointer'

/** @deprecated Prefer useMotionPointer — kept for callers that only need x/y. */
export function usePointerParallax() {
  const pointer = useMotionPointer()
  return { x: pointer.x, y: pointer.y }
}
