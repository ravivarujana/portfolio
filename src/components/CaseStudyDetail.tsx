import type { CaseStudy } from '../data'
import { Rich } from '../lib/rich'
import { Chips, Flow } from './ui'

/** Full write-up for one case study. Shared by the desktop detail pane and the mobile accordion. */
export function CaseStudyDetail({ study: c }: { study: CaseStudy }) {
  return (
    <div>
      <p className="text-[16px] leading-relaxed text-ink-2">{c.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Flow steps={c.flow} />
        {c.metric && (
          <p className="font-mono text-sm">
            <span className="text-2xl font-semibold tracking-tight text-accent">{c.metric.value}</span>
            <span className="ml-2 text-ink-3">{c.metric.label}</span>
          </p>
        )}
      </div>

      <div className="mt-7 space-y-6">
        {c.details.map((d) => (
          <section key={d.heading}>
            <h4 className="label">{d.heading}</h4>
            {d.body && (
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink">
                <Rich text={d.body} />
              </p>
            )}
            {d.points && (
              <ul className="mt-2.5 grid gap-2">
                {d.points.map((p) => (
                  <li key={p} className="relative pl-4 text-[15.5px] leading-relaxed text-ink-2">
                    <span aria-hidden className="absolute left-0 top-[0.72em] size-1 rounded-full bg-accent" />
                    <Rich text={p} />
                  </li>
                ))}
              </ul>
            )}
            {d.code && (
              <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-bg-2 p-4 font-mono text-[12.5px] leading-relaxed text-ink-2">
                {d.code.lang && <span className="label mb-2 block">{d.code.lang}</span>}
                <code>{d.code.content}</code>
              </pre>
            )}
          </section>
        ))}
      </div>

      <div className="mt-7 border-t border-line pt-5">
        <h4 className="label mb-3">Stack</h4>
        <Chips items={c.stack} />
      </div>
    </div>
  )
}
