import { useLayoutEffect, useRef, useState } from 'react'
import { SparkMark } from '../components/SparkMark'

const sites = [
  {
    id: 'fire-waste',
    title: 'Fire Waste',
    url: 'https://fire-waste.pages.dev',
  },
  {
    id: 'black-sheep',
    title: 'Black Sheep',
    url: 'https://black-sheep-ex7.pages.dev',
  },
]

/** Desktop viewport both sites lay out at. Wider than either phone breakpoint. */
const SITE_WIDTH = 1120
const SITE_HEIGHT = 700

export function WorkV2Page() {
  const [activeId, setActiveId] = useState(sites[0].id)
  const active = sites.find((site) => site.id === activeId) ?? sites[0]

  return (
    <main className="work-v2">
      <div className="work-v2-stage">
        <div className="work-v2-copy">
          <p className="eyebrow">
            <SparkMark className="eyebrow-spark" />
            Sandbox
          </p>
          <h1>
            Work <span>V2.</span>
          </h1>
          <p className="work-v2-lede">
            Live sites inside the frame. The Work page is unchanged.
          </p>
          <ol className="work-v2-list">
            {sites.map((site, index) => {
              const selected = site.id === active.id
              return (
                <li key={site.id}>
                  <button
                    type="button"
                    className={`work-v2-piece${selected ? ' is-active' : ''}`}
                    aria-pressed={selected}
                    onClick={() => setActiveId(site.id)}
                  >
                    <span className="work-v2-piece-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="work-v2-piece-title">{site.title}</span>
                    <span className="work-v2-piece-meta">Live site</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="work-v2-back">
            <a href="/work">Back to Work</a>
          </p>
        </div>

        <WorkV2Frame site={active} />
      </div>
    </main>
  )
}

function WorkV2Frame({ site }: { site: (typeof sites)[number] }) {
  const frameRef = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)
  const [loadedUrl, setLoadedUrl] = useState('')
  const host = new URL(site.url).host

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
    <div className="work-v2-stage-frame">
      <div className="work-v2-halo" aria-hidden="true" />
      <figure ref={frameRef} className="work-v2-frame" aria-label={`${site.title} website`}>
        <div className="work-v2-chrome">
          <span className="work-v2-dots" aria-hidden="true">
            <span className="work-v2-dot work-v2-dot--spark" />
            <span className="work-v2-dot work-v2-dot--signal" />
            <span className="work-v2-dot work-v2-dot--mist" />
          </span>
          <span className="work-v2-url">{host}</span>
          <a className="work-v2-open" href={site.url} target="_blank" rel="noreferrer">
            Open
          </a>
        </div>
        <div className="work-v2-screen" style={{ height: SITE_HEIGHT * scale }}>
          {loadedUrl === site.url ? null : <p className="work-v2-loading">Loading site</p>}
          <iframe
            key={site.url}
            title={site.title}
            src={site.url}
            onLoad={() => setLoadedUrl(site.url)}
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
