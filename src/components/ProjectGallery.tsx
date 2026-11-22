import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data'

gsap.registerPlugin(ScrollTrigger)

export function ProjectGallery() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia('(max-width: 800px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const el = track.current
      if (!el) return
      gsap.to(el, {
        x: () => -(el.scrollWidth - innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${el.scrollWidth - innerWidth}`,
          pin: true,
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section className="work" id="work" ref={section}>
      <div className="work-top">
        <p className="eyebrow">02 / SELECTED WORK</p>
        <p>Scroll to explore <span>↘</span></p>
      </div>
      <div className="project-track" ref={track}>
        {projects.map((project) => (
          <article className="project" key={project.number}>
            <div className={`project-visual tone-${project.tone}`} onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--ry', `${((e.clientX - b.left) / b.width - 0.5) * 14}deg`); e.currentTarget.style.setProperty('--rx', `${-((e.clientY - b.top) / b.height - 0.5) * 12}deg`) }} onPointerLeave={(e) => { e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg') }}>
              <div className="visual-grid" />
              <span className="visual-glyph">{project.glyph}</span>
              <div className="visual-window">
                <span>{project.number}</span>
                <b>{project.title.split(' ')[0]}</b>
                <i />
              </div>
              <div className="project-shutter" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--delay': `${i * 35}ms` } as React.CSSProperties} />)}
              </div>
            </div>
            <div className="project-info">
              <div><span className="project-no">{project.number}</span><h3>{project.title}</h3></div>
              <div className="project-copy">
                <strong>{project.kicker}</strong>
                <p>{project.description}</p>
                <div className="tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="project-actions">
                  <span className="status"><i /> {project.status}</span>
                  {project.href ? <a href={project.href} target="_blank" rel="noreferrer">View repository <b>↗</b></a> : <span className="private-note">Repository not public</span>}
                </div>
              </div>
            </div>
          </article>
        ))}
        <div className="track-end"><span>06 / 06</span><h3>More experiments<br />live on GitHub.</h3><a href="#open-source">Open archive ↓</a></div>
      </div>
    </section>
  )
}
