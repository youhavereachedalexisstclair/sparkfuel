import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import alexis from './assets/brand/alexis-cutout.png'
import wordmark from './assets/brand/wordmark.svg'
import { ChapterWipe } from './components/ChapterWipe'
import { Constellation } from './components/Constellation'
import { FuelPour } from './components/FuelPour'
import { MagneticCursor } from './components/MagneticCursor'
import { OrbitSparks } from './components/OrbitSparks'
import { ScrollStreaks } from './components/ScrollStreaks'
import { ServiceIgnition } from './components/ServiceIgnition'
import { SparkField } from './components/SparkField'
import { SparkMark } from './components/SparkMark'
import { WordmarkReveal } from './components/WordmarkReveal'
import { useChapterPulse } from './hooks/useChapterPulse'
import { useMagnetic } from './hooks/useMagnetic'
import { useMotionPointer } from './hooks/useMotionPointer'
import { useParallax } from './hooks/useParallax'
import { useScrollIgnition } from './hooks/useScrollIgnition'
import { useScrollStreaks } from './hooks/useScrollStreaks'
import './App.css'

const services = [
  {
    title: 'Strategy & Insights',
    body: 'Turn your idea into a real business. I’ll help you brainstorm, research the market and competitors, set up your LLC and financial accounts, and protect your name with trademarks.',
  },
  {
    title: 'Smart Tools & Systems',
    body: 'Get your operations running smoothly behind the scenes. I’ll set up Google Workspace, secure your domain, and implement tech integrations, automations, and AI tools that make your workday flow.',
  },
  {
    title: 'Visual Brand Identity',
    body: 'Design a brand that connects, stands out, and feels like you. I’ll craft your logo, color palette, typography, and brand guide — plus help refine your photo direction and tone of voice.',
  },
  {
    title: 'Custom Websites',
    body: 'Build a site that looks good and works hard for you. Each one is custom-designed, mobile-friendly, and equipped with SEO tools to help you show up where it matters.',
  },
  {
    title: 'Social Media',
    body: 'Get your platforms looking sharp and running with purpose. I can set up or refresh your accounts, align them with your brand and goals, and create content calendars that make posting easy.',
  },
  {
    title: 'Campaigns & Content',
    body: 'Spread the word. I plan, design, and launch campaigns across social, email, and ads — helping you show up consistently and connect with your audience.',
  },
  {
    title: 'Branded Merch & Materials',
    body: 'Bring your brand to life in the real world. From business cards and stickers to packaging and apparel, I’ll design merch and materials that look polished, intentional, and unmistakably yours.',
  },
  {
    title: 'Everything Else',
    body: 'Your on-call creative copilot. Whether you need a sounding board, a problem-solver, or a professional Googler with great taste, I’m here to help you figure out what’s next — whatever that looks like.',
  },
]

function MagneticLink({
  className,
  href,
  children,
  strength = 12,
}: {
  className?: string
  href: string
  children: ReactNode
  strength?: number
}) {
  const ref = useMagnetic({ strength })
  return (
    <a ref={ref} className={className} href={href} data-magnetic>
      {children}
    </a>
  )
}

