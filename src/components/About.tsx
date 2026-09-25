import { portfolio } from '../data'
import { Reveal, Section } from './ui'
import { sectionIndex } from './nav'

const { about } = portfolio

export function About() {
  return (
    <Section id="about" index={sectionIndex('about')} name="about" jp="自己紹介" title={about.title}>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <Reveal className="space-y-4.5 text-[17px] text-ink-2 sm:text-lg">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.08}>
          <ul aria-label="Areas of focus" className="panel divide-y-2 divide-dashed divide-line-2 px-5">
            {about.focus.map((f, i) => (
              <li key={f.title} className="grid grid-cols-[32px_1fr] gap-3 py-4.5">
                <span className="grid size-6 place-items-center rounded-full border-2 border-edge font-display text-[11px] text-accent">{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{f.title}</h3>
                  <p className="mt-1 text-[15px] text-ink-2">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
