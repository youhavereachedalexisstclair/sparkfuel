import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { OrbitSparks } from '../components/OrbitSparks'
import { SparkMark } from '../components/SparkMark'

const PROJECTS = ['Branding', 'A website', 'Strategy', 'All of it', 'Something else'] as const

type FieldName = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<FieldName, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) errors.name = 'Add your name.'
  if (!email.trim()) errors.email = 'Add your email, so I can write back.'
  else if (!EMAIL_PATTERN.test(email.trim()) || email.trim().length > 120) {
    errors.email = 'That email doesn’t look right.'
  }
  if (!message.trim()) errors.message = 'Add a message.'
  else if (message.trim().length < 10) errors.message = 'Tell me a little more, so I know how to help.'
  return errors
}

export function ContactPage() {
  const nameId = useId()
  const emailId = useId()
  const projectId = useId()
  const messageId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [project, setProject] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (status === 'sent') headingRef.current?.focus()
  }, [status])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(name, email, message)
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          project,
          message: message.trim(),
          spark_hp: company,
        }),
      })
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!response.ok || !data?.ok) {
        setStatus('error')
        setFormError(data?.error || 'Couldn’t send that. Try again in a moment.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setFormError('Couldn’t send that. Try again in a moment.')
    }
  }

  if (status === 'sent') {
    return (
      <main className="contact-page">
        <p className="eyebrow">
          <SparkMark className="eyebrow-spark" />
          Ignition
        </p>
        <h1 ref={headingRef} tabIndex={-1}>
          Got it.
        </h1>
        <p className="contact-page-lede">I’ll read this and write back soon.</p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setName('')
            setEmail('')
            setProject('')
            setMessage('')
            setCompany('')
            setErrors({})
            setFormError('')
            setStatus('idle')
          }}
        >
          Send another
        </button>
      </main>
    )
  }

  return (
    <main className="contact-page">
      <p className="eyebrow">
        <SparkMark className="eyebrow-spark" />
        Ignition
      </p>
      <h1 ref={headingRef}>Got a spark that needs fuel?</h1>
      <p className="contact-page-lede">
        Tell me what you’re building: branding, a website, strategy, or all of it. I’ll write back.
      </p>

      <form className="contact-form" noValidate onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor={nameId}>
            Name <abbr title="required">*</abbr>
          </label>
          <input
            id={nameId}
            name="name"
            autoComplete="name"
            maxLength={80}
            value={name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            onChange={(event) => {
              setName(event.target.value)
              setErrors((current) => ({ ...current, name: undefined }))
            }}
          />
          {errors.name ? (
            <p id={`${nameId}-error`} className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={emailId}>
            Email <abbr title="required">*</abbr>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={120}
            value={email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
          />
          {errors.email ? (
            <p id={`${emailId}-error`} className="field-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={projectId}>
            What do you need? <span>Optional</span>
          </label>
          <select
            id={projectId}
            name="project"
            value={project}
            onChange={(event) => setProject(event.target.value)}
          >
            <option value="">Choose one</option>
            {PROJECTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={messageId}>
            Message <abbr title="required">*</abbr>
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={6}
            maxLength={4000}
            value={message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            onChange={(event) => {
              setMessage(event.target.value)
              setErrors((current) => ({ ...current, message: undefined }))
            }}
          />
          {errors.message ? (
            <p id={`${messageId}-error`} className="field-error">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="field-honey" aria-hidden="true">
          <label>
            Leave this empty
            <input
              name="spark_hp"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </label>
        </div>

        {formError ? (
          <p className="form-error" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="contact-cta-wrap">
          <OrbitSparks />
          <button className="btn btn-spark btn-lg" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send it'}
          </button>
        </div>
      </form>
    </main>
  )
}
