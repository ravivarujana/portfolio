import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDown, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { portfolio, type CaseStudy } from '../data'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { CaseStudyDetail } from './CaseStudyDetail'

const { caseStudies } = portfolio
const num = (c: CaseStudy) => String(caseStudies.indexOf(c) + 1).padStart(2, '0')
const ease = [0.22, 1, 0.36, 1] as const

type Props = {
  open: boolean
  /** Selected case study id, or null for none (the list only). */
  selectedId: string | null
  onSelect: (id: string | null) => void
  onClose: () => void
}

/**
 * All case studies in one popup.
 * Tablet/desktop: list on the left, the selected write-up on the right.
 * Phone: accordions, one open at a time.
 */
export function CaseStudiesDialog({ open, selectedId, onSelect, onClose }: Props) {
  const split = useMediaQuery('(min-width: 48rem)')

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[70] bg-scrim backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            // Focus the panel itself, so a tap doesn't paint a focus ring on the first control.
            e.preventDefault()
            ;(e.currentTarget as HTMLElement | null)?.focus()
          }}
          className={cn(
            'dialog-panel fixed inset-x-0 bottom-0 z-[75] flex max-h-[92dvh] flex-col rounded-t-2xl border border-b-0 border-line bg-surface outline-none',
            'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88dvh] sm:w-[min(1040px,calc(100vw-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border-b sm:shadow-[0_24px_64px_-16px_rgb(0_0_0/0.3)]',
            split && 'sm:h-[min(720px,88dvh)]',
          )}
        >
          <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 flex-none rounded-full bg-line-2 sm:hidden" />
          <header className="flex flex-none items-center justify-between gap-4 border-b border-line py-2 pl-5 pr-3 sm:py-3 sm:pl-6">
            <Dialog.Title className="flex items-baseline gap-2.5 text-[17px] font-semibold tracking-[-0.015em]">
              Case studies <span className="label">{caseStudies.length}</span>
            </Dialog.Title>
            <Dialog.Close
              className="grid size-11 flex-none place-items-center rounded-full text-ink-3 transition-colors hover:bg-bg-2 hover:text-ink"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </header>

          {split ? (
            <SplitView selected={caseStudies.find((c) => c.id === selectedId) ?? caseStudies[0]} onSelect={onSelect} />
          ) : (
            <AccordionView selectedId={selectedId} onSelect={onSelect} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SplitView({ selected, onSelect }: { selected: CaseStudy; onSelect: (id: string) => void }) {
  const detail = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    detail.current?.scrollTo({ top: 0 })
  }, [selected.id])

  // Arrow keys move through the list like a menu.
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const i = caseStudies.indexOf(selected)
    const next = caseStudies[(i + (e.key === 'ArrowDown' ? 1 : -1) + caseStudies.length) % caseStudies.length]
    onSelect(next.id)
    list.current?.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus()
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(240px,300px)_1fr]">
      <nav aria-label="Case studies" className="min-h-0 overflow-y-auto overscroll-contain border-r border-line p-2">
        <ul ref={list} onKeyDown={onKeyDown} className="grid gap-0.5">
          {caseStudies.map((c) => {
            const active = c.id === selected.id
            return (
              <li key={c.id}>
                <button
                  type="button"
                  data-id={c.id}
                  onClick={() => onSelect(c.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'relative isolate flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors',
                    active ? 'text-ink' : 'text-ink-2 hover:bg-bg-2 hover:text-ink',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="case-active"
                      className="absolute inset-0 -z-10 rounded-lg border border-line bg-bg-2"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                    >
                      <span className="absolute inset-y-2.5 left-0 w-0.5 rounded-full bg-accent" />
                    </motion.span>
                  )}
                  <span className="label">
                    {num(c)} · {c.tag}
                  </span>
                  <span className="text-[14.5px] font-medium leading-snug">{c.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div ref={detail} className="min-h-0 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={selected.id}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease }}
            className="px-7 py-7 lg:px-10"
            aria-live="polite"
          >
            <p className="label">
              {num(selected)} · {selected.tag}
            </p>
            <h3 className="mb-5 mt-2 text-[24px] font-semibold leading-tight tracking-[-0.025em]">{selected.title}</h3>
            <CaseStudyDetail study={selected} />
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  )
}

function AccordionView({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string | null) => void }) {
  const container = useRef<HTMLDivElement>(null)

  // After the previous item collapses, bring the opened one's header to the top so it doesn't jump away.
  useEffect(() => {
    if (!selectedId) return
    const t = window.setTimeout(() => {
      const el = container.current?.querySelector<HTMLElement>(`[data-acc="${selectedId}"]`)
      const box = container.current
      if (el && box) box.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' })
    }, 340)
    return () => window.clearTimeout(t)
  }, [selectedId])

  return (
    <div ref={container} className="relative min-h-0 overflow-y-auto overscroll-contain px-3 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
      <ul className="grid gap-1">
        {caseStudies.map((c) => {
          const expanded = c.id === selectedId
          return (
            <li key={c.id} data-acc={c.id} className={cn('rounded-xl border transition-colors', expanded ? 'border-line bg-bg-2/60' : 'border-transparent')}>
              <h3>
                <button
                  type="button"
                  onClick={() => onSelect(expanded ? null : c.id)}
                  aria-expanded={expanded}
                  aria-controls={`acc-panel-${c.id}`}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                    !expanded && 'hover:bg-bg-2 active:bg-bg-2',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="label block">
                      {num(c)} · {c.tag}
                    </span>
                    <span className={cn('mt-0.5 block text-[15.5px] font-medium leading-snug', expanded ? 'text-ink' : 'text-ink-2')}>{c.title}</span>
                  </span>
                  <ChevronDown
                    className={cn('size-4 flex-none text-ink-3 transition-transform duration-300', expanded && 'rotate-180 text-ink')}
                    aria-hidden
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    id={`acc-panel-${c.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-5 pt-1">
                      <CaseStudyDetail study={c} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
