import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { workPieces, type WorkPiece } from '../data/work'
import { SparkMark } from '../components/SparkMark'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(prefersReducedMotion)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    if (prefersReducedMotion()) {
      video.pause()
      setPaused(true)
      return
    }
    const play = video.play()
    if (play) {
      play.then(() => setPaused(false)).catch(() => setPaused(true))
    }
  }, [piece.src])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPaused(false)).catch(() => setPaused(true))
    } else {
      video.pause()
      setPaused(true)
    }
  }

  return (
    <div className="work-stage-frame">
      <div className="work-frame-halo" aria-hidden="true" />
      <figure className="work-frame" aria-label={`${piece.title} website preview`}>
        <div className="work-chrome">
          <span className="work-dots" aria-hidden="true">
            <span className="work-dot work-dot--spark" />
            <span className="work-dot work-dot--signal" />
            <span className="work-dot work-dot--mist" />
          </span>
          <span className="work-url">{piece.title}</span>
          <button type="button" className="work-chrome-play" onClick={toggle} data-magnetic>
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
        <div
          className="work-screen"
          style={{ '--work-aspect': piece.aspect } as CSSProperties}
        >
          <video
            ref={videoRef}
            key={piece.src}
            className="work-frame-video"
            src={piece.src}
            poster={piece.poster}
            muted
            loop
            playsInline
            preload="auto"
            onClick={toggle}
          />
          {paused ? (
            <button type="button" className="work-play" onClick={toggle}>
              Play preview
            </button>
          ) : null}
        </div>
      </figure>
    </div>
  )
}
