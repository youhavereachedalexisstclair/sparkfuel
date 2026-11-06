import { useEffect, useState, type CSSProperties } from 'react'
import alexis from './assets/brand/alexis-cutout.png'
import wordmark from './assets/brand/wordmark.svg'
import { SparkField } from './components/SparkField'
import { SparkMark } from './components/SparkMark'
import { useParallax } from './hooks/useParallax'
import { usePointerParallax } from './hooks/usePointerParallax'
import { useScrollIgnition } from './hooks/useScrollIgnition'
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

function App() {
  const scrollY = useParallax()
  const pointer = usePointerParallax()
  const { ignition, fuel, finale } = useScrollIgnition()
  const [openService, setOpenService] = useState<number | null>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 40)
    return () => window.clearTimeout(id)
  }, [])

  const heroProgress = Math.min(scrollY / 700, 1)

  return (
    <div
      className={`site ${ready ? 'is-ready' : ''}`}
      style={
        {
          '--pointer-x': String(pointer.x),
          '--pointer-y': String(pointer.y),
          '--ignition': String(ignition),
          '--fuel': String(fuel),
          '--finale': String(finale),
        } as CSSProperties
      }
    >
      <div className="atmosphere" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="glow glow-c" />
        <div className="glow glow-ignite" />
        <div className="star-veil" />
        <SparkField depth="far" />
        <SparkField depth="mid" />
        <SparkField depth="near" />
      </div>

      <header className="topbar">
        <a className="topbar-brand" href="#top" aria-label="Spark Fuel home">
          <SparkMark className="topbar-spark" />
          <span>Spark Fuel</span>
        </a>
        <nav className="topbar-nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact" className="nav-cta">
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
              '--parallax-slow': `${scrollY * 0.28}px`,
              '--parallax-mid': `${scrollY * -0.18}px`,
              '--parallax-fast': `${scrollY * 0.32}px`,
              '--parallax-fade': String(1 - heroProgress * 0.3),
            } as CSSProperties
          }
        >
          <div className="hero-field" aria-hidden="true">
            <div className="spark-burst">
              <SparkMark className="burst-core" />
              <div className="burst-glow" />
            </div>
          </div>

          <div className="hero-stage">
            <p className="chapter-tag chapter-tag--hero">The spark</p>
            <img className="hero-logo" src={wordmark} alt="Spark Fuel" />
            <h1 className="hero-headline">
              Your small business
              <span> copilot.</span>
            </h1>
            <p className="hero-lede">
              Research, brand design, websites, and strategy to get your idea
              off the ground — or give your small business a whole new look.
            </p>
            <div className="hero-actions">
              <a className="btn btn-spark" href="#contact">
                Start a project
              </a>
              <a className="btn btn-ghost" href="#services">
                See how I help
              </a>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-layout">
            <div className="about-portrait">
              <div className="portrait-halo" aria-hidden="true" />
              <div className="fuel-orbit" aria-hidden="true">
                <SparkMark className="fuel-spark fuel-spark--meet" />
              </div>
              <div className="portrait-frame">
                <img src={alexis} alt="Alexis, founder of Spark Fuel" />
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
                    <button
                      type="button"
                      className="service-trigger"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenService(open ? null : index)}
                    >
                      <span className="service-index">
                        <SparkMark className="service-spark" />
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="service-title">{service.title}</span>
                      <span className="service-toggle" aria-hidden="true">
                        {open ? '−' : '+'}
                      </span>
                    </button>
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

        <section className="contact" id="contact">
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
            <a className="btn btn-spark btn-lg" href="mailto:hello@sparkfuel.co">
              hello@sparkfuel.co
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Spark Fuel</p>
        <p>
          <a href="https://sparkfuel.co/">sparkfuel.co</a>
        </p>
      </footer>
    </div>
  )
}

export default App
