import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { SparkMark } from './SparkMark'

type EmberTone = 'spark' | 'signal' | 'mist'

type Ember = {
  x: string
  y: string
  size: number
  rotate: string
  tone: EmberTone
  delay: string
}

type Service = {
  title: string
  body: string
  tone: 'spark' | 'signal'
  offers: string[]
  embers: Ember[]
}

function ember(
  x: number,
  y: number,
  size: number,
  rotate: number,
  tone: EmberTone,
  delay: number,
): Ember {
  return {
    x: `${x}%`,
    y: `${y}%`,
    size,
    rotate: `${rotate}deg`,
    tone,
    delay: `${delay}s`,
  }
}

const services: Service[] = [
  {
    title: 'Strategy & Insights',
    tone: 'spark',
    body: 'Turn your idea into a real business. I’ll help you brainstorm, research the market and competitors, set up your LLC and financial accounts, and protect your name with trademarks.',
    offers: ['Brainstorming', 'Market research', 'LLC & accounts', 'Trademarks'],
    embers: [
      ember(6, 62, 1.05, -12, 'signal', 0.02),
      ember(28, 38, 1.45, 8, 'spark', 0.08),
      ember(52, 12, 2.35, 0, 'spark', 0.14),
      ember(78, 36, 0.85, 18, 'mist', 0.2),
      ember(14, 16, 0.7, -18, 'spark', 0.26),
    ],
  },
  {
    title: 'Smart Tools & Systems',
    tone: 'signal',
    body: 'Get your operations running smoothly behind the scenes. I’ll set up Google Workspace, secure your domain, and implement tech integrations, automations, and tools that make your workday flow.',
    offers: ['Google Workspace', 'Domain', 'Automations', 'Integrations'],
    embers: [
      ember(10, 16, 1.15, -6, 'signal', 0.02),
      ember(42, 14, 1.15, 4, 'signal', 0.08),
      ember(74, 20, 0.75, 14, 'mist', 0.14),
      ember(18, 52, 0.95, -10, 'mist', 0.18),
      ember(50, 50, 1.7, 0, 'spark', 0.24),
    ],
  },
  {
    title: 'Visual Brand Identity',
    tone: 'spark',
    body: 'Design a brand that connects, stands out, and feels like you. I’ll craft your logo, color palette, typography, and brand guide. I’ll also help refine your photo direction and tone of voice.',
    offers: ['Logo', 'Color & type', 'Brand guide', 'Photo & voice'],
    embers: [
      ember(34, 18, 2.8, 0, 'spark', 0.04),
      ember(8, 22, 0.7, -14, 'mist', 0.12),
      ember(76, 14, 0.9, 12, 'signal', 0.16),
      ember(70, 58, 1.15, 8, 'spark', 0.22),
      ember(12, 60, 0.75, -8, 'signal', 0.28),
    ],
  },
  {
    title: 'Custom Websites',
    tone: 'signal',
    body: 'Build a site that looks good and works hard for you. Each one is custom-designed, mobile-friendly, and equipped with SEO tools to help you show up where it matters.',
    offers: ['Custom design', 'Mobile-friendly', 'SEO'],
    embers: [
      ember(38, 10, 2.15, -4, 'signal', 0.04),
      ember(72, 22, 0.8, 16, 'spark', 0.12),
      ember(8, 58, 0.95, -8, 'mist', 0.16),
      ember(32, 56, 1.05, 6, 'signal', 0.2),
      ember(56, 54, 1.2, 0, 'spark', 0.26),
    ],
  },
  {
    title: 'Social Media',
    tone: 'spark',
    body: 'Get your platforms looking sharp and running with purpose. I can set up or refresh your accounts, align them with your brand and goals, and create content calendars that make posting easy.',
    offers: ['Setup & refresh', 'Brand alignment', 'Content calendars'],
    embers: [
      ember(12, 20, 1.35, -10, 'spark', 0.02),
      ember(40, 8, 0.8, 8, 'signal', 0.1),
      ember(58, 32, 1.85, 4, 'spark', 0.16),
      ember(18, 58, 0.85, -16, 'mist', 0.22),
      ember(76, 56, 1.05, 14, 'signal', 0.28),
    ],
  },
  {
    title: 'Campaigns & Content',
    tone: 'signal',
    body: 'Spread the word. I plan, design, and launch campaigns across social, email, and ads. The goal is to show up consistently and connect with your audience.',
    offers: ['Social', 'Email', 'Ads'],
    embers: [
      ember(36, 28, 2.2, 0, 'spark', 0.04),
      ember(6, 10, 0.8, -18, 'signal', 0.12),
      ember(74, 8, 0.85, 16, 'signal', 0.16),
      ember(22, 66, 0.7, -8, 'mist', 0.22),
      ember(70, 60, 1.1, 10, 'spark', 0.28),
    ],
  },
  {
    title: 'Branded Merch & Materials',
    tone: 'spark',
    body: 'Bring your brand to life in the real world. From business cards and stickers to packaging and apparel, I’ll design merch and materials that look polished, intentional, and unmistakably yours.',
    offers: ['Cards & stickers', 'Packaging', 'Apparel'],
    embers: [
      ember(36, 8, 1.75, -6, 'spark', 0.04),
      ember(8, 56, 1.1, -12, 'spark', 0.12),
      ember(30, 64, 0.8, 8, 'mist', 0.16),
      ember(52, 52, 1.25, 4, 'spark', 0.22),
      ember(76, 60, 0.75, 14, 'signal', 0.28),
    ],
  },
  {
    title: 'Everything Else',
    tone: 'signal',
    body: 'Your on-call creative copilot. Whether you need a sounding board, a problem-solver, or a professional Googler with great taste, I’m here to help you figure out what’s next, whatever that looks like.',
    offers: ['Sounding board', 'Problem-solving', 'What’s next'],
    embers: [
      ember(16, 16, 1, -8, 'signal', 0.02),
      ember(48, 8, 1.65, 6, 'spark', 0.1),
      ember(78, 26, 0.7, 18, 'mist', 0.16),
      ember(18, 58, 1.25, -12, 'spark', 0.22),
      ember(58, 52, 1, 8, 'signal', 0.28),
    ],
  },
]

