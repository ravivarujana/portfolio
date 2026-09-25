import { portfolio, socials } from '../data'
import { SocialIcon } from './SocialIcon'

export function Footer({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <footer className="border-t-2 border-edge bg-ink text-bg pb-[env(safe-area-inset-bottom)]">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-7 text-[13px] text-bg/70">
        <p className="flex items-baseline gap-3">
          <span lang="ja" className="font-display text-lg text-bg">
            つづく
          </span>
          <span className="font-mono text-bg/70">
            to be continued<span aria-hidden className="ml-1 inline-block h-3.5 w-[7px] translate-y-0.5 bg-accent animate-blink" />
          </span>
        </p>
        <p>
          © {new Date().getFullYear()} {portfolio.profile.name}
        </p>
        <ul aria-label="Social profiles" className="flex items-center gap-1">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-[4px] text-bg/80 transition-colors hover:bg-bg/10 hover:text-bg"
              >
                <SocialIcon id={s.id} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5 font-mono">
          <button type="button" onClick={onOpenPalette} className="hidden text-bg/80 hover:text-accent sm:inline">
            ⌘K menu
          </button>
          <a href="#top" className="text-bg/80 hover:text-accent">
            back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
