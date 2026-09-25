import { portfolio } from '../data'

export const hasPhotos = portfolio.photography.photos.length > 0

/** Section order in the page and nav. The photos entry only exists once photos are added. */
export const NAV_ITEMS = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'work', label: 'work' },
  { id: 'stack', label: 'stack' },
  { id: 'learning', label: 'ai/ml' },
  ...(hasPhotos ? [{ id: 'photos', label: 'photos' }] : []),
  { id: 'contact', label: 'contact' },
]

export const NAV_IDS = NAV_ITEMS.map((n) => n.id)

/** Two-digit section number, e.g. sectionIndex('contact') -> "07" */
export const sectionIndex = (id: string) => String(NAV_IDS.indexOf(id) + 1).padStart(2, '0')
