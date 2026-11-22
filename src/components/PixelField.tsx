import { useEffect, useRef } from 'react'

// Pixel/dither grid that lights up and fades behind the cursor.
export function PixelField({ color = '232,195,111' }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext('2d')!
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const CELL = 14
    let cols = 0, rows = 0, cells = new Float32Array(0), raf = 0, on = true
    const base = (x: number, y: number) => ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1 + 1) % 1
    const resize = () => {
      c.width = c.clientWidth; c.height = c.clientHeight
      cols = Math.ceil(c.width / CELL); rows = Math.ceil(c.height / CELL); cells = new Float32Array(cols * rows)
    }
    const move = (e: PointerEvent) => {
      const b = c.getBoundingClientRect()
      const gx = Math.floor((e.clientX - b.left) / CELL), gy = Math.floor((e.clientY - b.top) / CELL)
      for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {
        const X = gx + x, Y = gy + y
        if (X < 0 || Y < 0 || X >= cols || Y >= rows) continue
        const d = Math.hypot(x, y)
        if (d < 4.2 && Math.random() > d / 5) cells[Y * cols + X] = 1
      }
    }
    const tick = () => {
      if (!on) return
      ctx.clearRect(0, 0, c.width, c.height)
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const i = y * cols + x, v = cells[i]
        const a = v * 0.55 + (base(x, y) > 0.965 ? 0.07 : 0)
        if (a > 0.015) { ctx.fillStyle = `rgba(${color},${a})`; ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2) }
        cells[i] = v > 0.01 ? v * 0.93 : 0
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) raf = requestAnimationFrame(tick); else cancelAnimationFrame(raf) })
    resize(); io.observe(c); addEventListener('resize', resize); addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', resize); removeEventListener('pointermove', move) }
  }, [color])
  return <canvas ref={ref} className="pixel-canvas" aria-hidden="true" />
}
