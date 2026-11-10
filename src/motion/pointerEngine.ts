/**
 * One pointer loop for parallax, magnetic pull, and the cursor.
 * Writes compositor transforms directly so React never renders on mouse move.
 */

export type PointerSample = {
  aimX: number
  aimY: number
  hovering: boolean
  now: number
}

type Driver = (sample: PointerSample) => boolean
type MoveListener = (x: number, y: number, now: number) => void

type Magnet = {
  el: HTMLElement
  strength: number
  radius: number
  cx: number
  cy: number
  x: number
  y: number
  tx: number
  ty: number
}

type HitNode = {
  el: HTMLElement
  cx: number
  cy: number
  reach: number
}

const PARALLAX_LERP = 0.28
const MAGNET_LERP = 0.2
const CURSOR_REACH = 80

const magnets: Magnet[] = []
const drivers = new Set<Driver>()
const moveListeners = new Set<MoveListener>()

let cache: HitNode[] = []
let seen: HTMLElement[] = []
let cacheDirty = true
let loop = 0
let looping = false
let primed = false

const target = { x: 0, y: 0, nx: 0, ny: 0 }
const current = { x: 0, y: 0, nx: 0, ny: 0 }
let lastPointer = ''
let lastTilt = ''

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

let requestKick = () => {}

export function kickPointerEngine() {
  requestKick()
}

export function registerMagnet(el: HTMLElement, strength: number, radius: number) {
  const magnet: Magnet = {
    el,
    strength,
    radius,
    cx: 0,
    cy: 0,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  }
  magnets.push(magnet)
  cacheDirty = true
  return () => {
    const index = magnets.indexOf(magnet)
    if (index >= 0) magnets.splice(index, 1)
    el.style.transform = ''
    cacheDirty = true
  }
}

export function subscribePointer(driver: Driver) {
  drivers.add(driver)
  return () => drivers.delete(driver)
}

export function subscribeMove(listener: MoveListener) {
  moveListeners.add(listener)
  return () => moveListeners.delete(listener)
}

function measure(nodes: HTMLElement[]) {
  const next: HitNode[] = []

  for (const el of nodes) {
    if (el.closest('[data-cursor-ignore]')) continue
    const magnet = magnets.find((item) => item.el === el)
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    const cx = rect.left + rect.width / 2 - (magnet?.x ?? 0)
    const cy = rect.top + rect.height / 2 - (magnet?.y ?? 0)
    const reach = Math.max(CURSOR_REACH, Math.min(rect.width, rect.height) * 0.45 + 36)
    next.push({ el, cx, cy, reach })
    if (magnet) {
      magnet.cx = cx
      magnet.cy = cy
    }
  }

  cache = next
  cacheDirty = false
}

function ensureCache() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-magnetic]')
  let changed = cacheDirty || nodes.length !== seen.length
  if (!changed) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] !== seen[i]) {
        changed = true
        break
      }
    }
  }
  if (!changed) return
  seen = Array.from(nodes)
  measure(seen)
}

function writeParallax(root: HTMLElement) {
  const nx = current.nx.toFixed(4)
  const ny = current.ny.toFixed(4)
  const pointer = `${nx} ${ny}`
  if (pointer !== lastPointer) {
    lastPointer = pointer
    root.style.setProperty('--pointer-x', nx)
    root.style.setProperty('--pointer-y', ny)
  }

  const tilt = `${(current.ny * -10).toFixed(2)} ${(current.nx * 12).toFixed(2)}`
  if (tilt !== lastTilt) {
    lastTilt = tilt
    root.style.setProperty('--tilt-x', `${(current.ny * -10).toFixed(2)}deg`)
    root.style.setProperty('--tilt-y', `${(current.nx * 12).toFixed(2)}deg`)
  }
}

function stepMagnets() {
  let moving = false
  const x = target.x
  const y = target.y

  for (const magnet of magnets) {
    const dx = x - magnet.cx
    const dy = y - magnet.cy
    const dist = Math.hypot(dx, dy)
    if (dist < magnet.radius && dist > 0.5) {
      const pull = (1 - dist / magnet.radius) * magnet.strength
      magnet.tx = (dx / dist) * pull
      magnet.ty = (dy / dist) * pull
    } else {
      magnet.tx = 0
      magnet.ty = 0
    }

    magnet.x = lerp(magnet.x, magnet.tx, MAGNET_LERP)
    magnet.y = lerp(magnet.y, magnet.ty, MAGNET_LERP)

    if (Math.abs(magnet.x) < 0.08 && Math.abs(magnet.y) < 0.08 && magnet.tx === 0 && magnet.ty === 0) {
      if (magnet.x !== 0 || magnet.y !== 0) {
        magnet.x = 0
        magnet.y = 0
        magnet.el.style.transform = ''
      }
      continue
    }

    moving = true
    magnet.el.style.transform = `translate3d(${magnet.x.toFixed(2)}px, ${magnet.y.toFixed(2)}px, 0)`
  }

  return moving
}

