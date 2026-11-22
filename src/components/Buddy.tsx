import { useEffect, useRef } from 'react'
import mascot from '../assets/mascot-body.webp'
import { createMochi } from './mochi3d'

const W = 300
const H = (W * 502) / 398
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const POKES = ['Hi, I’m Mochi! 👋', 'Boop! That tickles ✨', 'Want to see the projects?', 'I live in this website.', 'Compiling… just kidding.']

export function Buddy({ follow }: { follow: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const followRef = useRef(follow)
  followRef.current = follow

  useEffect(() => {
    const el = root.current!, bub = bubble.current!
    const canvas = el.querySelector<HTMLCanvasElement>('canvas')!
    let mochi: ReturnType<typeof createMochi> | null = null
    try { mochi = createMochi(canvas, matchMedia('(max-width: 700px)').matches ? 12 : 22) } catch { el.classList.add('no-webgl') }
    let waveT = 0
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = matchMedia('(max-width: 700px)').matches

    const ptr = { x: innerWidth * 0.6, y: innerHeight * 0.5 }
    let lastMove = performance.now(), cx = -999, cy = -999, s = 1, phase = 0, jump = 0, blinkAt = 0, openUntil = 0
    let wander = { x: ptr.x, y: ptr.y, next: 0 }, sleeping = false, lastSay = 0, lastTime = performance.now(), raf = 0, hideBub = 0
    let first = true

    const say = (text: string, ms = 2600) => {
      bub.textContent = text; bub.classList.add('show')
      clearTimeout(hideBub); hideBub = window.setTimeout(() => bub.classList.remove('show'), ms)
      lastSay = performance.now()
    }
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX; ptr.y = e.clientY
      if (sleeping) { sleeping = false; say('Oh! You’re back ✨', 1800) }
      lastMove = performance.now()
    }
    const onDown = (e: PointerEvent) => {
      const hit = Math.abs(e.clientX - cx) < (W * s) / 2 && Math.abs(e.clientY - cy) < (H * s) / 2
      jump = hit ? 1 : 0.45; if (hit) waveT = 1.4
      if (hit) { openUntil = performance.now() + 900; say(POKES[Math.floor(Math.random() * POKES.length)]) }
      lastMove = performance.now(); sleeping = false
    }
    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', onDown, { passive: true })

    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const t = (en.target as HTMLElement).dataset.say
      if (en.isIntersecting && t && !sleeping && performance.now() - lastSay > 5000) say(t)
    }), { threshold: 0.55 })
    document.querySelectorAll('[data-say]').forEach((n) => io.observe(n))

    const frame = (now: number) => {
      const dt = clamp((now - lastTime) / 1000, 0.001, 0.05); lastTime = now
      const r = document.getElementById('mascot-slot')?.getBoundingClientRect()
      const inHero = !!r && r.width > 0 && r.bottom > innerHeight * 0.35 && r.top < innerHeight * 0.75
      const idle = now - lastMove
      let tx = cx, ty = cy, ts = s, vis = 1, mode = 'hero'
      if (inHero && r) {
        tx = r.left + r.width / 2 + (reduced ? 0 : clamp((ptr.x - (r.left + r.width / 2)) * 0.04, -28, 28))
        ty = r.top + r.height / 2 + (reduced ? 0 : clamp((ptr.y - (r.top + r.height / 2)) * 0.03, -20, 20))
        ts = r.width / W
      } else if (reduced || !followRef.current) { vis = 0; mode = 'hidden' }
      else {
        ts = small ? 0.42 : 0.52
        if (idle < 3500) { mode = 'follow'; tx = clamp(ptr.x + 85, 90, innerWidth - 90); ty = clamp(ptr.y + 80, 110, innerHeight - 90) }
        else if (idle < 16000) {
          mode = 'wander'
          if (now > wander.next) { wander = { x: innerWidth * (0.12 + Math.random() * 0.76), y: innerHeight * (0.3 + Math.random() * 0.5), next: now + 3500 + Math.random() * 2500 }; if (Math.random() < 0.3) say(['Exploring…', 'Nice site, right?', 'Just wandering ✨'][Math.floor(Math.random() * 3)], 1800) }
          tx = wander.x; ty = wander.y
        } else { mode = 'sleep'; if (!sleeping) { sleeping = true; say('zzz…', 3000) } }
      }
      if (first && r) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; s = ts; first = false }
      const k = 1 - Math.exp(-dt * (mode === 'hero' ? 7 : 3.6))
      const vx = (tx - cx) * k, vy = (ty - cy) * k
      cx += vx; cy += vy; s += (ts - s) * (1 - Math.exp(-dt * 5))
      const sp = Math.hypot(vx, vy) / (dt * 60)
      const walking = sp > 0.35 && mode !== 'hero'
      const amp = walking ? clamp(sp / 8, 0.25, 1) : 0
      phase += (walking ? sp * 0.09 : 0.02) * (dt * 60)
      jump = Math.max(0, jump - dt * 1.7); waveT = Math.max(0, waveT - dt)
      const hop = jump > 0 ? Math.sin(Math.PI * (1 - jump)) * 0.9 : 0
      const bobUp = Math.abs(Math.sin(phase)) * 0.22 * amp
      if (now > blinkAt) blinkAt = now + 2200 + Math.random() * 3800
      const blink = blinkAt - now < 140 && blinkAt - now > 0 ? 1 : 0
      const ex = clamp((ptr.x - cx) / (innerWidth * 0.35), -1, 1), ey = clamp((ptr.y - cy) / (innerHeight * 0.35), -1, 1)
      el.classList.toggle('sit', mode === 'hero')
      el.style.opacity = String(vis)
      el.style.transform = `translate3d(${cx - W / 2}px,${cy - H / 2}px,0) scale(${s})`
      if (vis && mochi) mochi.render({
        lookX: sleeping ? 0 : ex, lookY: sleeping ? 0 : ey, typing: mode === 'hero' ? 1 : 0, sleep: sleeping ? 1 : 0, walk: amp,
        phase, lift: bobUp + hop, lean: clamp(vx * 0.02, -0.2, 0.2) + Math.sin(phase) * 0.06 * amp,
        squash: 1 + Math.sin(now * 0.002) * 0.01 + (jump > 0 ? Math.sin(Math.PI * (1 - jump)) * 0.04 : 0),
        wave: waveT, blink, mouth: now < openUntil || jump > 0.2 ? 1 : 0, vx: vx / (dt * 60), vy: vy / (dt * 60), t: now / 1000,
      }, dt)
      if (bub.classList.contains('show')) bub.style.transform = `translate3d(${cx}px,${cy - (H * s) / 2 + 20}px,0) translateX(-50%)`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { mochi?.dispose(); cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onDown); io.disconnect(); clearTimeout(hideBub) }
  }, [])

  return (
    <>
      <div className="buddy" ref={root} aria-hidden="true">
        <canvas width={600} height={756} />
        <img className="buddy-fallback" src={mascot} alt="" draggable={false} />
      </div>
      <div className="buddy-bubble" ref={bubble} aria-hidden="true" />
    </>
  )
}
