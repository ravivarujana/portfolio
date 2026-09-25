import { portfolio } from '../data'
import { Chips, Reveal, Section } from './ui'
import { sectionIndex } from './nav'

export function Stack() {
  return (
    <Section id="stack" index={sectionIndex('stack')} name="stack" jp="技術" title="Toolkit" sub="Filled tags are what I reach for daily in production.">
      <div className="border-t-2 border-edge">
        {portfolio.skills.map((g, i) => (
          <Reveal key={g.group} className="grid gap-3.5 border-b-2 border-dashed border-line-2 py-5 sm:py-6 md:grid-cols-[240px_1fr] md:gap-6">
            <h3 className="flex items-baseline gap-3 pt-1 text-[17px] font-semibold tracking-[-0.01em] sm:text-lg">
              <span className="font-display text-xs font-normal text-accent">{String(i + 1).padStart(2, '0')}</span>
              {g.group}
            </h3>
            <Chips items={g.items} keys={g.key} size="md" />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
