import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/*
 * A tiny pixel-art scene of "what I'm probably doing right now".
 * Drawn on a 64×36 grid; each activity is a function of the frame number.
 * Character colours are fixed; ground, desk and clouds follow the site theme.
 */

const W = 64
const H = 36
const FRAME_MS = 180
const FRAMES_PER_ACTIVITY = 40

const PAL: Record<string, string> = {
  h: '#2b211c', // hair
  s: '#e2b08a', // skin
  e: '#1b1b1b', // eyes
  t: '#3b6fe0', // shirt
  p: '#353b47', // pants
  b: '#1a1c22', // shoes
  r: '#e5484d', // headphones
  k: '#24272e', // camera / monitor frame
  l: '#7cc4ff', // lens / screen glow
  g: '#9aa3ad', // metal
  m: '#9a6a44', // mug
  y: '#f5c542', // sun / flash
  G: '#5aa469', // leaves
  n: '#6b4f3a', // trunk
  w: '#f4f4f2', // steam / paper
  c: '#0f1729', // screen
  i: 'var(--color-ink-3)',
  L: 'var(--color-line-2)',
}

const HEAD = ['...hhhhhh...', '..hhhhhhhh..', '..hssssssh..', '..ssessess..', '..ssssssss..', '...ssssss...', '....ssss....']
const BODY = ['..tttttttt..', '.tttttttttt.', '.tttttttttt.', '.stttttttts.']
const BODY_CAM = ['.tttttttttt.', '.tttttttttt.', '..tttttttt..', '..tttttttt..']
const LEGS = ['..pppppppp..', '..pppppppp..', '..ppp..ppp..', '..ppp..ppp..', '..bbb..bbb..']
const LEGS_A = ['..pppppppp..', '..pppppppp..', '..ppp..ppp..', '..bbb..ppp..', '.......bbb..']
const LEGS_B = ['..pppppppp..', '..pppppppp..', '..ppp..ppp..', '..ppp..bbb..', '..bbb.......']
const NOTE = ['..i', '..i', '..i', 'iii', 'ii.']

type Px = [number, number, string]

function canvas() {
  const px: Px[] = []
  const put = (x: number, y: number, c: string) => {
    if (x >= 0 && x < W && y >= 0 && y < H) px.push([x, y, c])
  }
  const rect = (x: number, y: number, w: number, h: number, c: string) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, c)
  }
  const sprite = (rows: string[], x: number, y: number) =>
    rows.forEach((row, j) => [...row].forEach((ch, i) => ch !== '.' && put(x + i, y + j, ch)))
  return { px, put, rect, sprite }
}

const ACTIVITIES = [
  { id: 'coding', line: 'shipping something with Claude Code' },
  { id: 'listening', line: 'headphones in, lo-fi on' },
  { id: 'shooting', line: 'out with the camera, chasing good light' },
  { id: 'walking', line: 'a walk to clear the head' },
] as const
type ActivityId = (typeof ACTIVITIES)[number]['id']

