import { portfolio } from '../data'
import { Rich } from '../lib/rich'
import { Chips, LiveDot, Reveal, Section } from './ui'
import { sectionIndex } from './nav'

export function Experience() {
  return (
    <Section id="experience" index={sectionIndex('experience')} name="experience" jp="経歴" title="Three teams, one through-line: systems that run in production.">
      <ol>
        {portfolio.experience.map((job) => (
          <li key={job.company} className="border-t-2 border-edge last:border-b-2">
            <Reveal className="grid gap-3 py-8 sm:py-9 md:grid-cols-[200px_1fr] md:gap-12">
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-[13px] md:block">
                <p className="text-ink">
                  {job.start} — {job.end}
                </p>
                <p className="text-ink-3 md:mt-1">{job.location}</p>
                {job.current && (
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-edge bg-surface px-2.5 py-0.5 text-xs text-ink md:mt-3.5">
                    <LiveDot /> Current
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display text-2xl leading-tight sm:text-[30px]">{job.company}</h3>
                <p className="mt-1.5 font-semibold text-accent">{job.role}</p>
                <ul className="mt-5 grid gap-3">
                  {job.points.map((p) => (
                    <li key={p} className="relative pl-5.5 text-[15.5px] text-ink-2 sm:text-base">
                      <span aria-hidden className="absolute left-0.5 top-[0.8em] h-px w-2 bg-accent" />
                      <Rich text={p} />
                    </li>
                  ))}
                </ul>
                <Chips items={job.stack} className="mt-5" />
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
