import { ArrowDown, ArrowRight, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { portfolio, socials, whatsappUrl } from '../data'
import { cn } from '../lib/cn'
import { ArchDiagram } from './ArchDiagram'
import { SocialIcon } from './SocialIcon'
import { btn, LiveDot, stagger } from './ui'

const { profile } = portfolio

const tabs = [
  { id: 'arch', label: 'architecture' },
  { id: 'json', label: 'whoami.json' },
] as const

export function Hero() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('arch')

  return (
    <section aria-labelledby="hero-title" className="relative pt-14 sm:pt-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <motion.div variants={stagger.parent} initial="hidden" animate="show">
          <motion.p variants={stagger.child} className="label flex items-center gap-2">
            <LiveDot />
            {profile.currentTitle} at {profile.currentCompany} · {profile.location.split(',')[0]}
          </motion.p>
          <motion.h1
            variants={stagger.child}
            id="hero-title"
            className="mt-5 text-[clamp(38px,7vw,60px)] font-semibold leading-[1.02] tracking-[-0.045em]"
          >
            {profile.name}
          </motion.h1>
          <motion.p variants={stagger.child} className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink-2 sm:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div variants={stagger.child} className="mt-8 flex flex-wrap gap-2.5">
            <a href="#contact" className={cn(btn.primary, 'group max-sm:flex-1')}>
              Get in touch
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download className={cn(btn.ghost, 'group max-sm:flex-1')}>
                Resume
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener" className={cn(btn.ghost, 'max-sm:w-full')}>
                <MessageCircle className="size-4 text-live" aria-hidden />
                WhatsApp
              </a>
            )}
          </motion.div>

          <motion.ul variants={stagger.child} aria-label="Profiles" className="mt-7 flex items-center gap-1">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full text-ink-3 transition-colors hover:bg-bg-2 hover:text-ink"
                >
                  <SocialIcon id={s.id} className="size-[17px]" />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="w-full max-w-[540px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.12)] lg:max-w-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2.5">
            <div role="tablist" aria-label="Hero panel" className="relative flex rounded-full bg-bg-2 p-0.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className="relative isolate min-h-8 rounded-full px-3 font-mono text-[12px] text-ink-3 transition-colors aria-selected:text-ink"
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="hero-tab"
                      className="absolute inset-0 -z-10 rounded-full border border-line bg-surface shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
            <span className="label hidden sm:block">fig. 01</span>
          </div>

          <div className="dot-grid p-4 sm:p-6">
            {tab === 'arch' ? (
              <div role="tabpanel" id="panel-arch" aria-labelledby="tab-arch">
                <ArchDiagram />
              </div>
            ) : (
              <div role="tabpanel" id="panel-json" aria-labelledby="tab-json" className="rounded-lg border border-line bg-surface p-4">
                <WhoAmI />
              </div>
            )}
          </div>
          <figcaption className="border-t border-line px-4 py-3 text-[13px] leading-normal text-ink-3 sm:px-5">
            {tab === 'arch'
              ? 'Socket.IO across multiple Node.js instances, kept in sync by a Redis adapter. No sticky sessions.'
              : 'The short version.'}
          </figcaption>
        </motion.figure>
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
    location: profile.location,
    open_to: profile.openTo,
  }
  const keys = Object.keys(obj)
  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.8]">
      <code>
        <span className="text-ink-3">{'{'}</span>
        {'\n'}
        {keys.map((k, i) => {
          const v = obj[k]
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
              <span className="text-ink-3">{i < keys.length - 1 ? ',' : ''}</span>
              {'\n'}
            </span>
          )
        })}
        <span className="text-ink-3">{'}'}</span>
      </code>
    </pre>
  )
}
