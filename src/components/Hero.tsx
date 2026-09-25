import { ArrowRight, FileText } from 'lucide-react'
import { useState } from 'react'
import { portfolio, socials } from '../data'
import { cn } from '../lib/cn'
import { ArchDiagram } from './ArchDiagram'
import { SocialIcon } from './SocialIcon'
import { btn, LiveDot } from './ui'

const { profile, metrics } = portfolio

const tabs = [
  { id: 'arch', label: 'architecture.svg' },
  { id: 'json', label: 'whoami.json' },
] as const

export function Hero() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('arch')

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-12 pt-10 sm:pb-16 sm:pt-16 lg:pt-20">
      <div aria-hidden className="focus-lines pointer-events-none absolute inset-0" />
      <div aria-hidden className="screentone pointer-events-none absolute -left-10 top-24 h-64 w-64 rotate-6 [mask-image:radial-gradient(circle,#000_30%,transparent_70%)]" />
      <p
        aria-hidden
        lang="ja"
        className="pointer-events-none absolute right-3 top-24 hidden font-display text-[22px] tracking-[0.25em] text-ink-3/60 [writing-mode:vertical-rl] 2xl:block"
      >
        バックエンド・エンジニア
      </p>

      <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          {/* speech bubble */}
          <p className="relative inline-flex max-w-full items-center gap-2.5 rounded-[18px] border-2 border-edge bg-surface px-3.5 py-1.5 font-mono text-[12px] text-ink sm:text-[13px]">
            <LiveDot />
            <span className="truncate">
              {profile.currentTitle} @ {profile.currentCompany} · {profile.location.split(',')[0]}
            </span>
            <span
              aria-hidden
              className="absolute -bottom-[9px] left-6 size-4 rotate-45 border-b-2 border-r-2 border-edge bg-surface"
            />
          </p>
          <h1 id="hero-title" className="mt-7 font-display text-[clamp(42px,10.5vw,88px)] leading-[1.02] tracking-[-0.01em] sm:mt-8">
            {profile.name}
          </h1>
          <p className="mt-4 text-[clamp(20px,2.6vw,28px)] font-semibold tracking-[-0.015em] text-ink-2">
            {profile.rolePrefix}{' '}
            <span className="relative isolate whitespace-nowrap text-ink">
              <span aria-hidden className="absolute inset-x-[-4px] bottom-[0.08em] -z-10 h-[0.42em] -skew-x-6 bg-mark/40" />
              {profile.role}
            </span>
          </p>
          <p className="mt-5 max-w-[56ch] text-[17px] text-ink-2 sm:mt-6">{profile.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className={cn(btn.primary, 'max-sm:flex-1')}>
              Contact me <ArrowRight className="size-4" aria-hidden />
            </a>
            {socials
              .filter((s) => s.hero)
              .map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener" className={cn(btn.ghost, 'max-sm:flex-1')}>
                  <SocialIcon id={s.id} className="size-4" /> {s.label}
                </a>
              ))}
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener" className={cn(btn.ghost, 'max-sm:flex-1')}>
                <FileText className="size-4" aria-hidden /> Resume
              </a>
            )}
          </div>
        </div>

        <figure className="panel w-full max-w-[560px] overflow-hidden lg:max-w-none">
          <div role="tablist" aria-label="Hero panel" className="flex items-stretch border-b-2 border-edge bg-ink">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className="min-h-10 border-r-2 border-edge px-3.5 font-mono text-[12px] text-bg/70 transition-colors hover:text-bg aria-selected:bg-surface aria-selected:text-ink"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5">
            {tab === 'arch' ? (
              <div role="tabpanel" id="panel-arch" aria-labelledby="tab-arch">
                <ArchDiagram />
                <figcaption className="mt-4 border-t-2 border-dashed border-line-2 pt-3 text-[13.5px] leading-normal text-ink-2">
                  Socket.IO across multiple Node.js instances, kept in sync by a Redis adapter. No sticky sessions, no dropped connections.
                </figcaption>
              </div>
            ) : (
              <div role="tabpanel" id="panel-json" aria-labelledby="tab-json">
                <WhoAmI />
              </div>
            )}
          </div>
        </figure>
      </div>

      <div className="wrap relative">
        <dl className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={m.label} className={cn('panel relative flex flex-col overflow-hidden p-4 sm:p-5', i === 0 && 'bg-accent text-accent-ink')}>
              {i === 0 && <span aria-hidden className="screentone absolute inset-0 opacity-40 [--color-tone:rgb(255_255_255/0.35)]" />}
              <dt className={cn('label relative order-1', i === 0 && 'text-accent-ink/85')}>{m.label}</dt>
              <dd className="relative order-2 mt-3 font-display text-[clamp(32px,4.2vw,50px)] leading-none">
                {m.value}
                <span className={i === 0 ? '' : 'text-accent'}>{m.suffix.replace(/\s.*/, '')}</span>
                {m.suffix.includes(' ') && <span className="ml-1.5 font-sans text-[0.36em] font-semibold">{m.suffix.split(' ')[1]}</span>}
              </dd>
              <dd className={cn('relative order-3 mt-3 text-[13px] leading-snug sm:text-sm', i === 0 ? 'text-accent-ink/90' : 'text-ink-2')}>{m.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function WhoAmI() {
  const obj: Record<string, string | string[]> = {
    name: profile.name,
    role: `${profile.rolePrefix} ${profile.role}`,
    experience: `${profile.yearsOfExperience} years`,
    current: `${profile.currentTitle} @ ${profile.currentCompany}`,
    focus: profile.focus,
    learning: portfolio.learning.tracks.map((t) => t.tags[0]),
    location: `${profile.location} (${profile.timezone})`,
    open_to: profile.openTo,
  }
  const keys = Object.keys(obj)
  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.75] sm:text-[13px]">
      <code>
        <span className="text-ink-3">{'{'}</span>
        {'\n'}
        {keys.map((k, i) => {
          const v = obj[k]
          const comma = i < keys.length - 1 ? ',' : ''
          return (
            <span key={k}>
              {'  '}
              <span className="text-ai">"{k}"</span>
              <span className="text-ink-3">: </span>
              {Array.isArray(v) ? (
                <>
                  <span className="text-ink-3">[</span>
                  {v.map((x, j) => (
                    <span key={x}>
                      <span className="text-accent">"{x}"</span>
                      {j < v.length - 1 && <span className="text-ink-3">, </span>}
                    </span>
                  ))}
                  <span className="text-ink-3">]</span>
                </>
              ) : (
                <span className="text-accent">"{v}"</span>
              )}
              <span className="text-ink-3">{comma}</span>
              {'\n'}
            </span>
          )
        })}
        <span className="text-ink-3">{'}'}</span>
      </code>
    </pre>
  )
}
