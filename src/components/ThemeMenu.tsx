import * as Menu from '@radix-ui/react-dropdown-menu'
import { Check, Moon, Palette, Sun } from 'lucide-react'
import { PALETTES, type Mode, type PaletteId } from '../lib/themes'

type Props = {
  mode: Mode
  palette: PaletteId
  onMode: (m: Mode) => void
  onPalette: (p: PaletteId) => void
}

const item =
  'flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-[4px] px-2.5 text-sm text-ink outline-none data-[highlighted]:bg-ink data-[highlighted]:text-bg'

export function ThemeMenu({ mode, palette, onMode, onPalette }: Props) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Change theme"
        className="inline-flex size-10 items-center justify-center rounded-[4px] border-2 border-edge bg-surface text-ink transition-colors hover:bg-surface-2 data-[state=open]:bg-ink data-[state=open]:text-bg"
      >
        <Palette className="size-4" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[60] w-[min(280px,calc(100vw-24px))] rounded-[6px] border-2 border-edge bg-surface p-1.5 shadow-[5px_5px_0_var(--color-shadow)]"
        >
          <Menu.Label className="label px-2.5 pb-1 pt-2">Palette</Menu.Label>
          <Menu.RadioGroup value={palette} onValueChange={(v) => onPalette(v as PaletteId)}>
            {PALETTES.map((p) => (
              <Menu.RadioItem key={p.id} value={p.id} className={item}>
                <span aria-hidden className="flex flex-none -space-x-1.5">
                  {p.swatch.map((c) => (
                    <span key={c} className="size-4 rounded-full border-2 border-surface ring-1 ring-edge/40" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="font-semibold">{p.name}</span>
                  <span className="truncate font-mono text-[11px] opacity-70">{p.note}</span>
                </span>
                <Menu.ItemIndicator>
                  <Check className="size-4" aria-hidden />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>

          <Menu.Separator className="mx-1 my-1.5 h-0.5 bg-line-2" />

          <Menu.Label className="label px-2.5 pb-1 pt-1">Mode</Menu.Label>
          <Menu.RadioGroup value={mode} onValueChange={(v) => onMode(v as Mode)} className="grid grid-cols-2 gap-1">
            {(['light', 'dark'] as const).map((m) => (
              <Menu.RadioItem
                key={m}
                value={m}
                className={`${item} justify-center border-2 border-transparent capitalize data-[state=checked]:border-edge`}
              >
                {m === 'light' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
                {m}
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
