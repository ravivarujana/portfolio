import { motion, type Variants } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { cn } from '../lib/cn'

const ease = [0.22, 1, 0.36, 1] as const

/** Blur-and-rise reveal when scrolled into view. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Staggered entrance for a group of children on first load (hero). */
export const stagger: { parent: Variants; child: Variants } = {
  parent: { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } },
  child: {
    hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
  },
}

export function Section({
  id,
  index,
  name,
  title,
  sub,
  children,
  className,
}: {
  id: string
  index: string
  name: string
  title?: ReactNode
  sub?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('pt-24 sm:pt-32', className)}>
      <div className="wrap">
        <Reveal className="mb-10 max-w-2xl sm:mb-12">
          <p className="label mb-3 flex items-center gap-2">
            <span className="text-ink-2">{index}</span>
            <span aria-hidden className="h-px w-5 bg-line-2" />
            {name}
          </p>
          {title ? (
            <h2 id={`${id}-title`} className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-balance sm:text-[32px]">
              {title}
            </h2>
          ) : (
            <h2 id={`${id}-title`} className="sr-only">{name}</h2>
          )}
          {sub && <p className="mt-3 max-w-[58ch] text-ink-2">{sub}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export function Chips({ items, keys = [], className }: { items: string[]; keys?: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'rounded-md border px-2 py-[3px] font-mono text-[12px]',
            keys.includes(item) ? 'border-line-2 bg-surface text-ink' : 'border-line bg-bg-2 text-ink-2',
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-1.5 font-mono text-[11.5px] text-ink-3" aria-label="Flow">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center">
          {i > 0 && <span aria-hidden className="px-1.5 text-line-2">→</span>}
          <span className={cn(i === steps.length - 1 && 'text-ink')}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

const btnBase =
  'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]'

export const btn = {
  primary: cn(btnBase, 'bg-ink text-bg hover:bg-ink/85'),
  ghost: cn(btnBase, 'border border-line-2 bg-surface text-ink hover:border-ink-3/60 hover:bg-bg-2'),
}

export function LiveDot() {
  return <span aria-hidden className="size-1.5 flex-none rounded-full bg-live animate-pulse-live" />
}

/** Feed the cursor position to a `.spotlight` element. */
export function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

/** Hovering one child fades its siblings (for lists and grids). */
export const dimSiblings = 'hover-hover:[&:has(>*:hover)>*:not(:hover)]:opacity-55 [&>*]:transition-opacity [&>*]:duration-300'
