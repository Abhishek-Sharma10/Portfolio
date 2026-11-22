import { useEffect, useState } from 'react'

export function Preloader() {
  const [done, setDone] = useState(false)
  const [n, setN] = useState(0)
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const total = reduced ? 150 : 1900
    const t0 = performance.now()
    let raf = 0
    const count = (t: number) => { const p = Math.min((t - t0) / (total - 300), 1); setN(Math.round(p * 100)); if (p < 1) raf = requestAnimationFrame(count) }
    raf = requestAnimationFrame(count)
    const timer = window.setTimeout(() => setDone(true), total)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className={`preloader ${done ? 'preloader--done' : ''}`} aria-hidden={done}>
      <div className="preloader-atmosphere" />
      <div className="preloader-pixels">{Array.from({ length: 60 }, (_, i) => <i key={i} style={{ '--d': `${(i * 37) % 900}ms` } as React.CSSProperties} />)}</div>
      <div className="preloader-mark"><span>A</span><span>K</span><span>S</span></div>
      <div className="preloader-copy">
        <p>Real ideas deserve<br />thoughtful engineering.</p>
        <div className="loading-line"><i /></div>
        <div className="loading-meta"><span>LOADING EXPERIENCE</span><span>{String(n).padStart(3, '0')}</span></div>
      </div>
      <div className="shutters">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
    </div>
  )
}
