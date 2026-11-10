import { useLayoutEffect, useRef, useState } from 'react'
import { workPieces, type WorkPiece } from '../data/work'
import { SparkMark } from '../components/SparkMark'

/** Desktop viewport the framed sites lay out at. Wider than their phone breakpoints. */
const SITE_WIDTH = 1120
const SITE_HEIGHT = 700

export function WorkPage() {
  const [activeId, setActiveId] = useState(workPieces[0]?.id ?? '')
  const active = workPieces.find((piece) => piece.id === activeId) ?? workPieces[0]

  return (
    <main className="work">
      <div className="work-stage">
        <div className="work-copy">
          <p className="eyebrow">
            <SparkMark className="eyebrow-spark" />
            The flame
          </p>
          <h1>
            Sites in <span>motion.</span>
          </h1>
          <p className="work-lede">
            Custom websites, playing here before they go live.
          </p>
          <ol className="work-list">
            {workPieces.map((piece, index) => {
              const selected = piece.id === active?.id
              return (
                <li key={piece.id}>
                  <button
                    type="button"
                    className={`work-piece${selected ? ' is-active' : ''}`}
                    aria-pressed={selected}
                    data-magnetic
                    onClick={() => setActiveId(piece.id)}
                  >
                    <span className="work-piece-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="work-piece-title">{piece.title}</span>
                    <span className="work-piece-meta">{piece.meta}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        {active ? <WorkFrame piece={active} /> : null}
      </div>
    </main>
  )
}

function WorkFrame({ piece }: { piece: WorkPiece }) {
  const frameRef = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)
  const [loadedUrl, setLoadedUrl] = useState('')
  const host = new URL(piece.url).host

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const update = () => {
      const width = frame.clientWidth
      if (width > 0) setScale(width / SITE_WIDTH)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="work-stage-frame">
      <div className="work-frame-halo" aria-hidden="true" />
      <figure ref={frameRef} className="work-frame" aria-label={`${piece.title} website`}>
        <div className="work-chrome">
          <span className="work-dots" aria-hidden="true">
            <span className="work-dot work-dot--spark" />
            <span className="work-dot work-dot--signal" />
            <span className="work-dot work-dot--mist" />
          </span>
          <span className="work-url">{host}</span>
          <a className="work-chrome-play" href={piece.url} target="_blank" rel="noreferrer">
            Open
          </a>
        </div>
        <div className="work-screen" style={{ height: SITE_HEIGHT * scale }}>
          {loadedUrl === piece.url ? null : <p className="work-loading">Loading site</p>}
          <iframe
            key={piece.url}
            title={piece.title}
            src={piece.url}
            onLoad={() => setLoadedUrl(piece.url)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: SITE_WIDTH,
              height: SITE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </figure>
    </div>
  )
}
