import { portfolio } from '../data'
import { sectionIndex } from './nav'
import { dimSiblings, Reveal, Section } from './ui'

const { about } = portfolio

export function About() {
  return (
    <Section id="about" index={sectionIndex('about')} name="About" title={about.title}>
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Reveal className="space-y-5 text-[17px] leading-relaxed text-ink-2">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.08}>
          <ul aria-label="Areas of focus" className={`grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1 ${dimSiblings}`}>
            {about.focus.map((f) => (
              <li key={f.title} className="bg-surface p-5">
                <h3 className="text-[15px] font-medium">{f.title}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-3">{f.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
