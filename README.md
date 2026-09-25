# Ravi Varujana — Portfolio

React 19 + TypeScript + Vite + Tailwind CSS v4. UI: Radix Dialog (case studies, photo viewer), cmdk (⌘K / Ctrl K command menu), Motion (animations), lucide-react (icons), Geist fonts.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve the production build
```

Deploy to **Cloudflare Pages** (build command `npm run build`, output `dist`). The contact form's backend lives in `functions/api/contact.ts`, which Pages deploys automatically. On other static hosts the site works, but the form falls back to "email me directly".

The previous anime-style version is saved in `archive/anime-theme-2026-09-25.tar.gz`.

## Editing content

All content lives in **`src/data/portfolio.json`**. Types are in `src/data/index.ts`, and the build fails if a field has the wrong shape.

| Key | What it drives |
| --- | --- |
| `profile` | Hero, whoami.json tab, contact. `resumeUrl` points at `public/ravi-varujana-resume.pdf`; replace that file to update the resume. `whatsapp.number` (digits with country code) and `whatsapp.message` (pre-filled text) drive the WhatsApp buttons; empty number hides them. |
| `socials` | Social links. Only entries with a `url` are shown (Contact, footer, ⌘K). `"hero": true` also puts one in the hero. Supported `id`s: `github`, `linkedin`, `x`, `instagram`, `leetcode`, `medium`, `devto`, `blog`, `youtube`, `website`. |
| `photography` | The photo gallery. Hidden (and left out of the nav) until `photos` has entries. See below. |
| `about` | About paragraphs and the four focus areas. |
| `experience` | Timeline. Wrap text in `**double asterisks**` to bold it. `visiblePoints` shows only the first N bullets with a "Show more" toggle. |
| `caseStudies` | Case studies. The first `caseStudiesPreview` (default 3) show as cards; all of them are in the "view all" popup (list + detail on tablet/desktop, accordions on phones). Order matters: put your strongest first. |
| `skills` | Toolkit rows. Items listed in `key` are highlighted. |
| `learning` | The AI/ML section. Each track is marked "learning". |
| `contact` | Contact heading, note, and `form` settings (endpoint and Turnstile site key). |

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

## Contact form setup (Cloudflare Pages)

The form posts to `/api/contact` (`functions/api/contact.ts`), which checks the spam token and emails you the message with Reply-To set to the sender.

1. **Email delivery:** create a free account at resend.com and an API key. Without your own domain verified, Resend's test sender (`onboarding@resend.dev`) can only deliver to the email you signed up with, which is fine for a personal contact form.
2. **Turnstile:** Cloudflare dashboard → Turnstile → Add widget → add your site's domain (and `localhost` for testing). You get a **site key** (public) and a **secret key**.
3. Put the site key in `contact.form.turnstileSiteKey` in `portfolio.json`.
4. In Pages → Settings → Variables and Secrets, add:
   - `RESEND_API_KEY`: your Resend key
   - `CONTACT_TO`: the inbox that should receive messages
   - `TURNSTILE_SECRET_KEY`: the Turnstile secret
   - `CONTACT_FROM` (optional): e.g. `Ravi <hello@yourdomain.com>` once you verify a domain in Resend
5. Redeploy.

Why Turnstile: public forms get found by spam bots quickly. The widget (invisible for most visitors) gives each real submission a one-time token, and the function asks Cloudflare to confirm it before sending anything. A hidden honeypot field catches the simplest bots as a second layer.

For local testing you can use Cloudflare's test keys: site key `1x00000000000000000000AA` and secret `1x0000000000000000000000000000000AA` always pass.

## Theme

Light and dark, defaulting to the visitor's system setting; the header toggle switches with a circular reveal (in browsers that support it) and the choice is remembered. Colours are CSS variables in `src/index.css`: light under `@theme`, dark under `:root[data-theme='dark']`. Utilities: `spotlight` (cursor-following border glow on cards), `dot-grid` (hero diagram background).

## SEO

Meta tags and JSON-LD are in `index.html` (add new social URLs to `sameAs` there too). Once the domain is known, add `<link rel="canonical">`, `og:url`, an `og:image` (1200×630 in `public/`), and a `Sitemap:` line in `public/robots.txt`.
