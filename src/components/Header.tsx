import { Moon, Search, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { portfolio } from '../data'
import { useActiveSection } from '../hooks/useActiveSection'
import type { Mode } from '../hooks/useTheme'
import { cn } from '../lib/cn'
import { NAV_IDS, NAV_ITEMS } from './nav'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

type Props = {
  onOpenPalette: () => void
  mode: Mode
  onToggleTheme: (origin?: { x: number; y: number }) => void
}

const iconBtn =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line-2 bg-surface px-2.5 text-ink-2 transition-colors hover:border-ink-3/60 hover:text-ink'

export function Header({ onOpenPalette, mode, onToggleTheme }: Props) {
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
        'sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300',
        scrolled || menuOpen ? 'border-line bg-bg/80' : 'border-transparent bg-bg/0',
      )}
    >
      <nav aria-label="Primary" className="wrap flex h-15 items-center justify-between gap-4">
        <a href="#top" className="text-[15px] font-semibold tracking-[-0.01em]" aria-label={`${portfolio.profile.name}, back to top`}>
          {portfolio.profile.name}
        </a>

        <ul className="hidden items-center lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className="relative isolate rounded-full px-3 py-1.5 text-[14px] text-ink-3 transition-colors hover:text-ink aria-[current=true]:text-ink"
              >
                {active === item.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-bg-2" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenPalette} className={iconBtn} aria-label="Open command menu">
            <Search className="size-3.5" aria-hidden />
            <kbd className="hidden font-mono text-[11.5px] sm:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              onToggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
            }}
            className={cn(iconBtn, 'w-9 px-0')}
            aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {mode === 'dark' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
          </button>
          <button
            type="button"
            className={cn(iconBtn, 'px-3.5 text-[13px] lg:hidden')}
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
            initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-60px)] overflow-y-auto border-b border-line bg-bg lg:hidden"
          >
            <ul className="wrap py-3">
              {NAV_ITEMS.map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center justify-between border-b border-line text-[17px] text-ink-2 last:border-0 active:text-ink"
                  >
                    {item.label}
                    <span className="label">{String(i + 1).padStart(2, '0')}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
