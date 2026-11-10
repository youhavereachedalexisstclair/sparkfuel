import { usePointerEngine } from './usePointerEngine'

export type MotionPointer = {
  /** Normalized from center (-0.5 … 0.5). */
  x: number
  y: number
  /** Raw client coordinates. */
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

/**
 * Pointer parallax is applied on the document element by the shared engine.
 * This hook no longer stores pointer position in React state.
 */
export function useMotionPointer(lerpFactor = 0.28) {
  void lerpFactor
  usePointerEngine()
  return IDLE
}
