'use client'

import { type FormEvent, type ReactNode, useId, useRef, useState } from 'react'

import type { Form } from '@/payload-types'

type Field = NonNullable<Form['fields']>[number]

const describeUpload = (field: Extract<Field, { blockType: 'upload' }>) => {
  const types = (field.mimeTypes ?? [])
    .map(({ mimeType }) => (mimeType.includes('pdf') ? 'PDF' : mimeType.includes('word') ? 'Word' : null))
    .filter(Boolean)
  const size = field.maxFileSize ? `up to ${Math.round(field.maxFileSize / 1_000_000)}MB` : ''
  return [[...new Set(types)].join(' or '), size].filter(Boolean).join(', ')
}

function UploadField({ field, inputId }: { field: Extract<Field, { blockType: 'upload' }>; inputId: string }) {
  const [fileName, setFileName] = useState<string | null>(null)
  const accept = field.mimeTypes?.map(({ mimeType }) => mimeType).join(',')

  return (
    <label className="upload" htmlFor={inputId}>
      <span aria-hidden className="upload-icon">
        <i className="fa-solid fa-file-arrow-up" />
      </span>
      <span className="upload-text">
        <strong>{fileName ?? field.label ?? 'Upload a file'}</strong>
        <small>{describeUpload(field)}</small>
      </span>
      <input
        accept={accept}
        id={inputId}
        multiple={field.multiple ?? false}
        name={field.name}
        onChange={(e) => setFileName([...(e.target.files ?? [])].map((file) => file.name).join(', ') || null)}
        required={field.required ?? false}
        type="file"
      />
    </label>
  )
}

export function FormClient({
  formId,
  fields,
  messages,
  submitLabel,
  confirmation,
  redirect,
  title,
  subtitle,
  jobId,
  onDark,
  successAction,
}: {
  formId: number
  fields: Field[]
  messages: Record<number, ReactNode>
  submitLabel: string
  confirmation: ReactNode
  redirect?: string
  title?: string | null
  subtitle?: string | null
  jobId?: number
  onDark?: boolean
  successAction?: ReactNode
}) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    const body = new FormData()
    const submissionData: { field: string; value: string }[] = []

    for (const field of fields) {
      if (!('name' in field)) continue
      if (field.blockType === 'upload') {
        const files = data.getAll(field.name).filter((file): file is File => file instanceof File && file.size > 0)
        const tooBig = field.maxFileSize && files.some((file) => file.size > field.maxFileSize!)
        if (tooBig) {
          setError(`${field.label ?? 'File'} is too large.`)
          return
        }
        files.forEach((file) => body.append(field.name, file))
      } else if (field.blockType === 'checkbox') {
        submissionData.push({ field: field.name, value: data.get(field.name) ? 'Yes' : 'No' })
      } else {
        submissionData.push({ field: field.name, value: String(data.get(field.name) ?? '') })
      }
    }

    body.append('_payload', JSON.stringify({ form: formId, submissionData, ...(jobId ? { job: jobId } : {}) }))

    setStatus('sending')
    try {
      const res = await fetch('/api/form-submissions', { method: 'POST', body })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.errors?.[0]?.data?.errors?.[0]?.message ?? json?.errors?.[0]?.message ?? 'Something went wrong.')
      }
      if (redirect) {
        window.location.href = redirect
        return
      }
      setStatus('sent')
      formRef.current?.closest('section, .apply-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  // Message fields after the last input (e.g. a privacy note) go under the button.
  const lastInput = fields.reduce((last, field, i) => (field.blockType === 'message' ? last : i), -1)
  const trailing = fields.map((_, i) => i).filter((i) => i > lastInput && messages[i])

  if (status === 'sent') {
    return (
      <div className={`form-success${onDark ? ' on-dark' : ''}`} role="status">
        <span aria-hidden className="tick">
          <i className="fa-solid fa-check" />
        </span>
        {confirmation}
        {successAction}
      </div>
    )
  }

  return (
    <form className={`form${onDark ? ' on-dark' : ''}`} onSubmit={onSubmit} ref={formRef}>
      {title && <span className="form-title">{title}</span>}
      {subtitle && <span className="form-subtitle">{subtitle}</span>}

      <div className="fields">
        {fields.map((field, i) => {
          if (field.blockType === 'message') {
            if (i > lastInput) return null
            return (
              <div className="field" key={field.id ?? i}>
                {messages[i]}
              </div>
            )
          }

          const inputId = `${id}-${field.name}`
          const half = field.width && field.width <= 50 ? ' half' : ''
          const required = field.required ?? false

          switch (field.blockType) {
            case 'text':
            case 'email':
            case 'number':
              return (
                <div className={`field${half}`} key={field.id ?? i}>
                  <label className="visually-hidden" htmlFor={inputId}>
                    {field.label}
                  </label>
                  <input
                    autoComplete={field.blockType === 'email' ? 'email' : undefined}
                    defaultValue={'defaultValue' in field ? (field.defaultValue ?? undefined) : undefined}
                    id={inputId}
                    name={field.name}
                    placeholder={`${field.label ?? field.name}${required ? '' : ' (optional)'}`}
                    required={required}
                    type={field.blockType === 'text' && /phone|tel/i.test(field.name) ? 'tel' : field.blockType}
                  />
                </div>
              )
            case 'textarea':
              return (
                <div className={`field${half}`} key={field.id ?? i}>
                  <label className="visually-hidden" htmlFor={inputId}>
                    {field.label}
                  </label>
                  <textarea
                    defaultValue={field.defaultValue ?? undefined}
                    id={inputId}
                    name={field.name}
                    placeholder={field.label ?? undefined}
                    required={required}
                    rows={5}
                  />
                </div>
              )
            case 'select':
              return (
                <div className={`field${half}`} key={field.id ?? i}>
                  <label className="field-label" htmlFor={inputId}>
                    {field.label}
                    {required && ' *'}
                  </label>
                  <select defaultValue={field.defaultValue ?? ''} id={inputId} name={field.name} required={required}>
                    <option disabled value="">
                      {field.placeholder || 'Select…'}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option.id ?? option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            case 'radio':
              return (
                <fieldset className={`field${half}`} key={field.id ?? i}>
                  {field.label && (
                    <legend className="field-label">
                      {field.label}
                      {required && ' *'}
                    </legend>
                  )}
                  <div className="choices">
                    {field.options?.map((option, j) => (
                      <label key={option.id ?? option.value}>
                        <input
                          defaultChecked={field.defaultValue ? field.defaultValue === option.value : false}
                          name={field.name}
                          required={required && j === 0}
                          type="radio"
                          value={option.value}
                        />
                        <span className="pill">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )
            case 'checkbox':
              return (
                <div className="field" key={field.id ?? i}>
                  <label className="checkbox">
                    <input defaultChecked={field.defaultValue ?? false} name={field.name} required={required} type="checkbox" />
                    <span>{field.label}</span>
                  </label>
                </div>
              )
            case 'upload':
              return (
                <div className={`field${half}`} key={field.id ?? i}>
                  <UploadField field={field} inputId={inputId} />
                </div>
              )
            default:
              return null
          }
        })}
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="btn primary" disabled={status === 'sending'} type="submit">
        {status === 'sending' ? 'Sending…' : submitLabel}
        <i aria-hidden className="fa-solid fa-arrow-right" />
      </button>

      {trailing.map((i) => (
        <div key={i}>{messages[i]}</div>
      ))}
    </form>
  )
}
