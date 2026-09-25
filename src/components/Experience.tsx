import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { portfolio } from '../data'
import { Rich } from '../lib/rich'
import { sectionIndex } from './nav'
import { Chips, dimSiblings, LiveDot, Reveal, Section } from './ui'

type Job = (typeof portfolio.experience)[number]

export function Experience() {
  return (
    <Section id="experience" index={sectionIndex('experience')} name="Experience" title="Where I've worked.">
      <ol className={dimSiblings}>
        {portfolio.experience.map((job) => (
          <li key={job.company} className="border-t border-line last:border-b">
            <Reveal>
              <Role job={job} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Role({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false)
  const limit = job.visiblePoints ?? job.points.length
  const shown = job.points.slice(0, limit)
  const hidden = job.points.slice(limit)
  const id = `more-${job.company.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <div className="grid gap-3 py-8 md:grid-cols-[180px_1fr] md:gap-10">
      <div className="label flex flex-wrap items-center gap-x-3 gap-y-1 md:block md:pt-1">
        <p className="text-ink-2">
          {job.start} — {job.end}
        </p>
        <p className="md:mt-1">{job.location}</p>
        {job.current && (
          <p className="flex items-center gap-2 text-live md:mt-3">
            <LiveDot /> current
          </p>
        )}
      </div>
      <div>
        <h3 className="text-[19px] font-semibold tracking-[-0.015em]">
          {job.company}
          <span className="font-normal text-ink-3"> · {job.role}</span>
        </h3>
        <ul className="mt-4 grid gap-2.5">
          {shown.map((p) => (
            <Point key={p} text={p} />
          ))}
        </ul>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ul
              id={id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-2.5 overflow-hidden pt-2.5"
            >
              {hidden.map((p) => (
                <Point key={p} text={p} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {hidden.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={id}
            className="mt-3 inline-flex min-h-9 items-center gap-1 text-[14px] text-ink-3 transition-colors hover:text-ink"
          >
            {expanded ? 'Show less' : `Show ${hidden.length} more`}
            <ChevronDown className={`size-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden />
          </button>
        )}
        <Chips items={job.stack} className="mt-5" />
      </div>
    </div>
  )
}

function Point({ text }: { text: string }) {
  return (
    <li className="relative pl-4 text-[15.5px] leading-relaxed text-ink-2">
      <span aria-hidden className="absolute left-0 top-[0.72em] size-1 rounded-full bg-ink-3/60" />
      <Rich text={text} />
    </li>
  )
}
