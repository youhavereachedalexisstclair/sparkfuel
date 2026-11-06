import { useEffect, useState } from 'react'

export function useParallax() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setOffset(window.scrollY)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return offset
}
