import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { portfolio, social, type Photo } from '../data'
import { photoSrcSet, photoUrl } from '../lib/photos'
import { sectionIndex } from './nav'
import { btn, Reveal, Section } from './ui'
import { SocialIcon } from './SocialIcon'

const { photography } = portfolio
const { photos } = photography

export function Photography() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const instagram = social('instagram')
  if (photos.length === 0) return null

  return (
    <Section id="photos" index={sectionIndex('photos')} name="Photography" title={photography.title} sub={photography.intro}>
      <div className="columns-1 gap-4 min-[480px]:columns-2 lg:columns-3">
        {photos.map((p, i) => (
          <Reveal key={p.src} delay={(i % 3) * 0.05} className="mb-4 break-inside-avoid">
            <figure className="group">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-haspopup="dialog"
                aria-label={`View photo: ${p.alt}`}
                className="block w-full overflow-hidden rounded-xl bg-bg-2"
              >
                <img
                  src={photoUrl(p.src, 800)}
                  srcSet={photoSrcSet(p)}
                  sizes="(min-width: 1024px) 380px, (min-width: 480px) 50vw, 100vw"
                  width={p.width}
                  height={p.height}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
              </button>
              <PhotoMeta photo={p} className="px-0.5 pt-2.5" />
            </figure>
          </Reveal>
        ))}
      </div>

      {instagram && (
        <Reveal className="mt-4">
          <a href={instagram.url} target="_blank" rel="noopener" className={btn.ghost}>
            <SocialIcon id="instagram" className="size-4" /> More on Instagram <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      )}

      <Lightbox index={openIndex} onIndex={setOpenIndex} />
    </Section>
  )
}

function PhotoMeta({ photo, className }: { photo: Photo; className?: string }) {
  const meta = [photo.location, photo.camera].filter(Boolean).join(' · ')
  if (!photo.caption && !meta) return null
  return (
    <figcaption className={className}>
      {photo.caption && <p className="text-sm font-medium leading-snug">{photo.caption}</p>}
      {meta && <p className="mt-0.5 font-mono text-[11.5px] text-ink-3">{meta}</p>}
    </figcaption>
  )
}

function Lightbox({ index, onIndex }: { index: number | null; onIndex: (i: number | null) => void }) {
  const startX = useRef<number | null>(null)
  const photo = index === null ? null : photos[index]
  const go = (delta: number) => index !== null && onIndex((index + delta + photos.length) % photos.length)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }
  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  const ctrl =
    'grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20'

  return (
    <Dialog.Root open={photo !== null} onOpenChange={(o) => !o && onIndex(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[70] bg-black/96" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          className="dialog-overlay fixed inset-0 z-[75] flex flex-col px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-[max(12px,env(safe-area-inset-top))] text-white outline-none sm:px-6"
        >
          {photo && (
            <>
              <div className="flex flex-none items-center justify-between gap-3">
                <p className="font-mono text-xs text-white/70">
                  {String(index! + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </p>
                <Dialog.Title className="sr-only">{photo.caption || photo.alt}</Dialog.Title>
                <Dialog.Close className={ctrl} aria-label="Close">
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>

              <div
                className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center py-3"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
              >
                <img
                  key={photo.src}
                  src={photoUrl(photo.src, 2400)}
                  srcSet={photoSrcSet(photo)}
                  sizes="100vw"
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  draggable={false}
                  className="max-h-full w-auto max-w-full select-none object-contain"
                />
              </div>

              <div className="flex flex-none items-center justify-between gap-4">
                {photos.length > 1 ? (
                  <button type="button" onClick={() => go(-1)} className={ctrl} aria-label="Previous photo">
                    <ChevronLeft className="size-5" aria-hidden />
                  </button>
                ) : <span />}
                <div className="min-w-0 text-center [&_p]:text-white [&_p+p]:text-white/65">
                  <PhotoMeta photo={photo} />
                </div>
                {photos.length > 1 ? (
                  <button type="button" onClick={() => go(1)} className={ctrl} aria-label="Next photo">
                    <ChevronRight className="size-5" aria-hidden />
                  </button>
                ) : <span />}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