function draw(activity: ActivityId, f: number): Px[] {
  const { px, put, rect, sprite } = canvas()

  if (activity === 'coding') {
    // monitor
    rect(30, 4, 28, 18, 'k')
    rect(31, 5, 26, 16, 'c')
    const lines: [number, number, string][] = [
      [0, 9, 'l'], [2, 14, 'y'], [2, 8, 'g'], [4, 16, 'l'], [2, 11, 'G'], [0, 5, 'g'], [0, 12, 'y'],
    ]
    let budget = (f * 3) % 110
    lines.forEach(([indent, len, c], i) => {
      const shown = Math.max(0, Math.min(len, budget))
      budget -= len
      rect(33 + indent, 7 + i * 2, shown, 1, c)
      if (shown > 0 && shown < len && f % 2 === 0) put(33 + indent + shown, 7 + i * 2, 'w')
    })
    rect(42, 22, 4, 3, 'g')
    rect(38, 25, 12, 1, 'g')
    // person (seated behind the desk, forearms resting on it)
    sprite(HEAD, 10, 15)
    sprite(BODY.slice(0, 3), 10, 22)
    rect(10, 25, 12, 1, 't')
    // typing hands
    put(12 + (f % 2), 25, 's')
    put(19 - (f % 2), 25, 's')
    // mug + steam
    rect(24, 23, 3, 3, 'm')
    put(27, 24, 'm')
    if (f % 4 < 2) put(25, 21, 'w')
    else put(24, 20, 'w')
    // desk
    rect(2, 26, 60, 1, 'i')
    rect(6, 27, 1, 8, 'i')
    rect(57, 27, 1, 8, 'i')
  }

  if (activity === 'listening') {
    const bob = f % 4 < 2 ? 0 : 1
    sprite(HEAD, 26, 10 + bob)
    // headphones
    rect(29, 9 + bob, 6, 1, 'r')
    put(28, 10 + bob, 'r')
    put(35, 10 + bob, 'r')
    rect(27, 12 + bob, 1, 3, 'r')
    rect(36, 12 + bob, 1, 3, 'r')
    sprite(BODY, 26, 17)
    sprite(LEGS, 26, 21)
    // floating notes
    for (let i = 0; i < 3; i++) {
      const y = 22 - ((f + i * 5) % 16)
      sprite(NOTE, 40 + i * 6 + (i % 2), y)
    }
    sprite(NOTE, 16, 22 - ((f + 8) % 16))
    rect(4, 26, 56, 1, 'L')
  }

  if (activity === 'shooting') {
    // scenery
    const sun = [[1, 0, 3], [0, 1, 5], [0, 2, 5], [0, 3, 5], [1, 4, 3]]
    sun.forEach(([dx, dy, w]) => rect(50 + dx, 4 + dy, w, 1, 'y'))
    rect(45, 13, 6, 1, 'G')
    rect(44, 14, 8, 6, 'G')
    rect(47, 20, 2, 6, 'n')
    // person with camera
    sprite(HEAD, 16, 10)
    sprite(BODY_CAM, 16, 17)
    sprite(LEGS, 16, 21)
    rect(18, 12, 8, 4, 'k')
    rect(19, 11, 2, 1, 'k')
    rect(21, 13, 2, 2, 'l')
    put(25, 11, 'g')
    rect(17, 14, 1, 3, 's')
    rect(26, 14, 1, 3, 's')
    // flash every few seconds
    const t = f % 12
    if (t < 2) {
      put(29, 13, 'y')
      put(30, 13, 'y')
      put(29, 11, 'y')
      put(30, 10, 'y')
      put(29, 15, 'y')
      put(30, 16, 'y')
    }
    // printed photo slides out after the flash
    if (t >= 2 && t < 9) {
      const drop = Math.min(5, t - 2)
      rect(19, 16 + drop, 6, 6, 'w')
      rect(20, 17 + drop, 4, 3, 'l')
    }
    rect(4, 26, 56, 1, 'L')
  }

  if (activity === 'walking') {
    // clouds and a tree drifting by
    const wrap = (v: number, m: number) => ((v % m) + m) % m
    const cloud = (x: number, y: number) => {
      rect(x + 1, y, 5, 1, 'L')
      rect(x, y + 1, 8, 2, 'L')
    }
    cloud(wrap(60 - f, 84) - 10, 4)
    cloud(wrap(102 - f, 84) - 10, 8)
    const tx = wrap(70 - f * 2, 90) - 12
    rect(tx, 15, 6, 6, 'G')
    rect(tx + 2, 21, 2, 5, 'n')
    // walker
    const step = f % 2
    const bob = step
    sprite(HEAD, 26, 10 - bob)
    sprite(BODY, 26, 17 - bob)
    sprite(step ? LEGS_A : LEGS_B, 26, 21 - bob)
    // ground with moving dashes
    rect(0, 26, W, 1, 'L')
    for (let i = 0; i < 9; i++) {
      const x = wrap(i * 8 - f * 2, 72) - 4
      rect(x, 28, 3, 1, 'L')
    }
  }

  return px
}

