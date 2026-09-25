import { portfolio, type Photo } from '../data'

const { baseUrl, cloudflareResize } = portfolio.photography
const base = baseUrl.replace(/\/+$/, '')
const isAbsolute = (src: string) => /^https?:\/\//.test(src)
const key = (src: string) => src.replace(/^\/+/, '')

export const WIDTHS = [480, 800, 1200, 1800, 2400]

/**
 * Public URL for a photo. With `cloudflareResize` on, sizes come from Cloudflare Image
 * Transformations on the same zone as the R2 custom domain:
 *   https://photos.example.com/cdn-cgi/image/width=800,quality=82,format=auto/<key>
 */
export function photoUrl(src: string, width?: number) {
  if (isAbsolute(src)) return src
  const full = `${base}/${key(src)}`
  if (!width || !cloudflareResize || !base) return full
  return `${base}/cdn-cgi/image/width=${width},quality=82,format=auto/${key(src)}`
}

export function photoSrcSet(photo: Photo) {
  if (!cloudflareResize || isAbsolute(photo.src)) return undefined
  return WIDTHS.filter((w) => w <= photo.width * 1.1)
    .map((w) => `${photoUrl(photo.src, w)} ${w}w`)
    .join(', ')
}
