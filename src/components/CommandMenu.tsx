import { Command } from 'cmdk'
import { ArrowRight, Copy, ExternalLink, FileText, Hash, Mail, Moon, Palette, Sun } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { portfolio, socials } from '../data'
import { PALETTES, type Mode, type PaletteId } from '../lib/themes'
import { NAV_ITEMS } from './nav'
import { SocialIcon } from './SocialIcon'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenCase: (id: string) => void
  mode: Mode
  onMode: (m: Mode) => void
  onPalette: (p: PaletteId) => void
}

const { profile, caseStudies } = portfolio

export function CommandMenu({ open, onOpenChange, onOpenCase, mode, onMode, onPalette }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const run = (fn: () => void) => () => {
    onOpenChange(false)
    fn()
  }
  const go = (id: string) => run(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
  const openUrl = (url: string) => run(() => window.open(url, '_blank', 'noopener'))

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[80] bg-scrim backdrop-blur-[2px]"
      contentClassName="fixed left-1/2 top-[max(12vh,env(safe-area-inset-top))] z-[90] w-[min(560px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[6px] border-2 border-edge bg-surface shadow-[6px_6px_0_var(--color-shadow)]"
    >
      <div className="flex items-center gap-2 border-b-2 border-edge px-4">
        <span className="font-mono text-accent">$</span>
        <Command.Input
          placeholder="Jump to a section, case study or link…"
          className="h-13 w-full bg-transparent font-mono text-base text-ink outline-none placeholder:text-ink-3 sm:text-sm"
        />
        <kbd className="hidden rounded-[3px] border-2 border-edge px-1.5 py-0.5 font-mono text-[10px] text-ink-3 sm:block">esc</kbd>
      </div>
      <Command.List className="max-h-[min(420px,60dvh)] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3">
        <Command.Empty className="px-3 py-8 text-center font-mono text-sm text-ink-3">No matches.</Command.Empty>

        <Command.Group heading="Navigate">
          {NAV_ITEMS.map((n) => (
            <Item key={n.id} icon={<Hash />} onSelect={go(n.id)} value={`go ${n.label} ${n.id}`}>
              {n.label}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Case studies">
          {caseStudies.map((c) => (
            <Item key={c.id} icon={<ArrowRight />} onSelect={run(() => onOpenCase(c.id))} value={`case ${c.title} ${c.tag}`} hint={c.tag}>
              {c.title}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Contact & links">
          <Item icon={<Copy />} onSelect={run(() => navigator.clipboard?.writeText(profile.email))} value="copy email">
            Copy email address
          </Item>
          <Item icon={<Mail />} onSelect={run(() => (window.location.href = `mailto:${profile.email}`))} value="send email">
            Send an email
          </Item>
          {socials.map((s) => (
            <Item key={s.id} icon={<SocialIcon id={s.id} />} onSelect={openUrl(s.url)} value={`${s.id} ${s.label}`} hint={<ExternalLink className="size-3" />}>
              {s.label}
            </Item>
          ))}
          {profile.resumeUrl && (
            <Item icon={<FileText />} onSelect={openUrl(profile.resumeUrl)} value="resume cv">
              Resume
            </Item>
          )}
        </Command.Group>

        <Command.Group heading="Theme">
          <Item icon={mode === 'dark' ? <Sun /> : <Moon />} onSelect={run(() => onMode(mode === 'dark' ? 'light' : 'dark'))} value="theme mode toggle light dark">
            Switch to {mode === 'dark' ? 'light' : 'dark'} mode
          </Item>
          {PALETTES.map((p) => (
            <Item key={p.id} icon={<Palette />} onSelect={run(() => onPalette(p.id))} value={`palette theme ${p.name}`} hint={p.note}>
              Palette: {p.name}
            </Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}

function Item({ children, icon, onSelect, value, hint }: { children: ReactNode; icon: ReactNode; onSelect: () => void; value: string; hint?: ReactNode }) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2.5 text-sm text-ink-2 data-[selected=true]:bg-ink data-[selected=true]:text-bg data-[selected=true]:[&_svg]:text-accent [&_svg]:size-4 [&_svg]:flex-none [&_svg]:text-ink-3"
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {hint && <span className="font-mono text-[11px] text-ink-3">{hint}</span>}
    </Command.Item>
  )
}
