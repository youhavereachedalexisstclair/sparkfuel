import { CONSTELLATION_POINTS } from '../data/skySparks'

type Edge = { id: string; x1: number; y1: number; x2: number; y2: number }

function buildEdges(maxDist = 28): Edge[] {
  const edges: Edge[] = []
  const pts = CONSTELLATION_POINTS
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i]
      const b = pts[j]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (dist > 8 && dist < maxDist) {
        edges.push({
          id: `${a.id}-${b.id}`,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
        })
      }
    }
  }
  return edges
}

const EDGES = buildEdges()

/** Soft constellation threads that wake as the page ignites. */
export function Constellation() {
  return (
    <svg
      className="constellation"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {EDGES.map((edge) => (
        <line
          key={edge.id}
          className="constellation-line"
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
        />
      ))}
    </svg>
  )
}
