import { ArrowRight, Check, Copy, FileText } from 'lucide-react'
import { portfolio, socials } from '../data'
import { useCopy } from '../hooks/useCopy'
import { cn } from '../lib/cn'
import { prettyUrl, SocialIcon } from './SocialIcon'
import { btn, Reveal, Section } from './ui'
import { sectionIndex } from './nav'

const { profile, contact } = portfolio

export function Contact() {
  const { state, copy } = useCopy()
  const rows = [
    profile.phone && { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^+\d]/g, '')}` },
    { label: 'Location', value: `${profile.location} · ${profile.timezone}` },
  ].filter(Boolean) as { label: string; value: string; href?: string }[]

  return (
    <Section
      id="contact"
      index={sectionIndex('contact')}
      name="contact"
      jp="連絡"
      className="pb-20 sm:pb-28"
      title={
        <span className="text-[clamp(30px,5vw,56px)] leading-[1.08] tracking-[-0.035em]">
          {contact.title}{' '}
          <span className="relative isolate inline-block whitespace-nowrap text-accent">
            <span aria-hidden className="absolute inset-x-[-6px] bottom-[0.06em] -z-10 h-[0.4em] -skew-x-6 bg-mark/30" />
            {contact.highlight}
          </span>
        </span>
      }
      sub={contact.note}
    >
      <Reveal className="panel grid gap-10 p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p className="label">Email</p>
          <div className="mb-6 mt-2.5 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="break-all text-[clamp(21px,3.2vw,34px)] font-medium tracking-[-0.02em] underline decoration-transparent decoration-1 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={() => copy(profile.email)}
              className={cn(
                'inline-flex min-h-9 items-center gap-1.5 rounded-[4px] border-2 px-3 font-mono text-xs uppercase tracking-wider transition-colors',
                state === 'copied' ? 'border-live text-live' : 'border-edge text-ink hover:bg-bg',
              )}
            >
              {state === 'copied' ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent('Hello Ravi')}`} className={cn(btn.primary, 'max-sm:w-full')}>
              Send an email <ArrowRight className="size-4" aria-hidden />
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener" className={cn(btn.ghost, 'max-sm:w-full')}>
                <FileText className="size-4" aria-hidden /> Resume
              </a>
            )}
          </div>
        </div>

        <div>
        {socials.length > 0 && (
          <ul aria-label="Social profiles" className="mb-2 border-b-2 border-dashed border-line-2 pb-3.5">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex min-h-11 items-center gap-3 rounded-[4px] py-1.5 text-ink transition-colors hover:text-accent"
                >
                  <span className="grid size-9 flex-none place-items-center rounded-[4px] border-2 border-edge bg-bg transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                    <SocialIcon id={s.id} className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="label block">{s.label}</span>
                    <span className="block truncate">{prettyUrl(s.url)} ↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <ul>
          {rows.map((r) => (
            <li key={r.label} className="grid gap-1 border-b-2 border-dashed border-line-2 py-3.5 first:pt-0 last:border-b-0">
              <span className="label">{r.label}</span>
              {r.href ? (
                <a href={r.href} className="break-words text-ink transition-colors hover:text-accent">
                  {r.value}
                </a>
              ) : (
                <span className="text-ink-2">{r.value}</span>
              )}
            </li>
          ))}
        </ul>
        </div>
      </Reveal>
    </Section>
  )
}
