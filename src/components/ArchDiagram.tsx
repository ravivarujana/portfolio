import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

const edges: [string, string][] = [
  ['e-c1', 'M70 44 V70 H210 V92'],
  ['e-c2', 'M210 44 V92'],
  ['e-c3', 'M350 44 V70 H210 V92'],
  ['e-l1', 'M210 124 V142 H70 V164'],
  ['e-l2', 'M210 124 V164'],
  ['e-l3', 'M210 124 V142 H350 V164'],
  ['e-r1', 'M70 200 V236'],
  ['e-r2', 'M210 200 V236'],
  ['e-r3', 'M350 200 V236'],
  ['e-db', 'M130 268 V300'],
  ['e-q', 'M290 268 V300'],
]

type Node = { x: number; y: number; w: number; h: number; label: string; kind?: 'muted' | 'strong' | 'accent' }
const nodes: Node[] = [
  { x: 20, y: 12, w: 100, h: 32, label: 'player' },
  { x: 160, y: 12, w: 100, h: 32, label: 'player' },
  { x: 300, y: 12, w: 100, h: 32, label: 'player' },
  { x: 110, y: 92, w: 200, h: 32, label: 'load balancer · no sticky', kind: 'muted' },
  { x: 20, y: 164, w: 100, h: 36, label: 'node · io #1', kind: 'strong' },
  { x: 160, y: 164, w: 100, h: 36, label: 'node · io #2', kind: 'strong' },
  { x: 300, y: 164, w: 100, h: 36, label: 'node · io #3', kind: 'strong' },
  { x: 20, y: 236, w: 380, h: 32, label: 'redis · pub/sub adapter', kind: 'accent' },
  { x: 60, y: 300, w: 140, h: 36, label: 'postgresql' },
  { x: 220, y: 300, w: 140, h: 36, label: 'bull workers' },
]

// [edge, duration, start offset (negative begin, so packets are already moving on load), reverse, accent]
const packets: [string, number, number, boolean, boolean][] = [
  ['e-c1', 3.2, 0, false, false],
  ['e-c2', 2.6, 0.8, false, false],
  ['e-c3', 3.4, 1.4, false, false],
  ['e-l1', 2.8, 0.4, false, false],
  ['e-l2', 2.2, 1.1, false, false],
  ['e-l3', 3, 1.9, false, false],
  ['e-r1', 1.6, 0.2, false, true],
  ['e-r3', 1.6, 0.2, true, true],
  ['e-r2', 1.6, 1, true, true],
  ['e-q', 2.4, 0.6, false, false],
]

const nodeStyle = {
  default: { rect: 'fill-surface stroke-edge [stroke-width:1.5]', text: 'fill-ink' },
  muted: { rect: 'fill-bg stroke-ink-3 [stroke-dasharray:4_3]', text: 'fill-ink-2' },
  strong: { rect: 'fill-ink stroke-edge', text: 'fill-bg' },
  accent: { rect: 'fill-accent stroke-edge [stroke-width:1.5]', text: 'fill-accent-ink' },
}

export function ArchDiagram() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const svg = ref.current
    if (!svg || reduce) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()))
    io.observe(svg)
    return () => io.disconnect()
  }, [reduce])

  return (
    <svg ref={ref} viewBox="0 0 420 346" role="img" aria-labelledby="arch-title arch-desc" className="h-auto w-full">
      <title id="arch-title">Real-time architecture diagram</title>
      <desc id="arch-desc">
        Players connect through a load balancer without sticky sessions to three Node.js Socket.IO instances. The instances share events
        through a Redis pub/sub adapter, persist to PostgreSQL, and hand background jobs to Bull queue workers.
      </desc>
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-ink-3" />
        </marker>
      </defs>
      <g className="fill-none stroke-ink-3" strokeWidth={1.4}>
        {edges.map(([id, d]) => (
          <path key={id} id={id} d={d} markerEnd={id === 'e-db' || id === 'e-q' ? 'url(#arrow)' : undefined} />
        ))}
      </g>
      <g className="font-mono text-[12.5px] sm:text-[11.5px]">
        {nodes.map((n, i) => {
          const s = nodeStyle[n.kind ?? 'default']
          return (
            <g key={i}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} className={s.rect} />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2} textAnchor="middle" dominantBaseline="middle" className={s.text}>
                {n.label}
              </text>
            </g>
          )
        })}
      </g>
      {!reduce && (
        <g>
          {packets.map(([edge, dur, begin, reverse, accent], i) => (
            <circle key={i} r={2.6} className={accent ? 'fill-accent' : 'fill-ink'} stroke="var(--color-surface)" strokeWidth={1}>
              <animateMotion
                dur={`${dur}s`}
                begin={`-${begin}s`}
                repeatCount="indefinite"
                {...(reverse ? { keyPoints: '1;0', keyTimes: '0;1', calcMode: 'linear' } : {})}
              >
                <mpath href={`#${edge}`} />
              </animateMotion>
            </circle>
          ))}
        </g>
      )}
    </svg>
  )
}
