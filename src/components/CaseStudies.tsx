import { ArrowUpRight, Plus } from 'lucide-react'
import { portfolio, type CaseStudy } from '../data'
import { cn } from '../lib/cn'
import { CaseStudiesDialog } from './CaseStudiesDialog'
import { sectionIndex } from './nav'
import { Flow, Reveal, Section, trackSpotlight } from './ui'

const { caseStudies, caseStudiesPreview } = portfolio
const preview = caseStudies.slice(0, caseStudiesPreview)
const rest = caseStudies.slice(caseStudiesPreview)

// If the regular preview cards don't fill the 2-column grid evenly, let the last one span the full row.
const regular = preview.filter((c) => !c.featured).length
const orphan = regular % 2 === 1 ? preview.length - 1 : -1

type Props = {
  /** A case study id, 'all' for the list with nothing selected, or null when closed */
  openId: string | null
  onOpen: (id: string) => void
  onClose: () => void
}

export function CaseStudies({ openId, onOpen, onClose }: Props) {
  return (
    <Section
      id="work"
      index={sectionIndex('work')}
      name="Selected work"
      title="Case studies from production."
      sub="Systems I've built, each with the context, how it was done and what it changed. Open one for the details."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {preview.map((c, i) => (
          <Reveal key={c.id} delay={(i % 2) * 0.06} className={cn((c.featured || i === orphan) && 'sm:col-span-2')}>
            <CaseCard study={c} index={i + 1} onOpen={() => onOpen(c.id)} />
          </Reveal>
        ))}
        {rest.length > 0 && (
          <Reveal className="sm:col-span-2">
            <MoreTile onOpen={() => onOpen('all')} />
          </Reveal>
        )}
      </div>
      <CaseStudiesDialog
        open={openId !== null}
        selectedId={openId === 'all' ? null : openId}
        onSelect={(id) => onOpen(id ?? 'all')}
        onClose={onClose}
      />
    </Section>
  )
}

function MoreTile({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseMove={trackSpotlight}
      aria-haspopup="dialog"
      className="spotlight group flex w-full items-center gap-4 rounded-xl border border-dashed border-line-2 p-5 text-left transition-colors duration-300 hover:border-transparent hover:bg-surface sm:p-6"
    >
      <span className="grid size-10 flex-none place-items-center rounded-full border border-line-2 bg-surface text-ink-2 transition-all duration-300 group-hover:rotate-90 group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
        <Plus className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-medium tracking-[-0.01em]">
          {rest.length} more case {rest.length === 1 ? 'study' : 'studies'}
        </span>
        {/* Name what's inside, so "more" isn't a blind click */}
        <span className="mt-1 block text-[14px] leading-relaxed text-ink-3">{rest.map((c) => c.title).join(' · ')}</span>
      </span>
      <span className="label hidden flex-none group-hover:text-ink sm:block">view all</span>
    </button>
  )
}

function CaseCard({ study: c, index, onOpen }: { study: CaseStudy; index: number; onOpen: () => void }) {
  return (
    <article
      onMouseMove={trackSpotlight}
      className="spotlight group flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-transparent sm:p-6"
    >
      <div className="label flex items-center justify-between gap-3">
        <span>
          {String(index).padStart(2, '0')} · {c.tag}
        </span>
        <ArrowUpRight
          className="size-4 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
      </div>

      <div className={cn('flex flex-1 flex-col', c.featured && 'sm:flex-row sm:items-end sm:justify-between sm:gap-10')}>
        <div className="flex flex-1 flex-col">
          <h3 className={cn('mt-6 font-medium tracking-[-0.02em]', c.featured ? 'text-[22px] sm:text-2xl' : 'text-[18px]')}>
            {/* whole card is clickable via this button's pseudo-element */}
            <button
              type="button"
              onClick={onOpen}
              aria-haspopup="dialog"
              className="text-left after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent"
            >
              {c.title}
            </button>
          </h3>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-ink-3">{c.summary}</p>
          <div className="mt-auto pt-5">
            <Flow steps={c.flow} />
          </div>
        </div>

        {c.featured && c.metric && (
          <div className="mt-6 flex-none sm:mt-0 sm:text-right">
            <p className="text-[clamp(44px,7vw,64px)] font-semibold leading-none tracking-[-0.05em] text-accent">{c.metric.value}</p>
            <p className="label mt-2">{c.metric.label}</p>
          </div>
        )}
      </div>
    </article>
  )
}