export function Services() {
  const [active, setActive] = useState(0)
  const fuseRef = useRef<HTMLOListElement>(null)
  const burn = services.length > 1 ? active / (services.length - 1) : 0

  useEffect(() => {
    const rail = fuseRef.current
    if (!rail) return

    const centerActive = () => {
      const button = rail.querySelectorAll<HTMLButtonElement>('button')[active]
      if (!button || rail.scrollWidth <= rail.clientWidth + 4) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const left = button.offsetLeft - rail.clientWidth / 2 + button.clientWidth / 2
      rail.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' })
    }

    centerActive()
    const observer = new ResizeObserver(centerActive)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [active])

  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    const last = services.length - 1
    let next: number | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = active === last ? 0 : active + 1
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = active === 0 ? last : active - 1
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = last
    }
    if (next == null || next === active) return
    event.preventDefault()
    setActive(next)
    fuseRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  return (
    <section className="services" id="services">
      <div className="services-head" data-rise>
        <p className="eyebrow">
          <SparkMark className="eyebrow-spark" />
          The burn · What I do
        </p>
        <h2>Small business services: from first spark to full launch.</h2>
        <p className="services-lede">
          Strategy, brand identity, custom websites, social media, campaigns,
          and merch. Each one is built around what your business actually
          needs.
        </p>
      </div>

      <div className="services-board" data-rise>
        <ol
          ref={fuseRef}
          className="service-fuse"
          aria-label="Services"
          onKeyDown={onKeyDown}
        >
          <li className="service-fuse-line-item" aria-hidden="true" role="presentation">
            <span className="service-fuse-line" style={{ '--burn': String(burn) } as CSSProperties}>
              <span className="service-fuse-burn" />
            </span>
          </li>
          {services.map((service, index) => {
            const selected = index === active
            return (
              <li key={service.title}>
                <button
                  type="button"
                  className={`service-fuse-btn${selected ? ' is-active' : ''}${index < active ? ' is-lit' : ''}`}
                  aria-pressed={selected}
                  aria-controls={`service-panel-${index}`}
                  data-magnetic
                  onClick={() => setActive(index)}
                >
                  <span className="service-node" aria-hidden="true">
                    <SparkMark className="service-node-spark" />
                  </span>
                  <span className="service-fuse-title">{service.title}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="service-stage" data-tone={services[active]?.tone}>
          {services.map((service, index) => {
            const selected = index === active
            return (
              <article
                key={service.title}
                id={`service-panel-${index}`}
                className={`service-panel${selected ? ' is-active' : ''}`}
                aria-hidden={selected ? undefined : true}
                inert={selected ? undefined : true}
              >
                <div className="service-embers" aria-hidden="true">
                  {service.embers.map((spark, sparkIndex) => (
                    <SparkMark
                      key={sparkIndex}
                      className={`service-ember service-ember--${spark.tone}`}
                      style={
                        {
                          '--x': spark.x,
                          '--y': spark.y,
                          '--size': String(spark.size),
                          '--rotate': spark.rotate,
                          '--delay': spark.delay,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
                <p className="service-kicker">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className="service-kicker-total">
                    / {String(services.length).padStart(2, '0')}
                  </span>
                </p>
                <h3>{service.title}</h3>
                <p className="service-body">{service.body}</p>
                <ul className="service-offers">
                  {service.offers.map((offer, offerIndex) => (
                    <li key={offer} style={{ '--i': offerIndex } as CSSProperties}>
                      {offer}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
