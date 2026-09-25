import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { portfolio, type CaseStudy } from '../data'
import { cn } from '../lib/cn'
import { CaseStudyDialog } from './CaseStudyDialog'
import { Chips, Flow, Reveal, Section } from './ui'
import { sectionIndex } from './nav'

const { caseStudies } = portfolio

type Props = { openId: string | null; onOpen: (id: string) => void; onClose: () => void }

export function CaseStudies({ openId, onOpen, onClose }: Props) {
  const current = caseStudies.find((c) => c.id === openId) ?? null

  return (
    <Section
      id="work"
      index={sectionIndex('work')}
      name="selected_work"
      jp="事例"
      title="Case studies from production systems."
      sub="Open any card for the full write-up: context, how it was built and the outcome."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.05} className={cn(c.featured && 'md:col-span-2')}>
            <CaseCard study={c} onOpen={() => onOpen(c.id)} />
          </Reveal>
        ))}
      </div>
      <CaseStudyDialog study={current} onClose={onClose} />
    </Section>
  )
}

function CaseCard({ study: c, onOpen }: { study: CaseStudy; onOpen: () => void }) {
  return (
    <article className="panel group relative flex h-full flex-col p-5 transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-shadow)] sm:p-6">
      <div className="flex items-center justify-between gap-3 font-mono text-xs">
        <span className="text-ink-3">cs.{String(portfolio.caseStudies.indexOf(c) + 1).padStart(2, '0')}</span>
        <span className="rounded-[3px] bg-ink px-2 py-0.5 text-bg">{c.tag}</span>
      </div>

      <div className={cn('flex flex-1 flex-col', c.featured && 'sm:grid sm:grid-cols-[1.1fr_1fr] sm:items-end sm:gap-8')}>
        <div className="flex flex-1 flex-col">
          <h3 className={cn('mt-4 font-bold leading-tight tracking-[-0.02em]', c.featured ? 'text-[22px] sm:text-[26px]' : 'text-xl')}>
            {/* whole card is clickable via this button's pseudo-element */}
            <button
              type="button"
              onClick={onOpen}
              aria-haspopup="dialog"
              className="text-left after:absolute after:inset-0 after:rounded-[4px] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent"
            >
              {c.title}
            </button>
          </h3>
          {!c.featured && (
            <div className="mt-4">
              <Flow steps={c.flow} />
            </div>
          )}
          <p className="mt-3 text-[15px] text-ink-2">{c.summary}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <Chips items={c.stack} />
            <span className="flex flex-none items-center gap-1 font-mono text-xs text-ink-3 transition-colors group-hover:text-accent font-semibold">
              read <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>

        {c.featured && c.metric && (
          <div aria-hidden className="relative mt-5 overflow-hidden rounded-[4px] border-2 border-edge bg-bg p-5 sm:mt-0"><span className="screentone absolute inset-0" />
            <div className="relative grid gap-2.5 font-mono text-[11.5px] text-ink-2">
              <Bar label="before" width={1} className="bg-ink" />
              <Bar label="after" width={0.3} className="bg-accent" delay={0.5} />
            </div>
            <p className="relative mt-4 font-display text-[clamp(46px,6vw,68px)] leading-none">
              {c.metric.value.replace('+', '')}
              <span className="text-accent">+</span>
            </p>
            <p className="label relative mt-2 text-ink-2">{c.metric.label}</p>
          </div>
        )}
      </div>
    </article>
  )
}

function Bar({ label, width, className, delay = 0 }: { label: string; width: number; className: string; delay?: number }) {
  return (
    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5">
      <span>{label}</span>
      <span className="h-2.5 overflow-hidden rounded-[2px] border border-edge bg-surface">
        <motion.span
          className={cn('block h-full origin-left', className)}
          style={{ width: `${width * 100}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 + delay }}
        />
      </span>
    </div>
  )
}
