import * as THREE from 'three'

export type MochiState = {
  lookX: number; lookY: number   // -1..1 pointer direction
  typing: number; sleep: number; walk: number // targets 0..1
  phase: number; lift: number; lean: number; squash: number
  wave: number; blink: number; mouth: number; vx: number; vy: number; t: number
}

const FUR_V = /* glsl */ `
uniform float uLen, uTime, uN; uniform vec3 uForce;
varying vec3 vN, vObj, vV; varying float vH;
void main(){
  float h = float(gl_InstanceID) / (uN - 1.0);
  vec3 n = normalize(normal);
  vec3 p = position + n * (h * uLen) + uForce * h * h * uLen * 6.0;
  p.x += sin(uTime * 1.7 + position.y * 3.0 + position.z * 2.0) * 0.010 * h * h;
  p.y += cos(uTime * 1.3 + position.x * 3.0) * 0.006 * h * h;
  vObj = position; vH = h; vN = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(p, 1.0); vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`
const FUR_F = /* glsl */ `
precision highp float;
uniform vec3 uBase, uTip, uL; uniform float uDens;
varying vec3 vN, vObj, vV; varying float vH;
float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
void main(){
  float h = vH;
  if (h > 0.001) {
    vec3 q = vObj * uDens; vec3 c = floor(q); vec3 f = fract(q) - 0.5;
    float r = hash(c), d = length(f);
    if (d > 0.56 * (1.0 - h * 0.55) || r < h * 0.72) discard;
  }
  vec3 n = normalize(vN), v = normalize(vV);
  float ndl = dot(n, uL) * 0.5 + 0.5;
  float light = 0.62 + 0.52 * ndl * ndl;
  vec3 col = mix(uBase * 0.88, uTip, smoothstep(0.0, 1.0, h)) * light;
  col += uTip * pow(1.0 - max(dot(n, v), 0.0), 2.6) * (0.20 + 0.25 * h);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

const ell = (rx: number, ry: number, rz: number, ws = 56, hs = 36) => { const g = new THREE.SphereGeometry(1, ws, hs); g.scale(rx, ry, rz); return g }
const radial = (stops: [number, string][]) => {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const x = c.getContext('2d')!, g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

export function createMochi(canvas: HTMLCanvasElement, N = 22) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(1); renderer.setSize(600, 756, false); renderer.toneMapping = THREE.NoToneMapping
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 600 / 756, 0.1, 50)

  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x6b7f86, 1.9))
  const key = new THREE.DirectionalLight(0xfff0dc, 2.6); key.position.set(-3, 5, 6); scene.add(key)
  const rimL = new THREE.DirectionalLight(0x8fe0d0, 1.4); rimL.position.set(4, 2, -4); scene.add(rimL)

  const furU = {
    uLen: { value: 0.07 }, uTime: { value: 0 }, uN: { value: N }, uForce: { value: new THREE.Vector3() },
    uBase: { value: new THREE.Color('#d9c4a3') }, uTip: { value: new THREE.Color('#f6ead6') },
    uL: { value: new THREE.Vector3(-0.45, 0.65, 0.6).normalize() }, uDens: { value: 120 },
  }
  const furMat = new THREE.ShaderMaterial({ uniforms: furU, vertexShader: FUR_V, fragmentShader: FUR_F })
  const fur = (g: THREE.BufferGeometry) => { const m = new THREE.InstancedMesh(g, furMat, N); m.frustumCulled = false; return m }

  const fig = new THREE.Group(); scene.add(fig)
  // body + head
  const body = fur(ell(1.05, 1.15, 0.92)); body.position.set(0, -0.55, 0); fig.add(body)
  const head = new THREE.Group(); head.position.set(0, 0.35, 0); fig.add(head)
  const hood = fur(ell(1.0, 0.98, 0.95)); hood.position.y = 0.5; head.add(hood)
  // face plate
  const plate = new THREE.Mesh(ell(0.7, 0.6, 0.27, 48, 32), new THREE.MeshPhysicalMaterial({ color: '#f6dcc4', roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4 }))
  plate.position.set(0, 0.5, 0.85); head.add(plate)
  const face = new THREE.Group(); face.position.copy(plate.position); head.add(face)
  const eyeMat = new THREE.MeshPhysicalMaterial({ color: '#15110f', roughness: 0.15, clearcoat: 1 })
  const hiMat = new THREE.MeshBasicMaterial({ color: '#ffffff' })
  const eyes = [-1, 1].map((sx) => {
    const g = new THREE.Group(); g.position.set(sx * 0.3, 0.1, 0.24)
    const e = new THREE.Mesh(ell(0.085, 0.1, 0.05, 24, 16), eyeMat); g.add(e)
    const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 8), hiMat); h1.position.set(0.03, 0.04, 0.04); g.add(h1)
    const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), hiMat); h2.position.set(-0.03, -0.04, 0.045); g.add(h2)
    face.add(g); return g
  })
  const smile = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.1, 0.0, 0), new THREE.Vector3(0, -0.09, 0.012), new THREE.Vector3(0.1, 0.0, 0)), 20, 0.011, 8), new THREE.MeshBasicMaterial({ color: '#1c1512' }))
  smile.position.set(0, -0.15, 0.255); face.add(smile)
  const open = new THREE.Mesh(ell(0.055, 0.07, 0.03, 16, 12), new THREE.MeshBasicMaterial({ color: '#6b2f26' })); open.position.set(0, -0.19, 0.25); face.add(open)
  const blushTex = radial([[0, 'rgba(255,140,140,.75)'], [1, 'rgba(255,140,140,0)']])
  ;[-1, 1].forEach((sx) => {
    const b = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), new THREE.MeshBasicMaterial({ map: blushTex, transparent: true, depthWrite: false }))
    b.position.set(sx * 0.46, -0.08, 0.19); b.rotation.y = sx * 0.75; face.add(b)
  })
  // headphones
  const hpMat = new THREE.MeshStandardMaterial({ color: '#a39d98', roughness: 0.55, metalness: 0.1 })
  const cupMat = new THREE.MeshStandardMaterial({ color: '#d9c8ab', roughness: 0.65 })
  const band = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.07, 14, 56, Math.PI), hpMat); band.position.y = 0.5; head.add(band)
  ;[-1, 1].forEach((sx) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 36), cupMat); cup.rotation.z = Math.PI / 2; cup.position.set(sx * 1.06, 0.45, 0.02); head.add(cup)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 32), hpMat); cap.rotation.z = Math.PI / 2; cap.position.set(sx * 1.19, 0.45, 0.02); head.add(cap)
  })
  // arms
  const armGeo = new THREE.CapsuleGeometry(0.27, 0.72, 10, 24); armGeo.translate(0, -0.63, 0)
  const arms = [-1, 1].map((sx) => { const g = new THREE.Group(); g.position.set(sx * 0.98, 0.08, 0.2); g.add(fur(armGeo)); fig.add(g); return g })
  const feet = [-1, 1].map((sx) => { const f = fur(ell(0.4, 0.2, 0.55, 32, 20)); f.position.set(sx * 0.5, -1.78, 0.35); fig.add(f); return f })

  // desk + laptop
  const desk = new THREE.Group(); fig.add(desk)
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 2.0), new THREE.MeshStandardMaterial({ color: '#f1ece4', roughness: 0.7 })); deskTop.position.set(0.05, -0.95, 1.5); desk.add(deskTop)
  const metal = new THREE.MeshStandardMaterial({ color: '#dfe2e6', roughness: 0.42, metalness: 0.3 })
  const lbase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 1.05), metal); lbase.position.set(0.1, -0.325, 1.45); desk.add(lbase)
  const kc = document.createElement('canvas'); kc.width = 256; kc.height = 170; const kx = kc.getContext('2d')!
  kx.fillStyle = '#8f9399'; kx.fillRect(0, 0, 256, 170); kx.fillStyle = '#2b2e33'
  for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) kx.fillRect(8 + c * 17.2, 10 + r * 17, 14, 13)
  kx.fillStyle = '#b3b6bb'; kx.fillRect(70, 120, 110, 40)
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.78), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(kc), roughness: 0.6 })); keys.rotation.x = -Math.PI / 2; keys.position.set(0.1, -0.298, 1.38); desk.add(keys)
  const hinge = new THREE.Group(); hinge.position.set(0.1, -0.3, 1.95); hinge.rotation.x = 0.28; desk.add(hinge)
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.045), metal); lid.position.y = 0.5; hinge.add(lid)
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), new THREE.MeshBasicMaterial({ color: '#e8c36f' })); logo.position.set(0, 0.52, 0.026); hinge.add(logo)

  // contact shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), new THREE.MeshBasicMaterial({ map: radial([[0, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.0; scene.add(shadow)

  let typ = 0, slp = 0, wlk = 0, lx = 0, ly = 0
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k
  return {
    render(s: MochiState, dt: number) {
      const k = (r: number) => 1 - Math.exp(-dt * r)
      typ += (s.typing - typ) * k(3.5); slp += (s.sleep - slp) * k(3); wlk += (s.walk - wlk) * k(8)
      lx += (s.lookX - lx) * k(9); ly += (s.lookY - ly) * k(9)
      furU.uTime.value = s.t; furU.uForce.value.set(-s.vx * 0.03, -0.03 - s.vy * 0.03 - s.lift * 0.02, 0)
      // figure
      fig.rotation.set(0, typ * 0.4 + (1 - typ) * lx * 0.3, s.lean); fig.position.y = s.lift - typ * 0.45
      fig.scale.set(1 / s.squash, s.squash, 1 / s.squash)
      head.rotation.set(ly * 0.3 + slp * 0.38 + Math.sin(s.t * 8) * 0.012 * typ, lx * 0.5 - typ * 0.15, lx * -0.06)
      head.position.y = 0.35 + Math.sin(s.t * 2) * 0.012 - slp * 0.06
      // face
      const ey = 1 - Math.min(1, s.blink * 0.92 + slp * 0.92)
      eyes.forEach((g) => { g.scale.y = ey; g.position.x += (Math.sign(g.position.x) * 0.3 + lx * 0.07 - g.position.x) * 0.6; g.position.y = 0.1 + ly * 0.05 - slp * 0.03 })
      open.visible = s.mouth > 0.2 && slp < 0.5; smile.visible = !open.visible; smile.scale.y = 1 - slp * 0.85
      // arms
      arms.forEach((a, i) => {
        const sg = i ? 1 : -1, tap = Math.sin(s.t * (i ? 17 : 13) + i * 2) * 0.07
        let rx = lerp(Math.sin(s.phase + i * Math.PI) * 0.85 * wlk, -1.2 + tap, typ), rz = lerp(sg * (0.14 + 0.05 * wlk), -sg * 0.3, typ)
        if (i && s.wave > 0) { const w = Math.min(1, s.wave * 3); rx = lerp(rx, 0, w); rz = lerp(rz, 2.5 + Math.sin(s.t * 16) * 0.28, w) }
        a.rotation.set(rx + slp * 0.1, 0, rz)
      })
      feet.forEach((f, i) => { f.visible = typ < 0.5; f.position.y = -1.78 + Math.max(0, Math.sin(s.phase + i * Math.PI)) * 0.3 * wlk })
      desk.visible = typ > 0.02; desk.scale.setScalar(Math.max(typ, 0.001))
      shadow.scale.setScalar((1 - s.lift * 0.25) * (1 - typ)); shadow.visible = typ < 0.98
      camera.position.set(typ * 0.9, 0.9 + typ * 0.2, 8.2 + typ * 0.9); camera.lookAt(0, -0.05 - typ * 0.2, 0)
      renderer.render(scene, camera)
    },
    dispose() { renderer.dispose(); furMat.dispose() },
  }
}
