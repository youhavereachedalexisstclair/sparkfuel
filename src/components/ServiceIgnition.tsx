import type { CSSProperties } from 'react'
import { SparkMark } from './SparkMark'

/** Full-bleed constellation patterns per service index. */
const PATTERNS: { x: number; y: number; size: number; tone: 'spark' | 'signal' | 'mist' }[][] = [
  // 0 Strategy — north star
  [
    { x: 50, y: 12, size: 28, tone: 'spark' },
    { x: 28, y: 36, size: 18, tone: 'signal' },
    { x: 72, y: 34, size: 18, tone: 'mist' },
    { x: 50, y: 48, size: 22, tone: 'spark' },
    { x: 14, y: 62, size: 14, tone: 'signal' },
    { x: 86, y: 60, size: 14, tone: 'mist' },
    { x: 36, y: 78, size: 16, tone: 'spark' },
    { x: 64, y: 82, size: 16, tone: 'signal' },
    { x: 50, y: 92, size: 12, tone: 'mist' },
  ],
  // 1 Tools — circuit grid
  [
    { x: 12, y: 18, size: 16, tone: 'signal' },
    { x: 38, y: 18, size: 16, tone: 'spark' },
    { x: 62, y: 18, size: 16, tone: 'signal' },
    { x: 88, y: 18, size: 16, tone: 'mist' },
    { x: 12, y: 50, size: 16, tone: 'mist' },
    { x: 38, y: 50, size: 22, tone: 'spark' },
    { x: 62, y: 50, size: 22, tone: 'spark' },
    { x: 88, y: 50, size: 16, tone: 'signal' },
    { x: 12, y: 82, size: 16, tone: 'signal' },
    { x: 38, y: 82, size: 16, tone: 'mist' },
    { x: 62, y: 82, size: 16, tone: 'signal' },
    { x: 88, y: 82, size: 16, tone: 'spark' },
  ],
  // 2 Brand — diamond
  [
    { x: 50, y: 8, size: 24, tone: 'spark' },
    { x: 22, y: 36, size: 20, tone: 'signal' },
    { x: 78, y: 36, size: 20, tone: 'signal' },
    { x: 50, y: 50, size: 16, tone: 'mist' },
    { x: 8, y: 58, size: 14, tone: 'mist' },
    { x: 92, y: 58, size: 14, tone: 'mist' },
    { x: 28, y: 78, size: 18, tone: 'spark' },
    { x: 72, y: 78, size: 18, tone: 'spark' },
    { x: 50, y: 94, size: 24, tone: 'signal' },
  ],
  // 3 Websites — frame
  [
    { x: 10, y: 12, size: 20, tone: 'signal' },
    { x: 50, y: 10, size: 16, tone: 'mist' },
    { x: 90, y: 12, size: 20, tone: 'signal' },
    { x: 10, y: 50, size: 16, tone: 'spark' },
    { x: 50, y: 48, size: 28, tone: 'spark' },
    { x: 90, y: 50, size: 16, tone: 'spark' },
    { x: 10, y: 88, size: 20, tone: 'mist' },
    { x: 50, y: 90, size: 16, tone: 'signal' },
    { x: 90, y: 88, size: 20, tone: 'mist' },
  ],
  // 4 Social — radiating
  [
    { x: 50, y: 50, size: 30, tone: 'spark' },
    { x: 50, y: 12, size: 16, tone: 'signal' },
    { x: 78, y: 22, size: 14, tone: 'mist' },
    { x: 90, y: 50, size: 16, tone: 'signal' },
    { x: 78, y: 78, size: 14, tone: 'mist' },
    { x: 50, y: 90, size: 16, tone: 'signal' },
    { x: 22, y: 78, size: 14, tone: 'mist' },
    { x: 10, y: 50, size: 16, tone: 'signal' },
    { x: 22, y: 22, size: 14, tone: 'mist' },
  ],
  // 5 Campaigns — arrow
  [
    { x: 8, y: 50, size: 14, tone: 'mist' },
    { x: 24, y: 50, size: 16, tone: 'signal' },
    { x: 42, y: 50, size: 18, tone: 'spark' },
    { x: 60, y: 50, size: 22, tone: 'spark' },
    { x: 80, y: 50, size: 26, tone: 'spark' },
    { x: 68, y: 28, size: 16, tone: 'signal' },
    { x: 68, y: 72, size: 16, tone: 'signal' },
    { x: 88, y: 18, size: 12, tone: 'mist' },
    { x: 88, y: 82, size: 12, tone: 'mist' },
  ],
  // 6 Merch — tag
  [
    { x: 28, y: 16, size: 18, tone: 'spark' },
    { x: 52, y: 14, size: 18, tone: 'spark' },
    { x: 74, y: 28, size: 16, tone: 'signal' },
    { x: 86, y: 52, size: 20, tone: 'signal' },
    { x: 72, y: 78, size: 16, tone: 'mist' },
    { x: 48, y: 88, size: 18, tone: 'mist' },
    { x: 24, y: 78, size: 16, tone: 'spark' },
    { x: 14, y: 50, size: 16, tone: 'signal' },
    { x: 50, y: 50, size: 14, tone: 'mist' },
  ],
  // 7 Everything — wild
  [
    { x: 8, y: 14, size: 16, tone: 'spark' },
    { x: 32, y: 10, size: 20, tone: 'signal' },
    { x: 58, y: 18, size: 14, tone: 'mist' },
    { x: 86, y: 12, size: 18, tone: 'spark' },
    { x: 16, y: 42, size: 18, tone: 'signal' },
    { x: 48, y: 46, size: 24, tone: 'spark' },
    { x: 78, y: 40, size: 16, tone: 'mist' },
    { x: 10, y: 72, size: 14, tone: 'mist' },
    { x: 38, y: 78, size: 18, tone: 'signal' },
    { x: 66, y: 70, size: 16, tone: 'spark' },
    { x: 90, y: 82, size: 20, tone: 'signal' },
    { x: 52, y: 92, size: 14, tone: 'mist' },
  ],
]

type ServiceIgnitionProps = {
  index: number | null
  /** Only show while the Services chapter is in focus. */
  active: boolean
}

export function ServiceIgnition({ index, active }: ServiceIgnitionProps) {
  if (!active || index === null) return null
  const pattern = PATTERNS[index % PATTERNS.length]

  const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = []
  pattern.forEach((a, i) => {
    const ranked = pattern
      .map((b, j) => ({ b, j, dist: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((item) => item.j !== i)
      .sort((p, q) => p.dist - q.dist)
      .slice(0, 2)
    ranked.forEach(({ b, j }) => {
      if (j < i) return
      lines.push({
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        key: `${i}-${j}`,
      })
    })
  })

  return (
    <div className="service-ignition is-expanded" aria-hidden="true" key={index}>
      <svg className="service-ignition-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {lines.map((line) => (
          <line
            key={line.key}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="service-ignition-line"
          />
        ))}
      </svg>
      {pattern.map((point, i) => (
        <SparkMark
          key={`${point.x}-${point.y}-${i}`}
          className={`service-ignition-spark service-ignition-spark--${point.tone}`}
          style={
            {
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: point.size,
              height: point.size,
              animationDelay: `${i * 0.06}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
