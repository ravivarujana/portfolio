import { portfolio } from '../data'
import { cn } from '../lib/cn'
import { sectionIndex } from './nav'
import { Chips, Reveal, Section, trackSpotlight } from './ui'

const { learning } = portfolio

export function Learning() {
  return (
    <Section id="learning" index={sectionIndex('learning')} name="AI" title={learning.title} sub={learning.intro}>
      <div className="grid gap-3 sm:grid-cols-2">
        {learning.tracks.map((t, i) => {
          const daily = t.status === 'daily'
          return (
            <Reveal key={t.title} delay={(i % 2) * 0.06} className={cn('h-full', daily && 'sm:col-span-2')}>
              <article
                onMouseMove={trackSpotlight}
                className={cn(
                  'spotlight flex h-full flex-col rounded-xl border p-5 sm:p-6',
                  daily ? 'border-line bg-surface' : 'border-dashed border-line-2',
                )}
              >
                <p className={cn('label flex items-center gap-2', daily ? 'text-live' : 'text-ai')}>
                  <span aria-hidden className={cn('size-1.5 rounded-full', daily ? 'bg-live' : 'animate-pulse bg-ai')} />
                  {daily ? 'in my workflow daily' : 'learning'}
                </p>
                <h3 className="mt-4 text-[17px] font-medium tracking-[-0.015em]">{t.title}</h3>
                <p className="mt-2 max-w-[70ch] text-[15px] leading-relaxed text-ink-3">{t.text}</p>
                {!daily && (
                  <p className="label mt-4">
                    builds on <span className="text-ink-2">{t.builds_on}</span>
                  </p>
                )}
                <Chips items={t.tags} keys={daily ? t.tags : []} className="mt-auto pt-5" />
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
