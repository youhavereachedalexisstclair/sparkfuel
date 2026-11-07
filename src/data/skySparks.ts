export type SparkSpec = {
  id: string
  top: string
  left: string
  size: number
  depth: 'far' | 'mid' | 'near' | 'dust'
  tone: 'spark' | 'signal' | 'mist'
  delay: string
  duration: string
}

/** Tiny deterministic PRNG so the sky is dense but stable across renders. */
function mulberry32(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildField(): SparkSpec[] {
  const rand = mulberry32(0x5fa12)
  const tones: SparkSpec['tone'][] = ['spark', 'signal', 'mist']
  const sparks: SparkSpec[] = []

  for (let i = 0; i < 90; i++) {
    sparks.push({
      id: `d${i}`,
      top: `${(rand() * 98).toFixed(2)}%`,
      left: `${(rand() * 98).toFixed(2)}%`,
      size: 3 + Math.floor(rand() * 5),
      depth: 'dust',
      tone: tones[Math.floor(rand() * tones.length)],
      delay: `${(-rand() * 6).toFixed(2)}s`,
      duration: `${(3.8 + rand() * 3.2).toFixed(2)}s`,
    })
  }

  for (let i = 0; i < 42; i++) {
    sparks.push({
      id: `f${i}`,
      top: `${(rand() * 96).toFixed(2)}%`,
      left: `${(rand() * 96).toFixed(2)}%`,
      size: 5 + Math.floor(rand() * 5),
      depth: 'far',
      tone: tones[Math.floor(rand() * tones.length)],
      delay: `${(-rand() * 5).toFixed(2)}s`,
      duration: `${(4.5 + rand() * 2.5).toFixed(2)}s`,
    })
  }

  const midSeeds = [
    [10, 12, 14], [18, 81, 18], [36, 6, 12], [42, 94, 16],
    [58, 16, 15], [63, 72, 13], [82, 22, 17], [84, 88, 14],
    [48, 50, 11], [22, 44, 13], [70, 45, 12], [39, 30, 10],
    [14, 58, 12], [76, 40, 14], [32, 75, 11], [55, 8, 13],
    [8, 35, 15], [91, 55, 12], [45, 68, 10], [66, 92, 14],
  ] as const
  midSeeds.forEach(([top, left, size], i) => {
    sparks.push({
      id: `m${i}`,
      top: `${top}%`,
      left: `${left}%`,
      size,
      depth: 'mid',
      tone: tones[i % tones.length],
      delay: `${(-rand() * 5).toFixed(2)}s`,
      duration: `${(6.5 + rand() * 2).toFixed(2)}s`,
    })
  })

  const nearSeeds = [
    [15, 70, 26], [60, 8, 22], [72, 90, 24], [28, 18, 20],
    [88, 62, 21], [40, 85, 18], [12, 40, 19], [78, 30, 23],
  ] as const
  nearSeeds.forEach(([top, left, size], i) => {
    sparks.push({
      id: `n${i}`,
      top: `${top}%`,
      left: `${left}%`,
      size,
      depth: 'near',
      tone: tones[i % tones.length],
      delay: `${(-rand() * 4).toFixed(2)}s`,
      duration: `${(8 + rand() * 2).toFixed(2)}s`,
    })
  })

  return sparks
}

export const SPARKS = buildField()

export const CONSTELLATION_POINTS = SPARKS.filter(
  (s) => s.depth === 'mid' || s.depth === 'near',
).map((s) => ({
  id: s.id,
  x: parseFloat(s.left),
  y: parseFloat(s.top),
}))
