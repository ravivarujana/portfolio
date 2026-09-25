import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRef } from 'react'
import { portfolio, type CaseStudy } from '../data'
import { Rich } from '../lib/rich'
import { Chips, Flow } from './ui'

export function CaseStudyDialog({ study, onClose }: { study: CaseStudy | null; onClose: () => void }) {
  // Keep rendering the last study while the close animation plays.
  const last = useRef<CaseStudy | null>(study)
  if (study) last.current = study
  const c = study ?? last.current
  const index = c ? portfolio.caseStudies.indexOf(c) + 1 : 0

  return (
    <Dialog.Root open={!!study} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[70] bg-scrim backdrop-blur-[2px]" />
        {/* Height follows content: short write-ups stay compact, long ones scroll inside the panel. */}
        <Dialog.Content
          aria-describedby={undefined}
          // Focus the panel itself, so a tap doesn't paint a focus ring on the close button.
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLElement | null)?.focus()
          }}
          className="dialog-panel fixed inset-x-0 bottom-0 z-[75] flex max-h-[92dvh] flex-col rounded-t-[14px] border-2 border-b-0 border-edge bg-surface outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[86dvh] sm:w-[min(720px,calc(100vw-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[6px] sm:border-b-2 sm:shadow-[8px_8px_0_var(--color-shadow)] focus:outline-none"
        >
          {c && (
            <>
              <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 flex-none rounded-full bg-ink-3 sm:hidden" />
              <header className="flex flex-none items-start justify-between gap-4 border-b-2 border-edge px-5 pb-4 pt-3 sm:px-7 sm:pt-6">
                <div className="min-w-0">
                  <p className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-ink-3">cs.{String(index).padStart(2, '0')}</span>
                    <span className="rounded-[3px] bg-ink px-2 py-0.5 text-bg">{c.tag}</span>
                  </p>
                  <Dialog.Title className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.02em] sm:text-[26px]">{c.title}</Dialog.Title>
                </div>
                <Dialog.Close className="-mr-2 grid size-11 flex-none place-items-center rounded-[4px] border-2 border-transparent text-ink transition-colors hover:border-edge hover:bg-bg" aria-label="Close">
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </header>

              <div className="overflow-y-auto overscroll-contain px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-7">
                <p className="text-[16px] text-ink-2 sm:text-[17px]">{c.summary}</p>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Flow steps={c.flow} />
                  {c.metric && (
                    <p className="font-mono text-sm">
                      <span className="font-display text-2xl text-accent">{c.metric.value}</span>
                      <span className="ml-2 text-ink-3">{c.metric.label}</span>
                    </p>
                  )}
                </div>

                <div className="mt-7 space-y-6">
                  {c.details.map((d) => (
                    <section key={d.heading}>
                      <h3 className="label">{d.heading}</h3>
                      {d.body && (
                        <p className="mt-2 text-[15.5px] text-ink sm:text-base">
                          <Rich text={d.body} />
                        </p>
                      )}
                      {d.points && (
                        <ul className="mt-2.5 grid gap-2">
                          {d.points.map((p) => (
                            <li key={p} className="relative pl-5 text-[15.5px] text-ink-2 sm:text-base">
                              <span aria-hidden className="absolute left-0.5 top-[0.8em] h-px w-2 bg-accent" />
                              <Rich text={p} />
                            </li>
                          ))}
                        </ul>
                      )}
                      {d.code && (
                        <pre className="mt-3 overflow-x-auto rounded-[4px] border-2 border-edge bg-bg p-4 font-mono text-[12.5px] leading-relaxed text-ink-2">
                          {d.code.lang && <span className="label mb-2 block">{d.code.lang}</span>}
                          <code>{d.code.content}</code>
                        </pre>
                      )}
                    </section>
                  ))}
                </div>

                <div className="mt-7 border-t-2 border-dashed border-line-2 pt-5">
                  <h3 className="label mb-3">Stack</h3>
                  <Chips items={c.stack} />
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
