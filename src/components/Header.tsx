import { AnimatePresence, motion } from 'motion/react'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { portfolio } from '../data'
import { useActiveSection } from '../hooks/useActiveSection'
import { cn } from '../lib/cn'
import { NAV_ITEMS, NAV_IDS } from './nav'
import { Seal } from './ui'
import type { Mode, PaletteId } from '../lib/themes'
import { ThemeMenu } from './ThemeMenu'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

type Props = {
  onOpenPalette: () => void
  mode: Mode
  palette: PaletteId
  onMode: (m: Mode) => void
  onPalette: (p: PaletteId) => void
}

export function Header({ onOpenPalette, mode, palette, onMode, onPalette }: Props) {
  const active = useActiveSection(NAV_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    const mq = window.matchMedia('(min-width: 64rem)')
    const onMq = () => mq.matches && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] backdrop-blur-md backdrop-saturate-150 transition-colors duration-300',
        scrolled || menuOpen ? 'border-edge bg-bg/90' : 'border-transparent bg-bg/70',
      )}
    >
      <nav aria-label="Primary" className="wrap flex h-15 items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-2.5 font-mono text-sm" aria-label={`${portfolio.profile.name}, back to top`}>
          <Seal />
          <span className="hidden text-ink-2 transition-colors group-hover:text-ink min-[400px]:inline">~/{portfolio.profile.handle}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className="group inline-flex items-baseline gap-1.5 rounded-md px-3 py-2 font-mono text-[13.5px] text-ink-2 transition-colors hover:text-ink aria-[current=true]:text-ink aria-[current=true]:underline aria-[current=true]:decoration-accent aria-[current=true]:decoration-2 aria-[current=true]:underline-offset-[6px]"
              >
                <span className="text-[11px] text-ink-3 group-aria-[current=true]:text-accent">0{i + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="inline-flex h-10 items-center gap-2 rounded-[4px] border-2 border-edge bg-surface px-3 font-mono text-[12.5px] text-ink transition-colors hover:bg-surface-2"
            aria-label="Open command menu"
          >
            <Search className="size-3.5" aria-hidden />
            <kbd className="hidden font-mono sm:inline">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <ThemeMenu mode={mode} palette={palette} onMode={onMode} onPalette={onPalette} />
          <a
            href="#contact"
            className="hidden h-10 items-center rounded-[4px] border-2 border-edge bg-accent px-3.5 text-sm font-semibold text-accent-ink shadow-[2px_2px_0_var(--color-shadow)] transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Get in touch
          </a>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-[4px] border-2 border-edge bg-surface px-3 font-mono text-xs uppercase tracking-wider lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-60px)] overflow-y-auto border-b-2 border-edge bg-bg lg:hidden"
          >
            <ul className="wrap pb-5 pt-1">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-3 border-b border-line py-3.5 font-mono text-base text-ink-2 active:text-ink"
                  >
                    <span className="text-xs text-accent">0{i + 1}</span>
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-4 sm:hidden">
                <a href="#contact" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center justify-center rounded-[4px] border-2 border-edge bg-accent font-semibold text-accent-ink shadow-[3px_3px_0_var(--color-shadow)]">
                  Get in touch
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
