import { portfolio } from '../data'
import { sectionIndex } from './nav'
import { Chips, Reveal, Section, trackSpotlight } from './ui'

const { learning } = portfolio

export function Learning() {
  return (
    <Section id="learning" index={sectionIndex('learning')} name="Now learning" title={learning.title} sub={learning.intro}>
      <div className="grid gap-3 sm:grid-cols-2">
        {learning.tracks.map((t, i) => (
          <Reveal key={t.title} delay={(i % 2) * 0.06} className="h-full">
            <article onMouseMove={trackSpotlight} className="spotlight flex h-full flex-col rounded-xl border border-dashed border-line-2 p-5 sm:p-6">
              <p className="label flex items-center gap-2 text-ai">
                <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-ai" />
                in progress
              </p>
              <h3 className="mt-4 text-[17px] font-medium tracking-[-0.015em]">{t.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{t.text}</p>
              <p className="label mt-4">
                builds on <span className="text-ink-2">{t.builds_on}</span>
              </p>
              <Chips items={t.tags} className="mt-auto pt-5" />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
