import type { CSSProperties } from 'react'
import { SparkMark } from './SparkMark'

type SparkSpec = {
  id: string
  top: string
  left: string
  size: number
  depth: 'far' | 'mid' | 'near'
  tone: 'spark' | 'signal' | 'mist'
  delay: string
  duration: string
}

/** Deterministic constellation — dense enough to feel alive, not random noise. */
const SPARKS: SparkSpec[] = [
  // far dust
  { id: 'f1', top: '6%', left: '4%', size: 7, depth: 'far', tone: 'mist', delay: '0s', duration: '5.2s' },
  { id: 'f2', top: '11%', left: '18%', size: 6, depth: 'far', tone: 'spark', delay: '-1.1s', duration: '6.1s' },
  { id: 'f3', top: '8%', left: '37%', size: 8, depth: 'far', tone: 'signal', delay: '-2.4s', duration: '4.8s' },
  { id: 'f4', top: '14%', left: '55%', size: 5, depth: 'far', tone: 'mist', delay: '-0.7s', duration: '5.6s' },
  { id: 'f5', top: '5%', left: '72%', size: 9, depth: 'far', tone: 'spark', delay: '-3.2s', duration: '6.4s' },
  { id: 'f6', top: '16%', left: '88%', size: 6, depth: 'far', tone: 'signal', delay: '-1.8s', duration: '5s' },
  { id: 'f7', top: '28%', left: '9%', size: 7, depth: 'far', tone: 'spark', delay: '-4s', duration: '5.8s' },
  { id: 'f8', top: '33%', left: '26%', size: 5, depth: 'far', tone: 'mist', delay: '-2.1s', duration: '4.5s' },
  { id: 'f9', top: '24%', left: '48%', size: 8, depth: 'far', tone: 'signal', delay: '-0.4s', duration: '6.2s' },
  { id: 'f10', top: '31%', left: '67%', size: 6, depth: 'far', tone: 'spark', delay: '-3.6s', duration: '5.3s' },
  { id: 'f11', top: '27%', left: '93%', size: 7, depth: 'far', tone: 'mist', delay: '-1.5s', duration: '4.9s' },
  { id: 'f12', top: '44%', left: '3%', size: 6, depth: 'far', tone: 'signal', delay: '-2.8s', duration: '5.7s' },
  { id: 'f13', top: '52%', left: '21%', size: 5, depth: 'far', tone: 'spark', delay: '-0.9s', duration: '6s' },
  { id: 'f14', top: '47%', left: '41%', size: 8, depth: 'far', tone: 'mist', delay: '-4.2s', duration: '5.1s' },
  { id: 'f15', top: '55%', left: '63%', size: 6, depth: 'far', tone: 'signal', delay: '-1.3s', duration: '4.7s' },
  { id: 'f16', top: '49%', left: '84%', size: 7, depth: 'far', tone: 'spark', delay: '-3s', duration: '5.9s' },
  { id: 'f17', top: '68%', left: '11%', size: 5, depth: 'far', tone: 'mist', delay: '-2.6s', duration: '5.4s' },
  { id: 'f18', top: '74%', left: '34%', size: 8, depth: 'far', tone: 'signal', delay: '-0.2s', duration: '6.3s' },
  { id: 'f19', top: '71%', left: '58%', size: 6, depth: 'far', tone: 'spark', delay: '-4.5s', duration: '4.6s' },
  { id: 'f20', top: '78%', left: '79%', size: 7, depth: 'far', tone: 'mist', delay: '-1.7s', duration: '5.5s' },
  { id: 'f21', top: '88%', left: '7%', size: 6, depth: 'far', tone: 'signal', delay: '-3.4s', duration: '5.2s' },
  { id: 'f22', top: '92%', left: '29%', size: 5, depth: 'far', tone: 'spark', delay: '-2s', duration: '6.1s' },
  { id: 'f23', top: '86%', left: '52%', size: 8, depth: 'far', tone: 'mist', delay: '-0.6s', duration: '4.8s' },
  { id: 'f24', top: '94%', left: '74%', size: 6, depth: 'far', tone: 'signal', delay: '-4.1s', duration: '5.6s' },
  { id: 'f25', top: '90%', left: '95%', size: 7, depth: 'far', tone: 'spark', delay: '-1.9s', duration: '5s' },

  // mid constellation
  { id: 'm1', top: '10%', left: '12%', size: 14, depth: 'mid', tone: 'spark', delay: '-0.5s', duration: '7.2s' },
  { id: 'm2', top: '18%', left: '81%', size: 18, depth: 'mid', tone: 'signal', delay: '-2.2s', duration: '8.1s' },
  { id: 'm3', top: '36%', left: '6%', size: 12, depth: 'mid', tone: 'spark', delay: '-3.8s', duration: '6.8s' },
  { id: 'm4', top: '42%', left: '94%', size: 16, depth: 'mid', tone: 'mist', delay: '-1.4s', duration: '7.6s' },
  { id: 'm5', top: '58%', left: '16%', size: 15, depth: 'mid', tone: 'signal', delay: '-4.6s', duration: '8.4s' },
  { id: 'm6', top: '63%', left: '72%', size: 13, depth: 'mid', tone: 'spark', delay: '-0.8s', duration: '7s' },
  { id: 'm7', top: '82%', left: '22%', size: 17, depth: 'mid', tone: 'spark', delay: '-2.9s', duration: '7.8s' },
  { id: 'm8', top: '84%', left: '88%', size: 14, depth: 'mid', tone: 'signal', delay: '-3.3s', duration: '6.5s' },
  { id: 'm9', top: '48%', left: '50%', size: 11, depth: 'mid', tone: 'mist', delay: '-1.6s', duration: '8s' },
  { id: 'm10', top: '22%', left: '44%', size: 13, depth: 'mid', tone: 'spark', delay: '-4.8s', duration: '7.4s' },
  { id: 'm11', top: '70%', left: '45%', size: 12, depth: 'mid', tone: 'signal', delay: '-2.5s', duration: '6.9s' },
  { id: 'm12', top: '39%', left: '30%', size: 10, depth: 'mid', tone: 'spark', delay: '-0.3s', duration: '7.7s' },

  // near hero accents
  { id: 'n1', top: '15%', left: '70%', size: 26, depth: 'near', tone: 'spark', delay: '-1s', duration: '9s' },
  { id: 'n2', top: '60%', left: '8%', size: 22, depth: 'near', tone: 'signal', delay: '-2.7s', duration: '8.6s' },
  { id: 'n3', top: '72%', left: '90%', size: 24, depth: 'near', tone: 'spark', delay: '-4s', duration: '9.4s' },
  { id: 'n4', top: '28%', left: '18%', size: 20, depth: 'near', tone: 'mist', delay: '-0.9s', duration: '8.2s' },
  { id: 'n5', top: '88%', left: '62%', size: 21, depth: 'near', tone: 'signal', delay: '-3.5s', duration: '9.1s' },
]

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
