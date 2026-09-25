import { ArrowDown, ArrowUpRight, Check, Copy, Loader2, MessageCircle, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { portfolio, social, whatsappUrl } from '../data'
import { useCopy } from '../hooks/useCopy'
import type { Mode } from '../hooks/useTheme'
import { cn } from '../lib/cn'
import { sectionIndex } from './nav'
import { SocialIcon } from './SocialIcon'
import { Turnstile, type TurnstileHandle } from './Turnstile'
import { btn, Reveal, Section } from './ui'

const { profile, contact } = portfolio
const { form } = contact

type Status = { state: 'idle' | 'sending' | 'sent' } | { state: 'error'; message: string }

const field =
  'w-full rounded-lg border border-line-2 bg-surface px-3.5 py-2.5 text-[16px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3/70 focus:border-accent focus:ring-4 focus:ring-accent-soft sm:text-[15px]'

export function Contact({ mode }: { mode: Mode }) {
  return (
    <Section id="contact" index={sectionIndex('contact')} name="Contact" title={contact.title} sub={contact.note} className="pb-24 sm:pb-32">
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <ContactForm mode={mode} />
        </Reveal>
        <Reveal delay={0.08}>
          <QuickLinks />
        </Reveal>
      </div>
    </Section>
  )
}

function ContactForm({ mode }: { mode: Mode }) {
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const [token, setToken] = useState<string | null>(null)
  const turnstile = useRef<TurnstileHandle>(null)
  const needsToken = !!form.turnstileSiteKey

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const data = Object.fromEntries(new FormData(formEl)) as Record<string, string>
    if (needsToken && !token) {
      setStatus({ state: 'error', message: 'Please wait a moment for the spam check to finish, then try again.' })
      return
    }
    setStatus({ state: 'sending' })
    try {
      const res = await fetch(form.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, token }),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'send-failed')
      formEl.reset()
      setStatus({ state: 'sent' })
    } catch (err) {
      const msg = err instanceof Error && err.message !== 'send-failed' && !err.message.includes('fetch') ? err.message : null
      setStatus({ state: 'error', message: msg ?? "Couldn't send right now." })
    } finally {
      turnstile.current?.reset()
    }
  }

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <AnimatePresence mode="wait" initial={false}>
        {status.state === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            className="flex min-h-[340px] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
              <Check className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em]">Message sent.</h3>
            <p className="mt-1.5 text-ink-2">Thanks for reaching out. I'll get back to you soon.</p>
            <button type="button" onClick={() => setStatus({ state: 'idle' })} className="mt-6 text-[14px] text-ink-3 underline-offset-4 hover:text-ink hover:underline">
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, filter: 'blur(4px)' }} className="grid gap-4" noValidate={false}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="cf-name">
                <input id="cf-name" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
              </Field>
              <Field label="Email" htmlFor="cf-email">
                <input id="cf-email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" className={field} />
              </Field>
            </div>
            <Field label="Message" htmlFor="cf-message">
              <textarea
                id="cf-message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                placeholder="What are you working on, or which role is this about?"
                className={cn(field, 'resize-y leading-relaxed')}
              />
            </Field>

            {/* Honeypot: hidden from people, bots tend to fill it in. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="cf-company">Company website</label>
              <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            {needsToken && <Turnstile ref={turnstile} siteKey={form.turnstileSiteKey} theme={mode} onToken={setToken} />}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-1">
              <button type="submit" disabled={status.state === 'sending'} className={cn(btn.primary, 'min-w-36 disabled:opacity-70 max-sm:w-full')}>
                {status.state === 'sending' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
                  </>
                ) : (
                  <>
                    Send message <Send className="size-3.5" aria-hidden />
                  </>
                )}
              </button>
              <p className="label">Usually replies within 1–2 days</p>
            </div>

            <AnimatePresence>
              {status.state === 'error' && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[14px] text-ink-2"
                >
                  {status.message} You can also email me at{' '}
                  <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">
                    {profile.email}
                  </a>
                  .
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-2">
        {label}
      </label>
      {children}
    </div>
  )
}

function QuickLinks() {
  const { state, copy } = useCopy()
  const linkedin = social('linkedin')
  const row =
    'group flex min-h-16 items-center gap-3.5 px-5 py-3 transition-colors hover:bg-bg-2 focus-visible:bg-bg-2 focus-visible:outline-none'
  const icon = 'grid size-9 flex-none place-items-center rounded-full border border-line bg-bg text-ink-2 transition-colors group-hover:text-ink'

  return (
    <ul className="h-full divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      <li>
        <button type="button" onClick={() => copy(profile.email)} className={cn(row, 'w-full text-left')}>
          <span className={icon}>{state === 'copied' ? <Check className="size-4 text-live" aria-hidden /> : <Copy className="size-4" aria-hidden />}</span>
          <span className="min-w-0 flex-1">
            <span className="label block">Email</span>
            <span className="block truncate">{profile.email}</span>
          </span>
          <span className="label" aria-live="polite">
            {state === 'copied' ? 'copied' : state === 'error' ? 'failed' : 'copy'}
          </span>
        </button>
      </li>
      {whatsappUrl && (
        <li>
          <a href={whatsappUrl} target="_blank" rel="noopener" className={row}>
            <span className={icon}>
              <MessageCircle className="size-4 text-live" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="label block">WhatsApp</span>
              <span className="block">Message me directly</span>
            </span>
            <ArrowUpRight className="size-4 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </li>
      )}
      {linkedin && (
        <li>
          <a href={linkedin.url} target="_blank" rel="noopener" className={row}>
            <span className={icon}>
              <SocialIcon id="linkedin" className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="label block">LinkedIn</span>
              <span className="block">Connect on LinkedIn</span>
            </span>
            <ArrowUpRight className="size-4 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </li>
      )}
      {profile.resumeUrl && (
        <li>
          <a href={profile.resumeUrl} download className={row}>
            <span className={icon}>
              <ArrowDown className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="label block">Resume</span>
              <span className="block">Download PDF</span>
            </span>
          </a>
        </li>
      )}
      <li className="flex min-h-16 items-center px-5 py-3">
        <span className="min-w-0">
          <span className="label block">Based in</span>
          <span className="block text-ink-2">
            {profile.location} · {profile.timezone}
          </span>
        </span>
      </li>
    </ul>
  )
}
