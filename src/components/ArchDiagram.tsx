import { ChevronDown, Zap } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '../lib/cn'

/*
 * Interactive version of the real-time setup: players → load balancer → Socket.IO nodes,
 * kept in sync through the Redis adapter. Visitors can send events and take nodes down
 * to watch the load balancer route around them.
 */

const EDGES = {
  c1: 'M70 44 V70 H210 V92',
  c2: 'M210 44 V92',
  c3: 'M350 44 V70 H210 V92',
  l1: 'M210 124 V142 H70 V164',
  l2: 'M210 124 V164',
  l3: 'M210 124 V142 H350 V164',
  r1: 'M70 200 V236',
  r2: 'M210 200 V236',
  r3: 'M350 200 V236',
  db: 'M130 268 V300',
  q: 'M290 268 V300',
} as const
type EdgeId = keyof typeof EDGES

const PLAYERS = [20, 160, 300]
const NODES = [20, 160, 300]
const EVENTS = ['bet:placed', 'chat:message', 'balance:update', 'table:join']

type Log = { id: number; text: string; tone: 'muted' | 'normal' | 'accent' | 'down' }

const toneClass: Record<Log['tone'], string> = {
  muted: 'text-ink-3',
  normal: 'text-ink-2',
  accent: 'text-accent',
  down: 'text-red-500',
}

