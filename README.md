# Ravi Varujana — Portfolio

React 19 + TypeScript + Vite + Tailwind CSS v4. UI: Radix Dialog (case studies), cmdk (⌘K / Ctrl K command menu), Motion (scroll reveals), lucide-react (icons).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve the production build
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages). No server routes are needed; case studies use hash links (`/#work/<id>`).

## Editing content

All content lives in **`src/data/portfolio.json`**. Types are in `src/data/index.ts`, and the build fails if a field has the wrong shape.

| Key | What it drives |
| --- | --- |
| `profile` | Hero, whoami.json tab, contact. Set `resumeUrl` (e.g. `/resume.pdf` in `public/`) to show Resume buttons. Set `phone` to show it in Contact. |
| `socials` | Social links. Only entries with a `url` are shown (Contact, footer, ⌘K). `"hero": true` also puts one in the hero. Supported `id`s: `github`, `linkedin`, `x`, `instagram`, `leetcode`, `medium`, `devto`, `blog`, `youtube`, `website`. |
| `photography` | The photo gallery. Hidden (and left out of the nav) until `photos` has entries. See below. |
| `metrics` | The four headline numbers under the hero. |
| `about` | About paragraphs and the four focus areas. |
| `experience` | Timeline. Wrap text in `**double asterisks**` to bold it. |
| `caseStudies` | Cards and their pop-up write-ups (see below). |
| `skills` | Toolkit rows. Items listed in `key` are highlighted. |
| `learning` | The AI/ML section. Each track is marked "learning". |
| `contact` | Contact heading and note. |

### Writing up a case study

Each case study's `details` array is rendered in order inside the pop-up. The panel grows to fit the content: short write-ups stay compact, and long ones scroll inside the panel. Each block takes a `heading` plus any mix of:

```json
{
  "heading": "How it works",
  "body": "A paragraph. **Bold** is supported.",
  "points": ["A bullet", "Another bullet"],
  "code": { "lang": "ts", "content": "await queue.add('sync-rates', {}, { repeat: { cron: '*/5 * * * *' } })" }
}
```

Set `"featured": true` and a `metric` to give a case study the wide card with the before/after bar.

### Photos on Cloudflare R2

1. Create an R2 bucket and connect a **custom domain** to it (e.g. `photos.yourdomain.com`), or enable the public `r2.dev` URL.
2. Remove location data before uploading: `exiftool -all= -overwrite_original *.jpg`.
3. Upload photos, then set `photography.baseUrl` to that domain and add one entry per photo:

```json
{ "src": "2026/coorg-ridge.jpg", "alt": "Hills at sunset in Coorg", "width": 6000, "height": 4000,
  "caption": "Evening over the ridge", "location": "Coorg", "camera": "Sony A7 III · 35mm" }
```

`width`/`height` are the original pixel size (used to reserve space, so nothing jumps while loading). `caption`, `location` and `camera` are optional.

**Resizing:** with a custom domain on a Cloudflare zone, turn on *Images → Transformations* for the zone and set `"cloudflareResize": true`. Visitors then get appropriately sized WebP/AVIF versions (`/cdn-cgi/image/width=…,format=auto/…`) instead of the full-size originals. Without it, upload web-sized JPEGs (about 2400px on the long edge, under 500 KB).

An Instagram link under the gallery appears automatically when the `instagram` social has a URL.

## Theme

Four palettes, each with light and dark: **Dusk sky** (default), **Ghibli summer**, **Tokyo night** and **Sumi ink**. Visitors pick from the palette button in the header or ⌘K; light/dark defaults to their system setting, and both choices are remembered.

Colours are CSS variables in `src/index.css` (one block per palette and mode). The list shown in the menu is `src/lib/themes.ts`. To change the default palette, update `DEFAULT_PALETTE` there and the pre-paint script in `index.html`. Texture utilities: `panel` (comic panel border + hard shadow), `screentone` (halftone dots), `focus-lines` (hero background).

Each section's Japanese subtitle is the `jp` prop on `<Section>`.

## SEO

Meta tags and JSON-LD are in `index.html` (add new social URLs to `sameAs` there too). Once the domain is known, add `<link rel="canonical">`, `og:url`, an `og:image` (1200×630 in `public/`), and a `Sitemap:` line in `public/robots.txt`.
