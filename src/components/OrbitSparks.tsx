import { SparkMark } from './SparkMark'

const ORBITERS = [
  { angle: 0, size: 12, tone: 'spark' as const, radius: 1 },
  { angle: 72, size: 9, tone: 'signal' as const, radius: 1.08 },
  { angle: 144, size: 11, tone: 'mist' as const, radius: 0.92 },
  { angle: 216, size: 8, tone: 'spark' as const, radius: 1.12 },
  { angle: 288, size: 10, tone: 'signal' as const, radius: 0.96 },
]

/** Orbiting sparks around the contact CTA while hovered/focused. */
export function OrbitSparks() {
  return (
    <div className="orbit-sparks" aria-hidden="true">
      {ORBITERS.map((orb) => (
        <span
          key={orb.angle}
          className="orbit-sparks-arm"
          style={{
            ['--orbit-angle' as string]: `${orb.angle}deg`,
            ['--orbit-radius' as string]: String(orb.radius),
            animationDelay: `${-orb.angle / 60}s`,
          }}
        >
          <SparkMark
            className={`orbit-sparks-mark orbit-sparks-mark--${orb.tone}`}
            style={{ width: orb.size, height: orb.size }}
          />
        </span>
      ))}
    </div>
  )
}