function aimAtPointer() {
  let best: { x: number; y: number; strength: number; dist: number } | null = null
  for (const node of cache) {
    const dx = target.x - node.cx
    const dy = target.y - node.cy
    const dist = Math.hypot(dx, dy)
    if (dist > node.reach) continue
    if (!best || dist < best.dist) {
      best = { x: node.cx, y: node.cy, dist, strength: 1 - dist / node.reach }
    }
  }

  if (!best || best.strength <= 0.12) {
    return { aimX: target.x, aimY: target.y, hovering: false }
  }

  const pull = best.strength * 0.35
  return {
    aimX: lerp(target.x, best.x, pull),
    aimY: lerp(target.y, best.y, pull),
    hovering: true,
  }
}

export function startPointerEngine() {
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine = window.matchMedia('(pointer: fine)')
  let enabled = false
  let frame = 0

  const stopLoop = () => {
    looping = false
    cancelAnimationFrame(frame)
  }

  const tick = (now: number) => {
    if (!enabled) return
    ensureCache()

    if (!primed) {
      current.nx = target.nx
      current.ny = target.ny
    } else {
      current.nx = lerp(current.nx, target.nx, PARALLAX_LERP)
      current.ny = lerp(current.ny, target.ny, PARALLAX_LERP)
    }

    writeParallax(root)
    const magnetsMoving = stepMagnets()
    const aim = aimAtPointer()

    let busy = magnetsMoving
    for (const driver of drivers) {
      if (driver({ ...aim, now })) busy = true
    }

    const parallaxSettled =
      Math.abs(current.nx - target.nx) < 0.0006 && Math.abs(current.ny - target.ny) < 0.0006

    if (!busy && parallaxSettled) {
      current.nx = target.nx
      current.ny = target.ny
      writeParallax(root)
      looping = false
      return
    }

    frame = requestAnimationFrame(tick)
  }

  const kick = () => {
    if (!enabled || looping || document.hidden) return
    looping = true
    frame = requestAnimationFrame(tick)
  }

  requestKick = kick

  const onMove = (event: PointerEvent) => {
    if (!enabled) return
    const width = window.innerWidth || 1
    const height = window.innerHeight || 1
    target.x = event.clientX
    target.y = event.clientY
    target.nx = event.clientX / width - 0.5
    target.ny = event.clientY / height - 0.5
    if (!primed) {
      primed = true
      current.x = target.x
      current.y = target.y
      current.nx = target.nx
      current.ny = target.ny
    }
    const now = performance.now()
    for (const listener of moveListeners) listener(event.clientX, event.clientY, now)
    kick()
  }

  const onScroll = () => {
    cacheDirty = true
    if (!looping) {
      cancelAnimationFrame(loop)
      loop = requestAnimationFrame(() => {
        if (cacheDirty) ensureCache()
      })
    }
  }

  const sync = () => {
    const next = !reduce.matches && fine.matches
    if (next === enabled) return
    enabled = next
    if (!enabled) {
      stopLoop()
      root.style.removeProperty('--pointer-x')
      root.style.removeProperty('--pointer-y')
      root.style.removeProperty('--tilt-x')
      root.style.removeProperty('--tilt-y')
      lastPointer = ''
      lastTilt = ''
      for (const magnet of magnets) {
        magnet.x = 0
        magnet.y = 0
        magnet.tx = 0
        magnet.ty = 0
        magnet.el.style.transform = ''
      }
    } else {
      cacheDirty = true
    }
  }

  sync()
  reduce.addEventListener('change', sync)
  fine.addEventListener('change', sync)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  const onHide = () => {
    if (document.hidden) stopLoop()
  }
  document.addEventListener('visibilitychange', onHide)

  return () => {
    enabled = false
    stopLoop()
    cancelAnimationFrame(loop)
    reduce.removeEventListener('change', sync)
    fine.removeEventListener('change', sync)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onMove)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    document.removeEventListener('visibilitychange', onHide)
    root.style.removeProperty('--pointer-x')
    root.style.removeProperty('--pointer-y')
    root.style.removeProperty('--tilt-x')
    root.style.removeProperty('--tilt-y')
    primed = false
    cacheDirty = true
    seen = []
    lastPointer = ''
    lastTilt = ''
    requestKick = () => {}
  }
}
