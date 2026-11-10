import { useEffect } from 'react'
import { startPointerEngine } from '../motion/pointerEngine'

let users = 0
let stopEngine = () => {}

/** Starts the shared pointer loop. Does not re-render on mouse move. */
export function usePointerEngine() {
  useEffect(() => {
    users += 1
    if (users === 1) stopEngine = startPointerEngine()
    return () => {
      users -= 1
      if (users === 0) {
        stopEngine()
        stopEngine = () => {}
      }
    }
  }, [])
}
