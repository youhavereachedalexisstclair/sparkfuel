import { useEffect, useState, type ReactNode } from 'react'
import alexis from './assets/brand/alexis-cutout.png'
import wordmark from './assets/brand/wordmark.svg'
import { ChapterWipe } from './components/ChapterWipe'
import { Constellation } from './components/Constellation'
import { FuelPour } from './components/FuelPour'
import { MagneticCursor } from './components/MagneticCursor'
import { OrbitSparks } from './components/OrbitSparks'
import { ScrollStreaks } from './components/ScrollStreaks'
import { SparkField } from './components/SparkField'
import { Services } from './components/Services'
import { SparkMark } from './components/SparkMark'
import { WordmarkReveal } from './components/WordmarkReveal'
import { useChapterPulse } from './hooks/useChapterPulse'
import { useRoute } from './hooks/useRoute'
import { ContactPage } from './pages/ContactPage'
import { WorkPage } from './pages/WorkPage'
import { useMagnetic } from './hooks/useMagnetic'
import { useMobileMoments } from './hooks/useMobileMoments'
import { usePointerEngine } from './hooks/usePointerEngine'
import { useScrollScene } from './hooks/useScrollScene'
import { useScrollStreaks } from './hooks/useScrollStreaks'
import './App.css'

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
  const { path, go } = useRoute()
  const isWork = path === '/work' || path === '/work-v2'
  const isContact = path === '/contact'
  useScrollScene(!isWork && !isContact)
  const mobileSparkRef = useMobileMoments(path)
  usePointerEngine()
  const { pulse, active } = useChapterPulse()
  const streaks = useScrollStreaks()
  const [ready, setReady] = useState(false)
  const navCtaRef = useMagnetic({ strength: 10, radius: 100 })
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 40)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    document.title = isWork
      ? 'Work | Spark Fuel'
      : isContact
        ? 'Contact | Spark Fuel'
        : 'Spark Fuel | Small Business Research, Design & Strategy'
  }, [isWork, isContact])

  return (
    <div
      className={`site ${ready ? 'is-ready' : ''} chapter-${active}${isWork ? ' site--work' : ''}${isContact ? ' site--contact' : ''}`}
    >
      <div ref={mobileSparkRef} className="mobile-scroll-spark" aria-hidden="true" />

      <MagneticCursor />

      <div className="atmosphere" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="glow glow-c" />
        <div className="glow glow-ignite" />
        <div className="pointer-bloom" />
        {isWork ? null : <ChapterWipe pulse={pulse} />}
        <div className="star-veil star-veil--base" />
        <div className="star-veil star-veil--dense" />
        <div className="star-veil star-veil--finale" />
        <Constellation />
        <SparkField depth="dust" />
        <SparkField depth="far" />
        <SparkField depth="mid" />
        <SparkField depth="near" />
        <ScrollStreaks streaks={streaks} />
      </div>

      <header className="topbar">
        <a className="topbar-brand" href="/" aria-label="Spark Fuel home" data-magnetic onClick={go('/')}>
          <SparkMark className="topbar-spark" />
          <span>Spark Fuel</span>
        </a>
        <nav className="topbar-nav" aria-label="Primary">
          <a href="/#about" data-magnetic onClick={go('/#about')}>
            About
          </a>
          <a href="/#services" data-magnetic onClick={go('/#services')}>
            Services
          </a>
          <a
            href="/work"
            className={`nav-work${isWork ? ' is-current' : ''}`}
            aria-current={isWork ? 'page' : undefined}
            data-magnetic
            onClick={go('/work')}
          >
            Work
          </a>
          <a
            ref={navCtaRef}
            href="/contact"
            className={`nav-cta${isContact ? ' is-current' : ''}`}
            aria-current={isContact ? 'page' : undefined}
            data-magnetic
            onClick={go('/contact')}
          >
            Let’s talk
          </a>
        </nav>
      </header>

      {isWork ? (
        <WorkPage />
      ) : isContact ? (
        <ContactPage />
      ) : (
        <main>
        <section className="hero" id="top">
          <div className="hero-stage">
            <WordmarkReveal src={wordmark} alt="Spark Fuel" className="hero-logo" />
            <h1 className="hero-headline">
              Your small business
              <span> copilot.</span>
            </h1>
            <p className="hero-lede">
              Research, brand design, websites, and strategy to get your idea
              off the ground, or give your small business a whole new look.
            </p>
            <div className="hero-actions">
              <div className="hero-cta-wrap">
                <OrbitSparks />
                <a className="btn btn-spark btn-lg" href="/contact" data-magnetic onClick={go('/contact')}>
                  Start a project
                </a>
              </div>
              <div className="hero-cta-wrap">
                <OrbitSparks />
                <a className="btn btn-ghost btn-lg" href="#services" data-magnetic>
                  See how I help
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-layout" data-rise>
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
                founders. You can move forward without doing branding,
                websites, and strategy all alone. Research, design, systems,
                and a creative copilot who makes the whole thing feel like you.
              </p>
            </div>
          </div>
        </section>

        <Services />

        <section className="contact" id="contact">
          <div className="contact-bloom" aria-hidden="true" />
          <div className="contact-inner" data-rise>
            <SparkMark className="contact-spark" title="Spark" />
            <p className="eyebrow">
              <SparkMark className="eyebrow-spark" />
              Ignition
            </p>
            <h2>Got a spark that needs fuel?</h2>
            <p>
              Tell me what you’re building: branding, a website, strategy, or
              all of it. We’ll figure out the gaps and make something amazing
              together.
            </p>
            <div className="contact-cta-wrap">
              <OrbitSparks />
              <a className="btn btn-spark btn-lg" href="/contact" data-magnetic onClick={go('/contact')}>
                Send a message
              </a>
            </div>
          </div>
        </section>
        </main>
      )}

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

export default App
