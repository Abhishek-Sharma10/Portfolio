import { useEffect, useRef } from 'react'

type Bird = { x: number; y: number; vx: number; vy: number; phase: number; size: number }

export function BirdFlock({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = matchMedia('(max-width: 700px)').matches
    const count = reduced ? 18 : mobile ? 48 : 120
    let width = 0
    let height = 0
    let raf = 0
    let active = true
    const pointer = { x: -9999, y: -9999 }
    const birds: Bird[] = Array.from({ length: count }, (_, i) => ({
      x: 50 + Math.random() * 120,
      y: 42 + Math.random() * 90,
      vx: 0.4 + Math.random() * 1.2,
      vy: (Math.random() - 0.5) * 0.8,
      phase: Math.random() * Math.PI * 2,
      size: 0.65 + Math.random() * 1.1,
    }))

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const onPointer = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = event.clientX - r.left
      pointer.y = event.clientY - r.top
    }
    const leave = () => (pointer.x = -9999)

    function tick(t: number) {
      if (!active || !ctx) return
      ctx.clearRect(0, 0, width, height)
      const radius = mobile ? 62 : 88
      birds.forEach((b, i) => {
        let alignX = 0, alignY = 0, centerX = 0, centerY = 0, separateX = 0, separateY = 0, neighbours = 0
        for (let j = 0; j < birds.length; j++) {
          if (i === j) continue
          const o = birds[j]
          const dx = o.x - b.x, dy = o.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < radius * radius) {
            neighbours++
            alignX += o.vx; alignY += o.vy; centerX += o.x; centerY += o.y
            if (d2 < 500 && d2 > 0) { separateX -= dx / d2; separateY -= dy / d2 }
          }
        }
        if (neighbours) {
          alignX = alignX / neighbours - b.vx; alignY = alignY / neighbours - b.vy
          centerX = centerX / neighbours - b.x; centerY = centerY / neighbours - b.y
          b.vx += alignX * 0.018 + centerX * 0.0004 + separateX * 0.45
          b.vy += alignY * 0.018 + centerY * 0.0004 + separateY * 0.45
        }
        const pdx = b.x - pointer.x, pdy = b.y - pointer.y
        const pd = pdx * pdx + pdy * pdy
        if (pd < 12000 && pd > 0) {
          b.vx += (pdx / Math.sqrt(pd)) * 0.12
          b.vy += (pdy / Math.sqrt(pd)) * 0.12
        }
        b.vx += Math.sin(t * 0.00035 + i * 0.17) * 0.004
        b.vy += Math.cos(t * 0.00042 + i * 0.11) * 0.003
        const speed = Math.hypot(b.vx, b.vy)
        const max = 1.8
        if (speed > max) { b.vx = (b.vx / speed) * max; b.vy = (b.vy / speed) * max }
        b.x += b.vx; b.y += b.vy
        if (b.x > width + 30) b.x = -30
        if (b.x < -35) b.x = width + 30
        if (b.y > height + 30) b.y = -20
        if (b.y < -30) b.y = height + 20
        const angle = Math.atan2(b.vy, b.vx)
        const wing = 2.2 + Math.sin(t * 0.014 + b.phase) * 1.8
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(angle)
        ctx.scale(b.size, b.size)
        ctx.strokeStyle = variant === 'dark' ? 'rgba(21,47,60,.76)' : 'rgba(245,241,232,.62)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(-5, wing)
        ctx.quadraticCurveTo(-1, -wing, 0, 0)
        ctx.quadraticCurveTo(2, -wing, 6, wing * .65)
        ctx.stroke()
        ctx.restore()
      })
      raf = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active) raf = requestAnimationFrame(tick)
      else cancelAnimationFrame(raf)
    })
    resize()
    observer.observe(canvas)
    addEventListener('resize', resize)
    canvas.addEventListener('pointermove', onPointer)
    canvas.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      active = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', leave)
    }
  }, [variant])

  return <canvas ref={canvasRef} className="bird-canvas" aria-hidden="true" />
}
