/**
 * POST /api/contact — Cloudflare Pages Function.
 *
 * 1. Validates the form fields and drops honeypot submissions.
 * 2. Verifies the Cloudflare Turnstile token (when TURNSTILE_SECRET_KEY is set).
 * 3. Emails the message to you through Resend, with Reply-To set to the sender.
 *
 * Environment variables (Pages → Settings → Variables and Secrets):
 *   RESEND_API_KEY        required  API key from resend.com
 *   CONTACT_TO            required  where messages are delivered (your inbox)
 *   CONTACT_FROM          optional  verified sender, default "Portfolio <onboarding@resend.dev>"
 *   TURNSTILE_SECRET_KEY  optional  Turnstile secret; when set, a valid token is required
 */

interface Env {
  RESEND_API_KEY?: string
  CONTACT_TO?: string
  CONTACT_FROM?: string
  TURNSTILE_SECRET_KEY?: string
}

type Context = { request: Request; env: Env }

const MAX_BODY = 20_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) return json(500, { error: 'The contact form is not configured yet.' })

  const raw = await request.text()
  if (raw.length > MAX_BODY) return json(413, { error: 'Message is too long.' })

  let input: Record<string, unknown>
  try {
    input = JSON.parse(raw)
  } catch {
    return json(400, { error: 'Invalid request.' })
  }

  const str = (k: string) => (typeof input[k] === 'string' ? (input[k] as string).trim() : '')
  const name = str('name')
  const email = str('email')
  const message = str('message')

  // Honeypot filled in: pretend success so bots don't learn anything.
  if (str('company')) return json(200, { ok: true })

  if (!name || name.length > 100) return json(400, { error: 'Please enter your name.' })
  if (!EMAIL_RE.test(email) || email.length > 200) return json(400, { error: 'Please enter a valid email address.' })
  if (message.length < 10 || message.length > 5000) return json(400, { error: 'Please write a message of at least 10 characters.' })

  if (env.TURNSTILE_SECRET_KEY) {
    const token = str('token')
    if (!token) return json(400, { error: 'Spam check missing. Please try again.' })
    const form = new FormData()
    form.append('secret', env.TURNSTILE_SECRET_KEY)
    form.append('response', token)
    const ip = request.headers.get('CF-Connecting-IP')
    if (ip) form.append('remoteip', ip)
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
    const outcome = (await verify.json()) as { success?: boolean }
    if (!outcome.success) return json(403, { error: 'Spam check failed. Please try again.' })
  }

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n—\n${name} <${email}>`,
    }),
  })
  if (!sent.ok) return json(502, { error: "Couldn't send right now." })

  return json(200, { ok: true })
}

export const onRequest = () => json(405, { error: 'Method not allowed.' })
