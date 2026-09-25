import { CornerDownRight } from 'lucide-react'
import { portfolio } from '../data'
import { Chips, Reveal, Section } from './ui'
import { sectionIndex } from './nav'

const { learning } = portfolio

export function Learning() {
  return (
    <Section id="learning" index={sectionIndex('learning')} name="ai_ml --learning" jp="学習中" title={learning.title} sub={learning.intro}>
      <div className="grid gap-4 sm:grid-cols-2">
        {learning.tracks.map((t, i) => (
          <Reveal key={t.title} delay={(i % 2) * 0.05} className="h-full">
            <article className="relative flex h-full flex-col rounded-[4px] border-2 border-dashed border-edge bg-surface/60 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 font-mono text-xs">
                <span className="text-ink-3">track.{String(i + 1).padStart(2, '0')}</span>
                <span className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ai px-2 py-0.5 font-semibold text-ai">
                  <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-ai" />
                  learning
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.02em]">{t.title}</h3>
              <p className="mt-2.5 text-[15px] text-ink-2">{t.text}</p>
              <p className="mt-4 flex items-center gap-2 font-mono text-xs text-ink-3">
                <CornerDownRight className="size-3.5 flex-none" aria-hidden />
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
