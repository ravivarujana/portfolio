import { portfolio, socials } from '../data'
import { SocialIcon } from './SocialIcon'

export function Footer({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <footer className="border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-[13px] text-ink-3">
        <p>
          © {new Date().getFullYear()} {portfolio.profile.name}
        </p>
        <ul aria-label="Profiles" className="flex items-center">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-bg-2 hover:text-ink"
              >
                <SocialIcon id={s.id} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <button type="button" onClick={onOpenPalette} className="hidden hover:text-ink sm:inline">
            <kbd className="font-mono">⌘K</kbd> to navigate
          </button>
          <a href="#top" className="hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
