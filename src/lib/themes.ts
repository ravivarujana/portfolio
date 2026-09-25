export const PALETTES = [
  { id: 'dusk', name: 'Dusk sky', note: 'Indigo, sakura, gold', swatch: ['#1d1b3a', '#c42d63', '#f2b33d'], bg: { light: '#f4f2fb', dark: '#12112a' } },
  { id: 'ghibli', name: 'Ghibli summer', note: 'Teal, grass, sunflower', swatch: ['#123a44', '#2e7d4f', '#f5c518'], bg: { light: '#eef6fb', dark: '#0d2329' } },
  { id: 'tokyo', name: 'Tokyo night', note: 'Navy, neon cyan, magenta', swatch: ['#101a33', '#00a6d6', '#ff3d8b'], bg: { light: '#f1f3f7', dark: '#0a0f1f' } },
  { id: 'sumi', name: 'Sumi ink', note: 'Paper, ink, vermilion', swatch: ['#1a1612', '#c8331c', '#f3eee3'], bg: { light: '#f3eee3', dark: '#121118' } },
] as const

export type PaletteId = (typeof PALETTES)[number]['id']
export type Mode = 'light' | 'dark'

/** Keep in sync with the pre-paint script in index.html. */
export const DEFAULT_PALETTE: PaletteId = 'dusk'
