import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

export function Section({
  id,
  index,
  name,
  jp,
  title,
  sub,
  children,
  className,
}: {
  id: string
  index: string
  name: string
  /** Short Japanese subtitle shown next to the section label */
  jp?: string
  title?: ReactNode
  sub?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('pt-20 sm:pt-28 lg:pt-32', className)}>
      <div className="wrap">
        <Reveal className="mb-8 max-w-3xl sm:mb-12">
          <p className="mb-4 flex items-center gap-3 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-2">
            <span className="grid h-7 min-w-7 place-items-center rounded-[3px] bg-ink px-1.5 font-display text-[13px] tracking-normal text-bg">
              {index}
            </span>
            {name}
            {jp && (
              <span lang="ja" className="text-[15px] font-bold normal-case tracking-[0.12em] text-accent">
                {jp}
              </span>
            )}
            <span aria-hidden className="h-0.5 w-12 bg-edge" />
          </p>
          {title ? (
            <h2 id={`${id}-title`} className="text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl lg:text-[46px]">
              {title}
            </h2>
          ) : (
            <h2 id={`${id}-title`} className="sr-only">{name}</h2>
          )}
          {sub && <p className="mt-3 max-w-[60ch] text-ink-2">{sub}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export function Chips({ items, keys = [], size = 'sm', className }: { items: string[]; keys?: string[]; size?: 'sm' | 'md'; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'rounded-[5px] border font-mono leading-none',
            size === 'sm' ? 'px-2.5 py-[7px] text-xs' : 'px-3 py-[9px] text-[13px]',
            keys.includes(item) ? 'border-edge bg-ink text-bg' : 'border-line-2 bg-surface text-ink-2',
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
    <ol className="flex flex-wrap items-center gap-y-2 font-mono text-[11.5px] text-ink-2" aria-label="Flow">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center">
          {i > 0 && <span aria-hidden className="px-1.5 text-ink-3">→</span>}
          <span
            className={cn(
              'rounded border px-2 py-1',
              i === steps.length - 1 ? 'border-edge bg-surface text-ink' : 'border-dashed border-line-2',
            )}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  )
}

const btnBase =
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border-2 border-edge px-4.5 text-[15px] font-semibold shadow-[3px_3px_0_var(--color-shadow)] transition-[background-color,color,transform,box-shadow] duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--color-shadow)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'

export const btn = {
  primary: cn(btnBase, 'bg-accent text-accent-ink hover:bg-accent-hover'),
  ghost: cn(btnBase, 'bg-surface text-ink hover:bg-surface-2'),
}

/** Red hanko-style seal used as the brand mark. */
export function Seal({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-8 -rotate-3 place-items-center rounded-[4px] bg-accent font-display text-[12px] leading-none text-accent-ink ring-1 ring-inset ring-accent-ink/70 [box-shadow:inset_0_0_0_3px_var(--color-accent)]',
        className,
      )}
    >
      RV
    </span>
  )
}

export function LiveDot() {
  return <span aria-hidden className="size-[7px] flex-none rounded-full bg-live animate-pulse-live" />
}