export function ArchDiagram() {
  const reduce = useReducedMotion()
  const svg = useRef<SVGSVGElement>(null)
  const layer = useRef<SVGGElement>(null)
  const paths = useRef<Partial<Record<EdgeId, SVGPathElement | null>>>({})
  const [down, setDown] = useState([false, false, false])
  const downRef = useRef(down)
  downRef.current = down
  const rr = useRef(0)
  const [logs, setLogs] = useState<Log[]>([{ id: 0, text: '3 nodes via redis adapter · no single point of failure', tone: 'muted' }])
  const logId = useRef(1)
  const [logOpen, setLogOpen] = useState(false)
  const latest = logs[logs.length - 1]
  const [status, setStatus] = useState('') // screen-reader announcement for user actions
  const inView = useRef(false)
  const lastUser = useRef(0)

  const log = useCallback((text: string, tone: Log['tone'] = 'normal') => {
    setLogs((l) => [...l.slice(-4), { id: logId.current++, text, tone }])
  }, [])

  /** Move a dot along an edge; resolves when it arrives. */
  const travel = useCallback(
    (edge: EdgeId, { reverse = false, accent = false, ms = 650 } = {}) =>
      new Promise<void>((resolve) => {
        const path = paths.current[edge]
        const g = layer.current
        if (!path || !g || reduce) return resolve()
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        dot.setAttribute('r', '3')
        dot.setAttribute('class', accent ? 'fill-accent' : 'fill-ink-2')
        g.appendChild(dot)
        const len = path.getTotalLength()
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / ms)
          const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
          const pt = path.getPointAtLength(len * (reverse ? 1 - eased : eased))
          dot.setAttribute('cx', String(pt.x))
          dot.setAttribute('cy', String(pt.y))
          if (t < 1) requestAnimationFrame(step)
          else {
            dot.remove()
            resolve()
          }
        }
        requestAnimationFrame(step)
      }),
    [reduce],
  )

  const sendEvent = useCallback(
    async (from?: number) => {
      const up = [0, 1, 2].filter((i) => !downRef.current[i])
      if (up.length === 0) return
      const p = from ?? Math.floor(Math.random() * 3)
      const k = up[rr.current++ % up.length]
      const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)]

      log(`player-${p + 1} emit("${ev}")`)
      await travel(`c${p + 1}` as EdgeId)
      await travel(`l${k + 1}` as EdgeId)
      log(`lb → node-${k + 1} · publish to redis`)
      await travel(`r${k + 1}` as EdgeId, { accent: true, ms: 450 })

      const others = [0, 1, 2].filter((i) => i !== k && !downRef.current[i])
      const side: Promise<void>[] = others.map((j) => travel(`r${j + 1}` as EdgeId, { reverse: true, accent: true, ms: 450 }))
      if (Math.random() < 0.5) side.push(travel('db', { ms: 500 }))
      if (Math.random() < 0.3) side.push(travel('q', { ms: 500 }))
      log(others.length ? `redis → node-${others.map((j) => j + 1).join(', node-')} · broadcast` : 'redis · no other nodes to broadcast to', 'accent')
      await Promise.all(side)
    },
    [log, travel],
  )

  const toggleNode = (i: number) => {
    lastUser.current = Date.now()
    const next = [...down]
    if (!next[i] && next.filter((d) => !d).length === 1) {
      log('keeping at least one node up', 'muted')
      setStatus('At least one node has to stay up.')
      return
    }
    next[i] = !next[i]
    setDown(next)
    const up = next.map((d, j) => (d ? null : `node-${j + 1}`)).filter(Boolean)
    if (next[i]) {
      log(`node-${i + 1} down · lb routing → ${up.join(', ')}`, 'down')
      setStatus(`Node ${i + 1} is down. Traffic is routed to ${up.join(' and ')}.`)
    } else {
      log(`node-${i + 1} back up · rejoined redis adapter`, 'muted')
      setStatus(`Node ${i + 1} is back up.`)
    }
  }

  const userSend = (from?: number) => {
    lastUser.current = Date.now()
    setStatus('Event sent.')
    void sendEvent(from)
  }

  // Ambient traffic while visible, paused briefly after the visitor interacts.
  useEffect(() => {
    if (reduce || !svg.current) return
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting))
    io.observe(svg.current)
    const id = window.setInterval(() => {
      if (inView.current && !document.hidden && Date.now() - lastUser.current > 3500) void sendEvent()
    }, 2600)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [reduce, sendEvent])

  const onKey = (fn: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }

  const box = (x: number, y: number, w: number, h: number, label: string, cls: string, textCls: string) => (
    <>
      <rect x={x} y={y} width={w} height={h} rx={6} className={cn('transition-[fill,stroke] duration-300', cls)} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" className={cn('transition-[fill] duration-300', textCls)}>
        {label}
      </text>
    </>
  )

  return (
    <div>
      <svg ref={svg} viewBox="0 0 420 346" role="group" aria-labelledby="arch-title arch-desc" className="h-auto w-full select-none">
        <title id="arch-title">Interactive real-time architecture</title>
        <desc id="arch-desc">
          Players connect through a load balancer to three Node.js Socket.IO instances, kept in sync by the Redis adapter, with PostgreSQL and Bull
          workers below. Select a player to send an event, or select a node to take it down.
        </desc>
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 z" className="fill-line-2" />
          </marker>
        </defs>

        <g className="fill-none" strokeWidth={1.2}>
          {(Object.keys(EDGES) as EdgeId[]).map((id) => {
            const n = /^[lr](\d)$/.exec(id)
            const dead = n && down[Number(n[1]) - 1]
            return (
              <path
                key={id}
                ref={(el) => {
                  paths.current[id] = el
                }}
                d={EDGES[id]}
                markerEnd={id === 'db' || id === 'q' ? 'url(#arrow)' : undefined}
                className={cn('transition-[stroke,opacity] duration-300', dead ? 'stroke-line-2 opacity-40 [stroke-dasharray:2_4]' : 'stroke-line-2')}
              />
            )
          })}
        </g>

        <g className="font-mono text-[12.5px] sm:text-[11.5px]">
          {PLAYERS.map((x, i) => (
            <g
              key={`p${i}`}
              role="button"
              tabIndex={0}
              aria-label={`Send an event from player ${i + 1}`}
              onClick={() => userSend(i)}
              onKeyDown={onKey(() => userSend(i))}
              className="group/p cursor-pointer outline-none"
            >
              {box(x, 12, 100, 32, 'player', 'fill-surface stroke-line-2 group-hover/p:stroke-ink-3 group-focus-visible/p:stroke-accent', 'fill-ink-2 group-hover/p:fill-ink')}
            </g>
          ))}

          {box(110, 92, 200, 32, 'load balancer', 'fill-bg-2 stroke-line-2 [stroke-dasharray:3_3]', 'fill-ink-3')}

          {NODES.map((x, i) => (
            <g
              key={`n${i}`}
              role="button"
              tabIndex={0}
              aria-pressed={down[i]}
              aria-label={down[i] ? `Bring node ${i + 1} back up` : `Take node ${i + 1} down`}
              onClick={() => toggleNode(i)}
              onKeyDown={onKey(() => toggleNode(i))}
              className="group/n cursor-pointer outline-none"
            >
              {box(
                x,
                164,
                100,
                36,
                down[i] ? `node #${i + 1} ✕` : `node · io #${i + 1}`,
                down[i]
                  ? 'fill-bg-2 stroke-red-500/70 [stroke-dasharray:3_3] group-focus-visible/n:stroke-accent'
                  : 'fill-surface stroke-ink-3 group-hover/n:stroke-ink group-focus-visible/n:stroke-accent',
                down[i] ? 'fill-red-500/80' : 'fill-ink',
              )}
            </g>
          ))}

          {box(20, 236, 380, 32, 'redis · pub/sub adapter', 'fill-accent-soft stroke-accent', 'fill-accent')}
          {box(60, 300, 140, 36, 'postgresql', 'fill-surface stroke-line-2', 'fill-ink-2')}
          {box(220, 300, 140, 36, 'bull workers', 'fill-surface stroke-line-2', 'fill-ink-2')}
        </g>

        <g ref={layer} aria-hidden />
      </svg>

      {/* Controls + latest log line in one row; the full log expands on demand. */}
      <div className="mt-3 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => userSend()}
          className="inline-flex min-h-9 flex-none items-center gap-1.5 rounded-full border border-line-2 bg-surface px-3.5 text-[13px] font-medium text-ink transition-[background-color,transform] hover:bg-bg-2 active:scale-[0.97]"
        >
          <Zap className="size-3.5 text-accent" aria-hidden /> Send event
        </button>
        <button
          type="button"
          onClick={() => setLogOpen((o) => !o)}
          aria-expanded={logOpen}
          aria-controls="arch-log"
          className="group flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-bg-2/70 pl-3 pr-2 text-left font-mono text-[11.5px] transition-colors hover:border-line-2"
        >
          <span key={latest.id} className={cn('min-w-0 flex-1 truncate animate-[log-in_0.3s_ease-out]', toneClass[latest.tone])}>
            {latest.text}
          </span>
          <span className="label flex flex-none items-center gap-0.5 group-hover:text-ink">
            log
            <ChevronDown className={cn('size-3.5 transition-transform duration-300', logOpen && 'rotate-180')} aria-hidden />
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {logOpen && (
          <motion.div
            id="arch-log"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ol aria-label="Event log" className="mt-2 rounded-lg border border-line bg-bg-2/70 px-3 py-2 font-mono text-[11.5px] leading-[1.75]">
              {logs.map((l) => (
                <li key={l.id} className={cn('truncate', toneClass[l.tone])}>
                  <span aria-hidden className="text-line-2">› </span>
                  {l.text}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="label mt-2.5">tap a player to send · tap a node to take it down</p>
      <p role="status" className="sr-only">
        {status}
      </p>
    </div>
  )
}
