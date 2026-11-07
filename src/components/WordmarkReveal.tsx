import { useEffect, useRef, useState } from 'react'
import { SparkMark } from './SparkMark'

type WordmarkRevealProps = {
  src: string
  alt: string
  className?: string
}

const SHARDS = Array.from({ length: 14 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 14
  return {
    id: i,
    x: Math.cos(angle) * (48 + (i % 3) * 22),
    y: Math.sin(angle) * (34 + (i % 4) * 16),
    size: 8 + (i % 5) * 3,
    tone: (['spark', 'signal', 'mist'] as const)[i % 3],
    delay: i * 0.06,
  }
})

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Wordmark stays put, then shatters into sparks and reforms on hover.
 */
export function WordmarkReveal({ src, alt, className }: WordmarkRevealProps) {
  const [phase, setPhase] = useState<'shatter' | 'reform' | 'done'>('done')
  const [burst, setBurst] = useState(0)
  const busyRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => () => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
  }, [])

  const playSpark = () => {
    if (prefersReducedMotion() || busyRef.current) return

    busyRef.current = true
    timersRef.current.forEach((id) => window.clearTimeout(id))
    setBurst((n) => n + 1)
    setPhase('shatter')

    const reform = window.setTimeout(() => setPhase('reform'), 1100)
    const done = window.setTimeout(() => {
      setPhase('done')
      busyRef.current = false
    }, 2400)
    timersRef.current = [reform, done]
  }

  return (
    <div
      className={`wordmark-reveal is-${phase}`}
      onPointerEnter={playSpark}
    >
      <div className="wordmark-shards" aria-hidden="true" key={burst}>
        {SHARDS.map((shard) => (
          <SparkMark
            key={shard.id}
            className={`wordmark-shard wordmark-shard--${shard.tone}`}
            style={{
              width: shard.size,
              height: shard.size,
              ['--shard-x' as string]: `${shard.x}px`,
              ['--shard-y' as string]: `${shard.y}px`,
              animationDelay: `${shard.delay}s`,
            }}
          />
        ))}
      </div>
      <img className={className} src={src} alt={alt} />
    </div>
  )
}
