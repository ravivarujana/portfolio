import { portfolio } from '../data'
import { cn } from '../lib/cn'
import { sectionIndex } from './nav'
import { dimSiblings, Reveal, Section } from './ui'

export function Stack() {
  return (
    <Section id="stack" index={sectionIndex('stack')} name="Stack" title="Tools I work with." sub="The bold ones are what I use daily in production.">
      <Reveal>
        <dl className={cn('divide-y divide-line border-y border-line', dimSiblings)}>
          {portfolio.skills.map((g) => (
            <div key={g.group} className="grid gap-1.5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="label pt-0.5">{g.group}</dt>
              <dd className="text-[15.5px] leading-relaxed">
                {g.items.map((item, i) => (
                  <span key={item}>
                    <span className={cn('whitespace-nowrap', g.key.includes(item) ? 'font-medium text-ink' : 'text-ink-3')}>{item}</span>
                    {/* real spaces around the separator so the line can wrap */}
                    {i < g.items.length - 1 && <span aria-hidden className="text-line-2"> / </span>}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}
