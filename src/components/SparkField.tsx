import type { CSSProperties } from 'react'
import { SPARKS, type SparkSpec } from '../data/skySparks'
import { SparkMark } from './SparkMark'

type SparkFieldProps = {
  className?: string
  depth: SparkSpec['depth']
}

export function SparkField({ className, depth }: SparkFieldProps) {
  return (
    <div className={className ?? `spark-field spark-field--${depth}`} aria-hidden="true">
      {SPARKS.filter((spark) => spark.depth === depth).map((spark) => (
        <SparkMark
          key={spark.id}
          className={`sky-spark sky-spark--${spark.depth} sky-spark--${spark.tone}`}
          style={
            {
              top: spark.top,
              left: spark.left,
              width: spark.size,
              height: spark.size,
              '--twinkle-delay': spark.delay,
              '--twinkle-duration': spark.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
