/**
 * Contact form delivery. The inbox address lives in the CONTACT_TO Pages
 * secret, so it is not in the page, the client bundle, or this repository.
 * Mail is handed to FormSubmit, which delivers it to that inbox. Reply-To is
 * the person who wrote, so a reply goes back to them.
 */

const PROJECTS = new Set(['Branding', 'A website', 'Strategy', 'All of it', 'Something else'])
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactEnv = {
  CONTACT_TO?: string
}

type Submission = {
  name: string
  email: string
  project: string
  message: string
  honeypot: string
}

function clean(value: string, max: number) {
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function page(title: string, body: string, status: number) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#0e1218;color:#e8edf5;font-family:system-ui,sans-serif">
    <main style="max-width:36rem;margin:4rem auto;padding:0 1.25rem">
      ${body}
      <p style="margin-top:2rem"><a href="/" style="color:#c8f235">Back to Spark Fuel</a></p>
    </main>
  </body>
</html>`
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  })
}

function respond(request: Request, status: number, error?: string) {
  const json = (request.headers.get('content-type') ?? '').includes('application/json')
  if (json) {
    return Response.json(
      error ? { ok: false, error } : { ok: true },
      { status, headers: { 'cache-control': 'no-store' } },
    )
  }
  if (error) {
    return page('Couldn’t send that | Spark Fuel', `<h1>Couldn’t send that.</h1><p>${escapeHtml(error)}</p>`, status)
  }
  return page(
    'Message sent | Spark Fuel',
    '<h1>Got it.</h1><p>I’ll read this and write back soon.</p>',
    status,
  )
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

async function readSubmission(request: Request): Promise<Submission | null> {
  const type = request.headers.get('content-type') ?? ''
  try {
    if (type.includes('application/json')) {
      const data = (await request.json()) as Record<string, unknown>
      return {
        name: typeof data.name === 'string' ? data.name : '',
        email: typeof data.email === 'string' ? data.email : '',
        project: typeof data.project === 'string' ? data.project : '',
        message: typeof data.message === 'string' ? data.message : '',
        honeypot: typeof data.spark_hp === 'string' ? data.spark_hp : '',
      }
    }
    const form = await request.formData()
    const read = (key: string) => {
      const value = form.get(key)
      return typeof value === 'string' ? value : ''
    }
    return {
      name: read('name'),
      email: read('email'),
      project: read('project'),
      message: read('message'),
      honeypot: read('spark_hp'),
    }
  } catch {
    return null
  }
}

export async function onRequestPost(context: { request: Request; env: ContactEnv }) {
  const { request, env } = context
  if (!sameOrigin(request)) return respond(request, 403, 'Couldn’t send that from this page.')

  const submission = await readSubmission(request)
  if (!submission) return respond(request, 400, 'Check the form and try again.')
  if (submission.honeypot.trim()) return respond(request, 200)

  const name = clean(submission.name, 80)
  const email = clean(submission.email, 120)
  const message = submission.message.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, 4000)
  const project = PROJECTS.has(submission.project) ? submission.project : ''

  if (!name || !email || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return respond(request, 400, 'Check the form and try again.')
  }

  if (!env.CONTACT_TO) return respond(request, 503, 'The form is offline right now. Try again in a little while.')

  const subjectBase = project ? `${project} — ${name}` : `New spark from ${name}`
  const subject = subjectBase.slice(0, 120)
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    ...(project ? [`Project: ${project}`] : []),
    '',
    message,
  ].join('\n')

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(env.CONTACT_TO)}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        origin: 'https://sparkfuel.co',
        referer: 'https://sparkfuel.co/contact',
        'user-agent': 'Mozilla/5.0 SparkFuelContact/1.0',
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: subject,
        _template: 'box',
        _captcha: 'false',
        message: text,
      }),
    })
    const data = (await response.json().catch(() => null)) as { success?: boolean | string } | null
    const delivered = data?.success === true || data?.success === 'true'
    if (!response.ok || !delivered) throw new Error('delivery failed')
  } catch {
    console.error('contact send failed')
    return respond(request, 502, 'Couldn’t send that. Try again in a moment.')
  }

  return respond(request, 200)
}