function App() {
  const scrollY = useParallax()
  const pointer = useMotionPointer(0.28)
  const { ignition, fuel, finale } = useScrollIgnition()
  const { pulse, active } = useChapterPulse()
  const streaks = useScrollStreaks()
  const [openService, setOpenService] = useState<number | null>(0)
  const [ready, setReady] = useState(false)
  const navCtaRef = useMagnetic({ strength: 10, radius: 100 })
  const heroPrimaryRef = useMagnetic({ strength: 14, radius: 130 })
  const heroGhostRef = useMagnetic({ strength: 12, radius: 120 })
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 40)
    return () => window.clearTimeout(id)
  }, [])

  const heroProgress = Math.min(scrollY / 700, 1)
  const aboutShift = scrollY * 0.08
  const contactShift = scrollY * 0.05
  const tiltX = pointer.y * -10
  const tiltY = pointer.x * 12

  return (
    <div
      className={`site ${ready ? 'is-ready' : ''} chapter-${active}`}
      style={
        {
          '--pointer-x': String(pointer.x),
          '--pointer-y': String(pointer.y),
          '--ignition': String(ignition),
          '--fuel': String(fuel),
          '--finale': String(finale),
          '--tilt-x': `${tiltX}deg`,
          '--tilt-y': `${tiltY}deg`,
        } as CSSProperties
      }
    >
      <MagneticCursor />

      <div className="atmosphere" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="glow glow-c" />
        <div className="glow glow-ignite" />
        <div className="pointer-bloom" />
        <ChapterWipe pulse={pulse} />
        <div className="star-veil star-veil--base" />
        <div className="star-veil star-veil--dense" />
        <div className="star-veil star-veil--finale" />
        <Constellation />
        <SparkField depth="dust" />
        <SparkField depth="far" />
        <SparkField depth="mid" />
        <SparkField depth="near" />
        <ScrollStreaks streaks={streaks} />
        <ServiceIgnition index={openService} active={active === 'burn'} />
      </div>

      <header className="topbar">
        <a className="topbar-brand" href="#top" aria-label="Spark Fuel home" data-magnetic>
          <SparkMark className="topbar-spark" />
          <span>Spark Fuel</span>
        </a>
        <nav className="topbar-nav" aria-label="Primary">
          <a href="#about" data-magnetic>
            About
          </a>
          <a href="#services" data-magnetic>
            Services
          </a>
          <a ref={navCtaRef} href="#contact" className="nav-cta" data-magnetic>
            Let’s talk
          </a>
        </nav>
      </header>

      <main>
        <section
          className="hero"
          id="top"
          style={
            {
              '--parallax-mid': `${scrollY * -0.28}px`,
              '--parallax-fade': String(1 - heroProgress * 0.35),
            } as CSSProperties
          }
        >
          <div className="hero-stage">
            <p className="chapter-tag chapter-tag--hero">The spark</p>
            <WordmarkReveal src={wordmark} alt="Spark Fuel" className="hero-logo" />
            <h1 className="hero-headline">
              Your small business
              <span> copilot.</span>
            </h1>
            <p className="hero-lede">
              Research, brand design, websites, and strategy to get your idea
              off the ground — or give your small business a whole new look.
            </p>
            <div className="hero-actions">
              <a
                ref={heroPrimaryRef}
                className="btn btn-spark"
                href="#contact"
                data-magnetic
              >
                Start a project
              </a>
              <a
                ref={heroGhostRef}
                className="btn btn-ghost"
                href="#services"
                data-magnetic
              >
                See how I help
              </a>
            </div>
          </div>
        </section>

        <section
          className="about"
          id="about"
          style={
            {
              '--about-parallax': `${aboutShift}px`,
              '--about-parallax-opp': `${-aboutShift * 0.65}px`,
            } as CSSProperties
          }
        >
          <div className="about-layout">
            <div className="about-portrait">
              <div className="portrait-halo" aria-hidden="true" />
              <FuelPour layer="behind" />
              <div className="portrait-frame">
                <div className="portrait-tilt">
                  <img src={alexis} alt="Alexis, founder of Spark Fuel" />
                </div>
              </div>
              <FuelPour layer="front" />
              <div className="fuel-orbit" aria-hidden="true">
                <SparkMark className="fuel-spark fuel-spark--meet" />
              </div>
              <div className="portrait-ground" aria-hidden="true" />
              <SparkMark className="about-spark about-spark-a" />
              <SparkMark className="about-spark about-spark-b" />
            </div>
            <div className="about-copy">
              <p className="eyebrow">
                <SparkMark className="eyebrow-spark" />
                The fuel · Hi, I’m Alexis
              </p>
              <h2>
                Your idea is the spark. I’m the fuel that helps it catch.
              </h2>
              <p>
                I started Spark Fuel to fill the gaps for small business
                founders — so you can move forward without doing branding,
                websites, and strategy all alone. Research, design, systems,
                and a creative copilot who makes the whole thing feel like you.
              </p>
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="services-head">
            <p className="eyebrow">
              <SparkMark className="eyebrow-spark" />
              The burn · What I do
            </p>
            <h2>Small business services — from first spark to full launch.</h2>
            <p className="services-lede">
              Strategy, brand identity, custom websites, social media, campaigns,
              and merch — built around what your business actually needs.
            </p>
          </div>
          <ul className="service-list">
            {services.map((service, index) => {
              const open = openService === index
              const panelId = `service-panel-${index}`
              return (
                <li key={service.title} className={open ? 'is-open' : ''}>
                  <h3 className="service-heading">
                    <ServiceTrigger
                      open={open}
                      panelId={panelId}
                      index={index}
                      title={service.title}
                      onToggle={() => setOpenService(open ? null : index)}
                    />
                  </h3>
                  <div className="service-panel" id={panelId} role="region">
                    <div className="service-panel-inner">
                      <p>{service.body}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section
          className="contact"
          id="contact"
          style={
            {
              '--contact-parallax': `${contactShift}px`,
            } as CSSProperties
          }
        >
          <div className="contact-bloom" aria-hidden="true" />
          <div className="contact-inner">
            <SparkMark className="contact-spark" title="Spark" />
            <p className="eyebrow">
              <SparkMark className="eyebrow-spark" />
              Ignition
            </p>
            <h2>Got a small business idea that needs fuel?</h2>
            <p>
              Tell me what you’re building — branding, a website, strategy, or
              all of it. We’ll figure out the gaps and make something amazing
              together.
            </p>
            <div className="contact-cta-wrap">
              <OrbitSparks />
              <a
                className="btn btn-spark btn-lg"
                href="mailto:hello@sparkfuel.co"
                data-magnetic
              >
                hello@sparkfuel.co
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Spark Fuel</p>
        <p>
          <MagneticLink href="https://sparkfuel.co/" strength={8}>
            sparkfuel.co
          </MagneticLink>
        </p>
      </footer>
    </div>
  )
}

function ServiceTrigger({
  open,
  panelId,
  index,
  title,
  onToggle,
}: {
  open: boolean
  panelId: string
  index: number
  title: string
  onToggle: () => void
}) {
  const ref = useMagnetic({ strength: 8, radius: 100 })
  return (
    <button
      ref={ref}
      type="button"
      className="service-trigger"
      aria-expanded={open}
      aria-controls={panelId}
      data-magnetic
      onClick={onToggle}
    >
      <span className="service-index">
        <SparkMark className="service-spark" />
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="service-title">{title}</span>
      <span className="service-toggle" aria-hidden="true">
        {open ? '−' : '+'}
      </span>
    </button>
  )
}

export default App
