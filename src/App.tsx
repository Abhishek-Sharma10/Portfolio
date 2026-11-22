import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BirdFlock } from './components/BirdFlock'
import { Preloader } from './components/Preloader'
import { ProjectGallery } from './components/ProjectGallery'
import { capabilities, repositories } from './data'
import mascotFull from './assets/mascot-full.webp'
import { Buddy } from './components/Buddy'
import { PixelField } from './components/PixelField'

gsap.registerPlugin(ScrollTrigger)

const links = [['Work', '#work'], ['About', '#about'], ['Skills', '#capabilities'], ['Journey', '#journey'], ['Contact', '#contact']]

function Arrow() { return <span aria-hidden="true">↗</span> }

export default function App() {
  const [menu, setMenu] = useState(false)
  const [buddy, setBuddy] = useState(true)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => { lenis.raf(time * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]')
    reveals.forEach((element) => gsap.fromTo(element, { y: 55, opacity: 0 }, {
      y: 0, opacity: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 86%' },
    }))
    gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
      const words = (el.textContent || '').split(' ')
      el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ')
      gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.12 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true } })
    })
    const magnets = Array.from(document.querySelectorAll<HTMLElement>('.button, .socials a'))
    const offs = magnets.map((m) => {
      const mv = (e: PointerEvent) => { const r = m.getBoundingClientRect(); gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.35 }) }
      const lv = () => gsap.to(m, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.4)' })
      m.addEventListener('pointermove', mv); m.addEventListener('pointerleave', lv)
      return () => { m.removeEventListener('pointermove', mv); m.removeEventListener('pointerleave', lv) }
    })
    return () => { offs.forEach((f) => f()); lenis.destroy(); gsap.ticker.remove(tick); ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <>
      <Preloader />
      <Buddy follow={buddy} />
      <header className="nav">
        <a href="#home" className="monogram" aria-label="Home"><span>AKS</span><i /></a>
        <nav className={menu ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenu(false)}>{label}</a>)}
          <button type="button" className="buddy-toggle" aria-pressed={buddy} onClick={() => setBuddy(!buddy)}>Buddy {buddy ? 'on' : 'off'}</button>
        </nav>
        <a className="nav-availability" href="#contact"><i /> AVAILABLE TO COLLABORATE</a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu"><span /><span /></button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-noise" />
          <BirdFlock variant="light" />
          <PixelField />
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-copy">
            <p className="hero-label">SOFTWARE ENGINEER · AI BUILDER · INDIA</p>
            <h1><span>I BUILD DIGITAL</span><span>EXPERIENCES THAT</span><span className="accent-line">MOVE <em>IDEAS.</em></span></h1>
            <p className="hero-description">I turn complex ideas into practical digital products through engineering, creativity and curiosity.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <Arrow /></a>
              <a className="button button-ghost" href="https://github.com/Abhishek-Sharma10" target="_blank" rel="noreferrer">GitHub profile <Arrow /></a>
            </div>
          </div>
          <div className="character-wrap">
            <div className="character-glow" />
            <div className="character-ring"><span>HELLO · I’M MOCHI · MOVE YOUR MOUSE · </span></div>
            <div id="mascot-slot" />
            <span className="character-caption">MEET MOCHI<br />YOUR PIXEL BUDDY</span>
          </div>
          <div className="hero-foot"><span>B.TECH · COMPUTER SCIENCE</span><span>SCROLL TO EXPLORE ↓</span><span>QUANTUM UNIVERSITY</span></div>
        </section>

        <section className="statement" data-say="Curiosity first. Code second.">
          <BirdFlock />
          <div className="section-index">01 / INTRODUCTION</div>
          <div className="statement-copy" data-reveal>
            <h2>Curiosity turns<br />into <em>creation.</em></h2>
            <div>
              <span className="large-arrow">↘</span>
              <p data-words>I enjoy understanding how complex systems work, breaking problems into smaller pieces and building software that makes a difference.</p>
            </div>
          </div>
          <div className="statement-rule"><span>THINK</span><span>DESIGN</span><span>BUILD</span><span>ITERATE</span></div>
        </section>

        <div className="marquee" aria-hidden="true"><div>{Array.from({ length: 2 }, (_, k) => <span key={k}>BACKEND ✦ AI AGENTS ✦ REAL-TIME SYSTEMS ✦ OPEN SOURCE ✦ JAVA ✦ REACT ✦ </span>)}</div></div>
        <ProjectGallery />

        <section className="about" id="about" data-say="That’s the human behind the pixels.">
          <div className="about-copy">
            <p className="eyebrow">03 / ABOUT</p>
            <h2 data-reveal>Building with<br /><em>intent.</em></h2>
            <p className="about-lead" data-words>Hi, I’m Abhishek Kumar Sharma — a Computer Science student and software developer interested in building practical applications, backend systems, AI-powered tools and open-source software.</p>
            <p data-reveal>I enjoy learning how systems work, experimenting with new technologies and transforming ideas into real projects. My current focus is the intersection of scalable backends, real-time systems and agentic AI.</p>
          </div>
          <div className="about-visual">
            <div className="portrait-card">
              <img src={mascotFull} alt="Mochi, a fluffy cream mascot" />
              <span>MOCHI / BUDDY</span>
            </div>
            <div className="education-card" data-reveal><span>EDUCATION</span><b>B.Tech — Computer Science Engineering</b><p>Quantum University</p></div>
            <div className="focus-ring">BACKEND · SYSTEMS · AI · OPEN SOURCE ·</div>
          </div>
        </section>

        <section className="capabilities" id="capabilities" data-say="So many tools, one toolbox.">
          <div className="cap-heading"><p className="eyebrow">04 / CAPABILITIES</p><h2 data-reveal>A growing toolkit for<br /><em>thoughtful engineering.</em></h2></div>
          <div className="cap-list">
            {capabilities.map(([no, title, items]) => (
              <div className="cap-row" key={no} data-reveal>
                <span>{no}</span><h3>{title}</h3><div>{items.map((item) => <i key={item}>{item}</i>)}</div><b>↗</b>
              </div>
            ))}
          </div>
        </section>

        <section className="journey" id="journey" data-say="Learning in public ✨">
          <div className="journey-head"><p className="eyebrow">05 / THE JOURNEY</p><h2 data-reveal>Learning in public.<br />Building in <em>motion.</em></h2></div>
          <div className="timeline">
            <div className="timeline-line" />
            {[
              ['FOUNDATION', 'Computer Science Engineering', 'Quantum University', 'Formal study in computing alongside independent software building.'],
              ['INDEPENDENT', 'Full-stack systems', 'Project Management · BhuStack', 'Moving from interface work into APIs, databases, real-time collaboration and spatial systems.'],
              ['OPEN SOURCE', 'Reading systems at scale', 'Rocket.Chat · EmbeddedChat · iD', 'Public forks and code exploration used to study mature open-source architecture.'],
              ['NOW', 'Backend & agentic AI', 'Java · System Design · AI Agents', 'Deepening production-oriented backend skills while evolving a payment-integrity prototype into a multi-agent system.'],
            ].map(([date, title, meta, body], i) => (
              <article className="milestone" key={title} data-reveal><span className="timeline-dot">{String(i + 1).padStart(2, '0')}</span><time>{date}</time><div><h3>{title}</h3><b>{meta}</b><p>{body}</p></div></article>
            ))}
          </div>
        </section>

        <section className="open-source" id="open-source" data-say="Forks are labelled honestly!">
          <div className="repo-head"><p className="eyebrow">06 / PUBLIC REPOSITORY ARCHIVE</p><h2 data-reveal>Code, experiments<br />& <em>exploration.</em></h2><p>All 16 public repositories shown as listed on GitHub. Forks are labelled as forks, not claimed contributions.</p></div>
          <div className="repo-list">
            <div className="repo-labels"><span>REPOSITORY</span><span>TYPE</span><span>LANGUAGE</span><span>LINK</span></div>
            {repositories.map(([name, desc, lang, href], i) => (
              <a className="repo-row" href={href} target="_blank" rel="noreferrer" key={name}>
                <span><i>{String(i + 1).padStart(2, '0')}</i>{name}</span><span>{desc}</span><span>{lang}</span><b>↗</b>
              </a>
            ))}
          </div>
        </section>

        <section className="philosophy">
          <BirdFlock variant="light" />
          <p className="eyebrow">07 / ENGINEERING PHILOSOPHY</p>
          <h2 data-reveal>Good software is<br /><em>thoughtful engineering.</em></h2>
          <div className="principles">
            {[
              ['01', 'Think before building.', 'Understand the problem and design a suitable solution.'],
              ['02', 'Build for reliability.', 'Write understandable, testable and maintainable software.'],
              ['03', 'Keep exploring.', 'Learn continuously, experiment and improve through iteration.'],
            ].map(([n, title, body]) => <article key={n} data-reveal><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </section>

        <section className="contact" id="contact" data-say="Say hi! Abhishek replies fast.">
          <BirdFlock variant="light" />
          <PixelField color="46,157,145" />
          <div className="contact-top"><p>08 / LET’S CONNECT</p><span>INDIA · OPEN TO OPPORTUNITIES</span></div>
          <h2 data-reveal>LET’S BUILD<br />SOMETHING<br /><em>MEANINGFUL.</em></h2>
          <div className="contact-bottom">
            <p>Have an interesting idea, project or opportunity?<br />Let’s connect.</p>
            <div className="socials">
              <a href="https://github.com/Abhishek-Sharma10" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href="https://www.linkedin.com/in/abhishek-sharma10" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              <a href="https://leetcode.com/u/kumarsharmaabhishek74/" target="_blank" rel="noreferrer">LeetCode <Arrow /></a>
            </div>
          </div>
          <div className="footer-word">AKS</div>
          <footer><a href="#home" className="monogram"><span>AKS</span><i /></a><span>ABHISHEK KUMAR SHARMA © {new Date().getFullYear()}</span><a href="#home">BACK TO TOP ↑</a></footer>
        </section>
      </main>
    </>
  )
}