export function PixelNow() {
  const reduce = useReducedMotion()
  const [frame, setFrame] = useState(0)
  const [index, setIndex] = useState(() => Math.floor(Math.random() * ACTIVITIES.length))
  const ref = useRef<HTMLButtonElement>(null)
  const inView = useRef(true)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      if (!inView.current || document.hidden) return
      setFrame((f) => {
        if (f + 1 >= FRAMES_PER_ACTIVITY) {
          setIndex((i) => (i + 1 + Math.floor(Math.random() * (ACTIVITIES.length - 1))) % ACTIVITIES.length)
          return 0
        }
        return f + 1
      })
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [reduce])

  const activity = ACTIVITIES[index]
  const pixels = draw(activity.id, reduce ? 0 : frame)

  return (
    <div>
      <button
        ref={ref}
        type="button"
        onClick={() => {
          setIndex((i) => (i + 1) % ACTIVITIES.length)
          setFrame(0)
        }}
        aria-label={`Ravi is ${activity.id}: ${activity.line}. Show another activity.`}
        className="block w-full cursor-pointer rounded-lg"
      >
        <svg viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" className="h-auto w-full" aria-hidden>
          {pixels.map(([x, y, c], i) => (
            <rect key={i} x={x} y={y} width={1.02} height={1.02} fill={PAL[c] ?? c} />
          ))}
        </svg>
      </button>
      <p className="mt-4 font-mono text-[12.5px] text-ink-2" aria-live="polite">
        <span className="text-ai">ravi</span>.status = <span className="text-accent">"{activity.id}"</span>
        <span className="text-ink-3"> // {activity.line}</span>
      </p>
      <p className="label mt-1.5">tap the scene for another one</p>
    </div>
  )
}

/* ---------- Waving avatar (shown next to the name in the hero) ---------- */

const WAVE_W = 16
const WAVE_H = 11
// Arm pixels for the two wave positions: [x, y, colour]
// Arm attaches at the shoulder (x 12, y 8) and ends in a 2×2 hand.
const ARM_OUT: Px[] = [[12, 8, 't'], [13, 7, 't'], [14, 6, 't'], [14, 4, 's'], [15, 4, 's'], [14, 5, 's'], [15, 5, 's']]
const ARM_IN: Px[] = [[12, 8, 't'], [13, 7, 't'], [13, 6, 't'], [13, 4, 's'], [14, 4, 's'], [13, 5, 's'], [14, 5, 's']]

/**
 * The same character, head and shoulders, waving. Waves a few times the first time it scrolls into view
 * and again whenever the pointer enters its parent, then rests with the hand up.
 * Never loops on its own, so it doesn't pull attention from the text.
 */
export function PixelWave({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const [arm, setArm] = useState<'out' | 'in'>('out')
  const ref = useRef<SVGSVGElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (reduce) return
    const wave = () => {
      if (timer.current) return // already waving
      let n = 0
      timer.current = window.setInterval(() => {
        n++
        setArm(n % 2 ? 'in' : 'out')
        if (n >= 8) {
          window.clearInterval(timer.current)
          timer.current = undefined
          setArm('out')
        }
      }, 150)
    }
    const host = ref.current?.parentElement
    host?.addEventListener('pointerenter', wave)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        wave()
        io.disconnect()
      }
    }, { threshold: 1 })
    if (ref.current) io.observe(ref.current)
    return () => {
      io.disconnect()
      window.clearInterval(timer.current)
      timer.current = undefined
      host?.removeEventListener('pointerenter', wave)
    }
  }, [reduce])

  const { px, sprite } = canvas()
  sprite(HEAD, 1, 0)
  sprite(BODY.slice(0, 3), 1, 7)
  const pixels = [...px, ...(arm === 'out' ? ARM_OUT : ARM_IN)].filter(([x, y]) => x < WAVE_W && y < WAVE_H)

  return (
    <svg ref={ref} viewBox={`0 0 ${WAVE_W} ${WAVE_H}`} shapeRendering="crispEdges" aria-hidden className={className}>
      {pixels.map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width={1.02} height={1.02} fill={PAL[c] ?? c} />
      ))}
    </svg>
  )
}
